import { createPageScriptChannel } from "devframe/in-page-channel";
import type { gsap as Gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { createAnimationRegistry, replayUnavailable, targetMatchRank } from "./animation-registry";
import { createElementPicker } from "./element-picker";
import {
  applyEdit,
  CONFIG_VARS,
  easeIsSet,
  inspect,
  isStaggered,
  methodOf,
  snapshotEditable,
} from "./gsap-edit";
import {
  type AnimationDetail,
  type AnimationEdit,
  type EditRecord,
  type AnimationRow,
  type ControlAction,
  NUGGET_CHANNEL,
  type NuggetChannelProtocol,
  type NuggetState,
} from "./protocol";

type Animation = gsap.core.Tween | gsap.core.Timeline;

/** Rows kept for the waterfall; the oldest finished ones go first. */
const MAX_TRACKED = 300;
const CREATORS = ["to", "from", "fromTo", "timeline"] as const;

function targetsOf(animation: Animation): unknown[] {
  return "targets" in animation && typeof animation.targets === "function"
    ? (animation.targets() as unknown[])
    : [];
}

/** Tweens on plain objects come from GSAP plugins, such as ScrollSmoother's scroll proxy */
function isInternal(animation: Animation): boolean {
  const targets = targetsOf(animation);
  return targets.length > 0 && !targets.some((t) => t instanceof Element);
}

function describeTargets(animation: Animation): string {
  const targets = targetsOf(animation);
  const elements = targets.filter((t): t is Element => t instanceof Element);
  if (!elements.length) return targets.length ? `${targets.length} object(s)` : "";

  const [first] = elements;
  const tag = first.tagName.toLowerCase();
  const name = first.id ? `#${first.id}` : first.classList[0] ? `.${first.classList[0]}` : "";
  if (elements.length > 1) return `${elements.length} × ${tag}${name}`;

  const text = first.textContent?.trim().slice(0, 24);
  return `${tag}${name}${text ? ` "${text}"` : ""}`;
}

function describeVars(animation: Animation): string {
  return Object.keys(animation.vars).filter((key) => !CONFIG_VARS.has(key)).slice(0, 4).join(", ");
}

/**
 * Records every GSAP animation the app creates and serves them to Nugget devtools panels.
 * Pass the app's own `gsap` so the page script sees the same global timeline as Nugget.
 */
export type PageScriptOptions = {
  /** Source files in prompts are shown relative to this directory */
  workspaceDir?: string;
};

export function startNuggetPageScript(gsap: typeof Gsap, options: PageScriptOptions = {}) {
  // Lets the ease editor's custom curves ("M0,0 C… 1,1") run in dev. Apps that keep one need to register it themselves
  gsap.registerPlugin(CustomEase);
  const registry = createAnimationRegistry(gsap, (animation) => !isInternal(animation));
  const { tracked, idOf, find } = registry;
  const labels = new Map<string, string>();
  const parents = new Map<string, string>();
  /** Values from before the first devtools edit, by animation id */
  const originals = new Map<string, AnimationEdit>();
  const easeWasDefault = new Map<string, boolean>();

  const isFinished = (animation: Animation) => animation.totalProgress() === 1 && !animation.isActive();

  const track = <T extends Animation>(animation: T, method: string): T => {
    // Zero-length tweens (gsap.set and friends) are instant and would flood the list
    if (method !== "timeline" && animation.totalDuration() === 0) return animation;
    if (isInternal(animation)) return animation;
    const id = idOf(animation);
    labels.set(id, method);
    tracked.set(id, animation);

    if (tracked.size > MAX_TRACKED) {
      for (const [oldId, old] of tracked) {
        if (tracked.size <= MAX_TRACKED) break;
        if (isFinished(old)) tracked.delete(oldId);
      }
    }
    return animation;
  };

  // Capture animations as they are created, including ones that finish before the next frame
  for (const method of CREATORS) {
    const original = gsap[method] as (...args: unknown[]) => Animation;
    (gsap as unknown as Record<string, unknown>)[method] = (...args: unknown[]) =>
      track(original.apply(gsap, args), method);
  }
  for (const child of gsap.globalTimeline.getChildren(false, true, true)) track(child, "existing");

  const row = (animation: Animation): AnimationRow => {
    const id = idOf(animation);
    const isTimeline = animation instanceof gsap.core.Timeline;
    const method = labels.get(id) ?? (isTimeline ? "timeline" : methodOf(animation.vars));
    const vars = describeVars(animation);
    return {
      id,
      label: (animation.vars.id as string | undefined) ?? (vars ? `${method} · ${vars}` : method),
      kind: isTimeline ? "timeline" : "tween",
      targets: isTimeline ? "" : describeTargets(animation),
      start: animation.startTime(),
      duration: animation.totalDuration() / Math.abs(animation.timeScale() || 1),
      progress: animation.totalProgress(),
      paused: animation.paused(),
      active: animation.isActive() || solos.has(id),
      scroll: Boolean((animation as gsap.core.Tween).scrollTrigger ?? animation.vars.scrollTrigger),
      edited: originals.has(id),
      unavailable: replayUnavailable(elementsOf(animation)),
    };
  };

  const detail = (id: string): AnimationDetail | null => {
    const animation = find(id);
    if (!animation) return null;
    const { label, targets } = row(animation);
    const elements = targetsOf(animation).filter((t): t is Element => t instanceof Element);
    const targetsHidden =
      elements.length > 0 &&
      elements.every((el) => {
        if (!el.isConnected) return true;
        // Layout size ignores transforms, so a step that scales to 0 still counts as visible
        if (el instanceof HTMLElement) return el.offsetWidth === 0 || el.offsetHeight === 0;
        const rect = el.getBoundingClientRect();
        return rect.width === 0 && rect.height === 0;
      });
    return {
      id, label, targets, targetsHidden,
      unavailable: replayUnavailable(elementsOf(animation)),
      ...inspect(gsap, animation, originals.has(id)),
    };
  };

  const edit = (id: string, change: AnimationEdit) => {
    const animation = find(id);
    if (!(animation instanceof gsap.core.Tween)) return detail(id);
    if (replayUnavailable(elementsOf(animation))) return detail(id);
    if (!originals.has(id)) {
      originals.set(id, snapshotEditable(gsap, animation));
      easeWasDefault.set(id, !easeIsSet(gsap, animation));
    }
    applyEdit(gsap, animation, change);
    return detail(id);
  };

  type VueInstance = {
    type?: { __name?: string; name?: string; __file?: string };
    /** `vnode.ctx` is the component whose render used this one */
    vnode?: { ctx?: VueInstance | null };
    parent?: VueInstance | null;
  };
  type VueElement = { __vnode?: { ctx?: VueInstance | null }; __vueParentComponent?: VueInstance };

  const relative = (file: string) =>
    options.workspaceDir && file.startsWith(`${options.workspaceDir}/`)
      ? file.slice(options.workspaceDir.length + 1)
      : file;

  /**
   * Vue's dev build records which component's render created each element (`__vnode.ctx`), which is
   * where its markup and directives are written, even when it's slotted into another component.
   * The same link leads from a component to where it's used. Components from node_modules, such as
   * Nuxt's root, are skipped.
   */
  const componentsOf = (el: Element | undefined) => {
    const out: EditRecord["components"] = [];
    const vue = el as VueElement | undefined;
    let instance = vue?.__vnode?.ctx ?? vue?.__vueParentComponent;
    while (instance && out.length < 2) {
      const { __name, name, __file } = instance.type ?? {};
      if (__file && !__file.includes("/node_modules/")) {
        out.push({ name: __name ?? name, file: relative(__file) });
      }
      instance = instance.vnode?.ctx ?? instance.parent ?? undefined;
    }
    return out;
  };

  const timelineOf = (id: string, animation: Animation): EditRecord["timeline"] => {
    const parentId = parents.get(id);
    const parent = parentId ? find(parentId) : undefined;
    if (!(parent instanceof gsap.core.Timeline)) return undefined;
    const steps = parent.getChildren(false, true, true).filter((child) => !isInternal(child));
    return { label: row(parent).label, step: steps.indexOf(animation) + 1, steps: steps.length };
  };

  const record = (id: string): EditRecord | undefined => {
    const animation = find(id);
    const before = originals.get(id);
    if (!(animation instanceof gsap.core.Tween) || !before) return undefined;
    const { label, targets } = row(animation);
    const created = labels.get(id);
    const firstElement = targetsOf(animation).find((t): t is Element => t instanceof Element);
    return {
      id,
      label,
      method: created && created !== "existing" ? created : methodOf(animation.vars),
      targets,
      components: componentsOf(firstElement),
      timeline: timelineOf(id, animation),
      before,
      after: snapshotEditable(gsap, animation),
      easeWasDefault: easeWasDefault.get(id) ?? false,
      staggered: isStaggered(animation),
      page: location.pathname,
    };
  };

  const rows = (): AnimationRow[] => {
    const entries = registry.entries();
    parents.clear();
    return entries.map(({ id, animation, parentId, start }) => {
      if (parentId) parents.set(id, parentId);
      return { ...row(animation), parentId, start };
    });
  };

  const elementsOf = (animation: Animation): Element[] => {
    if (animation instanceof gsap.core.Timeline) {
      return animation.getChildren(true, true, false).flatMap((child) => elementsOf(child));
    }
    return targetsOf(animation).filter((target): target is Element => target instanceof Element);
  };

  /** Timeline steps playing on their own from the panel, by id */
  const solos = new Map<string, gsap.core.Tween>();
  const isStep = (animation: Animation) =>
    Boolean(animation.parent && animation.parent !== gsap.globalTimeline);

  const stopSolo = (id: string) => {
    solos.get(id)?.kill();
    solos.delete(id);
  };

  // A step only moves with its timeline's playhead, so to play it alone the timeline is held
  // still and a driver tween moves the step's progress. Plain-object targets keep it out of the list
  const playSolo = (id: string, step: Animation, fromStart: boolean) => {
    stopSolo(id);
    step.parent?.pause();
    step.paused(false);
    const from = fromStart || step.totalProgress() >= 1 ? 0 : step.totalProgress();
    const driver = { progress: from };
    const seconds = (step.totalDuration() / Math.abs(step.timeScale() || 1)) * (1 - from);
    solos.set(
      id,
      gsap.to(driver, {
        progress: 1,
        duration: seconds,
        ease: "none",
        onUpdate: () => void step.totalProgress(driver.progress),
        onComplete: () => void solos.delete(id),
      }),
    );
  };

  const pickerState: NuggetState["picker"] = { active: false, sequence: 0, ids: [], target: "" };
  const snapshot = (): NuggetState => ({
    now: gsap.globalTimeline.time(),
    paused: gsap.globalTimeline.paused(),
    speed: gsap.globalTimeline.timeScale(),
    rows: rows(),
    picker: { ...pickerState, ids: [...pickerState.ids] },
  });

  const highlight = document.createElement("div");
  highlight.style.cssText =
    "position:fixed;pointer-events:none;z-index:2147483646;outline:2px solid #e8a33d;background:rgb(232 163 61 / 0.15);display:none;transition:all 80ms";
  document.documentElement.append(highlight);

  const highlightElements = (targets: Element[]) => {
    if (!targets.length) {
      highlight.style.display = "none";
      return;
    }
    const rects = targets.map((t) => t.getBoundingClientRect());
    const left = Math.min(...rects.map((r) => r.left));
    const top = Math.min(...rects.map((r) => r.top));
    Object.assign(highlight.style, {
      display: "block",
      left: `${left}px`,
      top: `${top}px`,
      width: `${Math.max(...rects.map((r) => r.right)) - left}px`,
      height: `${Math.max(...rects.map((r) => r.bottom)) - top}px`,
    });
  };

  const showHighlight = (id: string | null) => {
    if (pickerState.active) return;
    const animation = id ? find(id) : undefined;
    highlightElements(animation ? elementsOf(animation).filter((el) => el.isConnected) : []);
  };

  const picker = createElementPicker({
    highlight: (element) => highlightElements(element ? [element] : []),
    changed: (active) => { pickerState.active = active; },
    picked: (element) => {
      const matches = registry.entries()
        .filter(({ animation }) => animation instanceof gsap.core.Tween)
        .map(({ id, animation }) => ({ id, rank: targetMatchRank(element, elementsOf(animation)) }))
        .filter(({ rank }) => Number.isFinite(rank))
        .sort((a, b) => a.rank - b.rank);
      pickerState.ids = matches.map(({ id }) => id);
      pickerState.target = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}`;
      pickerState.sequence++;
    },
  });

  const channel = createPageScriptChannel<NuggetChannelProtocol>({
    name: NUGGET_CHANNEL,
    functions: {
      setPicker: { type: "action", handler: (active: boolean) => picker.setActive(active) },
      control: {
        type: "action",
        handler: (id: string, action: ControlAction) => {
          const animation = find(id);
          if (!animation) return;
          if (action !== "pause" && replayUnavailable(elementsOf(animation))) return;
          if (isStep(animation)) {
            if (action === "pause") stopSolo(id);
            else if (action === "reverse") animation.reverse();
            else playSolo(id, animation, action === "restart");
            return;
          }
          // The timeline takes its steps back
          for (const soloId of [...solos.keys()]) stopSolo(soloId);
          // A finished animation has left the global timeline; restarting puts it back
          if (action === "play" && isFinished(animation)) animation.restart();
          else animation[action]();
        },
      },
      seek: {
        type: "action",
        handler: (id: string, progress: number) => {
          const animation = find(id);
          if (!animation) return;
          if (replayUnavailable(elementsOf(animation))) return;
          if (isStep(animation)) {
            stopSolo(id);
            animation.parent?.pause();
            animation.totalProgress(progress);
            return;
          }
          animation.pause().totalProgress(progress);
        },
      },
      setGlobal: {
        type: "action",
        handler: ({ paused, speed }: { paused?: boolean; speed?: number }) => {
          if (paused !== undefined) gsap.globalTimeline.paused(paused);
          if (speed !== undefined) gsap.globalTimeline.timeScale(speed);
        },
      },
      clearFinished: {
        type: "action",
        handler: () => {
          for (const [id, animation] of tracked) {
            if (!isFinished(animation)) continue;
            tracked.delete(id);
            originals.delete(id);
          }
          parents.clear();
        },
      },
      inspect: { handler: (id: string) => detail(id) },
      edit: { handler: (id: string, change: AnimationEdit) => edit(id, change) },
      resetEdits: {
        handler: (id: string) => {
          const original = originals.get(id);
          if (!original) return detail(id);
          const result = edit(id, original);
          originals.delete(id);
          easeWasDefault.delete(id);
          return result && { ...result, edited: false };
        },
      },
      edits: {
        handler: (ids?: string[]) => {
          const scope = ids?.length ? new Set(ids) : undefined;
          return [...originals.keys()]
            .filter((id) => !scope || scope.has(id) || scope.has(parents.get(id) ?? ""))
            .map(record)
            .filter((entry): entry is EditRecord => Boolean(entry));
        },
      },
    },
    events: {
      highlight: { handler: (id: string | null) => showHighlight(id) },
    },
  });

  // Rows are only built while a panel watches
  let timer: ReturnType<typeof setInterval> | undefined;
  void channel.sharedState.get("nugget", { initialValue: snapshot() }).then((state) => {
    const publish = () => state.mutate((draft) => Object.assign(draft, snapshot()));
    channel.events.on("panel:connected", () => {
      publish();
      timer ??= setInterval(publish, 100);
    });
    channel.events.on("panel:disconnected", () => {
      if (channel.panels.length) return;
      picker.setActive(false);
      clearInterval(timer);
      timer = undefined;
      showHighlight(null);
    });
  });

  return channel;
}
