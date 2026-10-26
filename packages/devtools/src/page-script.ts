import { createPageScriptChannel } from "devframe/in-page-channel";
import type { gsap as Gsap } from "gsap";
import { applyEdit, CONFIG_VARS, inspect, methodOf, snapshotEditable } from "./gsap-edit";
import {
  type AnimationDetail,
  type AnimationEdit,
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
export function startNuggetPageScript(gsap: typeof Gsap) {
  const ids = new WeakMap<Animation, string>();
  const tracked = new Map<string, Animation>();
  const labels = new Map<string, string>();
  const parents = new Map<string, string>();
  /** Values from before the first devtools edit, by animation id */
  const originals = new Map<string, AnimationEdit>();
  let counter = 0;

  const idOf = (animation: Animation) => {
    let id = ids.get(animation);
    if (!id) {
      id = (animation.vars.id as string | undefined) ?? `a${++counter}`;
      ids.set(animation, id);
    }
    return id;
  };

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

  const row = (animation: Animation, parent?: { id: string; start: number }): AnimationRow => {
    const id = idOf(animation);
    const isTimeline = animation instanceof gsap.core.Timeline;
    const method = labels.get(id) ?? (isTimeline ? "timeline" : methodOf(animation.vars));
    const vars = describeVars(animation);
    return {
      id,
      parentId: parent?.id,
      label: (animation.vars.id as string | undefined) ?? (vars ? `${method} · ${vars}` : method),
      kind: isTimeline ? "timeline" : "tween",
      targets: isTimeline ? "" : describeTargets(animation),
      start: (parent?.start ?? 0) + animation.startTime(),
      duration: animation.totalDuration() / Math.abs(animation.timeScale() || 1),
      progress: animation.totalProgress(),
      paused: animation.paused(),
      active: animation.isActive(),
      scroll: Boolean((animation as gsap.core.Tween).scrollTrigger ?? animation.vars.scrollTrigger),
      edited: originals.has(id),
    };
  };

  const detail = (id: string): AnimationDetail | null => {
    const animation = find(id);
    if (!animation) return null;
    const { label, targets } = row(animation);
    return { id, label, targets, ...inspect(gsap, animation, originals.has(id)) };
  };

  const edit = (id: string, change: AnimationEdit) => {
    const animation = find(id);
    if (!(animation instanceof gsap.core.Tween)) return detail(id);
    if (!originals.has(id)) originals.set(id, snapshotEditable(gsap, animation));
    applyEdit(gsap, animation, change);
    return detail(id);
  };

  const rows = (): AnimationRow[] => {
    const out: AnimationRow[] = [];
    for (const [id, animation] of tracked) {
      if (parents.has(id)) continue;
      const top = row(animation);
      out.push(top);
      if (animation instanceof gsap.core.Timeline) {
        for (const child of animation.getChildren(false, true, true)) {
          if (isInternal(child)) continue;
          parents.set(idOf(child), top.id);
          out.push(row(child, { id: top.id, start: top.start }));
        }
      }
    }
    return out.sort((a, b) => (a.parentId === b.parentId ? a.start - b.start : 0));
  };

  const find = (id: string) => {
    const animation = tracked.get(id);
    if (animation) return animation;
    for (const parent of tracked.values()) {
      if (!(parent instanceof gsap.core.Timeline)) continue;
      const child = parent.getChildren(false, true, true).find((c) => ids.get(c) === id);
      if (child) return child;
    }
    return undefined;
  };

  const snapshot = (): NuggetState => ({
    now: gsap.globalTimeline.time(),
    paused: gsap.globalTimeline.paused(),
    speed: gsap.globalTimeline.timeScale(),
    rows: rows(),
  });

  const highlight = document.createElement("div");
  highlight.style.cssText =
    "position:fixed;pointer-events:none;z-index:2147483646;outline:2px solid #e8a33d;background:rgb(232 163 61 / 0.15);display:none;transition:all 80ms";
  document.documentElement.append(highlight);

  const showHighlight = (id: string | null) => {
    const animation = id ? find(id) : undefined;
    const targets = animation
      ? targetsOf(animation).filter((t): t is Element => t instanceof Element)
      : [];
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

  const channel = createPageScriptChannel<NuggetChannelProtocol>({
    name: NUGGET_CHANNEL,
    functions: {
      control: {
        type: "action",
        handler: (id: string, action: ControlAction) => {
          const animation = find(id);
          if (!animation) return;
          // A finished animation has left the global timeline; restarting puts it back
          if (action === "play" && isFinished(animation)) animation.restart();
          else animation[action]();
        },
      },
      seek: {
        type: "action",
        handler: (id: string, progress: number) => {
          find(id)?.pause().totalProgress(progress);
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
          return result && { ...result, edited: false };
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
      clearInterval(timer);
      timer = undefined;
      showHighlight(null);
    });
  });

  return channel;
}
