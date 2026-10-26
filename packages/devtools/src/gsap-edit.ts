import type { gsap as Gsap } from "gsap";
import type { AnimationDetail, AnimationEdit, EditableValue } from "./protocol";

type Animation = gsap.core.Animation;
type Tween = gsap.core.Tween;
type Vars = Record<string, unknown>;

/** Keys GSAP or its plugins add to `vars`, which say nothing about what is animated */
export const CONFIG_VARS = new Set([
  "duration", "delay", "ease", "stagger", "repeat", "repeatDelay", "yoyo", "yoyoEase", "paused", "id",
  "scrollTrigger", "onComplete", "onStart", "onUpdate", "onRepeat", "onReverseComplete",
  "onInterrupt", "immediateRender", "parent", "startAt", "data", "inherit", "overwrite",
  "runBackwards", "lazy", "callbackScope", "defaults", "autoRevert", "keyframes", "easeEach",
  "repeatRefresh", "clearProps", "force3D",
]);

/** A staggered tween runs one copy per target in an internal timeline; edits go to every copy */
const internalTimeline = (tween: Tween) =>
  (tween as unknown as { timeline?: gsap.core.Timeline }).timeline || undefined;

const parts = (tween: Tween): Tween[] => {
  const timeline = internalTimeline(tween);
  return timeline ? (timeline.getChildren(false, true, false) as Tween[]) : [tween];
};

export const methodOf = (vars: Vars) => (vars.startAt ? "fromTo" : vars.runBackwards ? "from" : "to");

const isEditable = (value: unknown): value is EditableValue =>
  typeof value === "number" || typeof value === "string";

function valuesOf(vars: Vars | undefined, computed: string[]) {
  const values: Record<string, EditableValue> = {};
  for (const [key, value] of Object.entries(vars ?? {})) {
    if (CONFIG_VARS.has(key)) continue;
    if (isEditable(value)) values[key] = value;
    else computed.push(key);
  }
  return values;
}

function parseEase(gsap: typeof Gsap, ease: string) {
  try {
    const parsed = gsap.parseEase(ease);
    return typeof parsed === "function" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function staggerOf(vars: Vars, count: number): number | null {
  const { stagger } = vars;
  if (count < 2 || stagger === undefined) return null;
  if (typeof stagger === "number") return stagger;
  if (stagger && typeof stagger === "object") {
    const { each, amount } = stagger as { each?: number; amount?: number };
    if (typeof each === "number") return each;
    if (typeof amount === "number") return amount / (count - 1);
  }
  return null;
}

const round = (value: number) => Math.round(value * 1000) / 1000;

export function inspect(gsap: typeof Gsap, animation: Animation, edited: boolean) {
  const base = {
    duration: round(animation.duration()),
    delay: round(animation.delay()),
    repeat: animation.repeat(),
    yoyo: animation.yoyo(),
    edited,
  };
  // GSAP stores its default ease as a function; its documented name is power1.out
  const configured = gsap.defaults().ease;
  const defaultEase = typeof configured === "string" ? configured : "power1.out";

  if (!(animation instanceof gsap.core.Tween)) {
    return {
      ...base,
      method: "timeline",
      locked: "A timeline has no values of its own. Select one of its steps to edit it.",
      ease: "none",
      stagger: null,
      from: null,
      to: null,
      computed: [],
    } satisfies Omit<AnimationDetail, "id" | "label" | "targets" | "targetsHidden">;
  }

  const vars = animation.vars as Vars;
  const [first = animation] = parts(animation);
  const firstVars = first.vars as Vars;
  const method = methodOf(vars);
  const computed: string[] = [];
  const own = valuesOf(vars, computed);
  // Tweens without an ease inherit GSAP's default ease function into their vars
  const ease =
    typeof firstVars.ease === "string"
      ? firstVars.ease
      : !firstVars.ease || firstVars.ease === configured
        ? defaultEase
        : "";

  return {
    ...base,
    method,
    locked: vars.keyframes ? "Keyframe animations can't be edited yet." : undefined,
    duration: round(first.duration()),
    ease,
    stagger: staggerOf(vars, parts(animation).length),
    from: method === "fromTo" ? valuesOf(vars.startAt as Vars, computed) : method === "from" ? own : null,
    to: method === "from" ? null : own,
    computed,
  } satisfies Omit<AnimationDetail, "id" | "label" | "targets" | "targetsHidden">;
}

/** The fields an edit can change, read from the animation as it is now, so it can be put back */
export function snapshotEditable(gsap: typeof Gsap, tween: Tween): AnimationEdit {
  const { duration, delay, ease, stagger, repeat, yoyo, from, to } = inspect(gsap, tween, false);
  return {
    duration, delay, repeat, yoyo,
    ...(ease ? { ease } : {}),
    ...(stagger === null ? {} : { stagger }),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  };
}

/**
 * Changes a running tween in place, so references held by the app and by ScrollTrigger stay valid.
 * The tween is rendered back to the state its start values were recorded in, invalidated so GSAP
 * records them again, and returned to the progress and play state it had.
 */
export function applyEdit(gsap: typeof Gsap, tween: Tween, edit: AnimationEdit) {
  if (edit.ease !== undefined && !parseEase(gsap, edit.ease)) {
    throw new Error(`Unknown ease "${edit.ease}"`);
  }

  const vars = tween.vars as Vars;
  const method = methodOf(vars);
  const progress = tween.totalProgress();
  const paused = tween.paused();

  // from() records its end values from the element, which shows them at progress 1
  tween.pause().totalProgress(method === "from" ? 1 : 0);

  const pieces = parts(tween);
  const writeValues = (target: Vars, values: Record<string, EditableValue> | undefined) => {
    if (values) Object.assign(target, values);
  };

  for (const piece of [tween, ...pieces.filter((p) => p !== tween)]) {
    const pieceVars = piece.vars as Vars;
    if (edit.ease !== undefined) pieceVars.ease = edit.ease;
    if (method === "from") writeValues(pieceVars, edit.from);
    else writeValues(pieceVars, edit.to);
    // Copies share the parent's startAt object, so this also reaches them
    if (method === "fromTo" && piece === tween) writeValues(vars.startAt as Vars, edit.from);
  }

  const timeline = internalTimeline(tween);
  if (timeline) {
    if (edit.duration !== undefined) for (const piece of pieces) piece.duration(edit.duration);
    if (edit.stagger !== undefined) {
      const original = vars.stagger;
      const stagger =
        original && typeof original === "object"
          ? (({ amount: _amount, ...rest }) => ({ ...rest, each: edit.stagger }))(
              original as { amount?: number },
            )
          : edit.stagger;
      vars.stagger = stagger;
      const position = gsap.utils.distribute(stagger as gsap.utils.DistributeConfig);
      const targets = pieces.map((piece) => piece.targets()[0]);
      pieces.forEach((piece, i) => piece.startTime(position(i, targets[i], targets)));
    }
  } else if (edit.duration !== undefined) {
    tween.duration(edit.duration);
  }
  if (edit.duration !== undefined) vars.duration = edit.duration;

  if (edit.repeat !== undefined) tween.repeat(edit.repeat);
  if (edit.yoyo !== undefined) tween.yoyo(edit.yoyo);
  if (edit.delay !== undefined) tween.delay(edit.delay);

  tween.invalidate();
  // The parent maps its own time onto the internal timeline, so its length follows the copies
  if (timeline) tween.duration(timeline.duration());

  tween.totalProgress(progress);
  if (!paused) tween.resume();
}
