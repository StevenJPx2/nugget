import type { gsap as Gsap } from "gsap";

export type Animation = gsap.core.Tween | gsap.core.Timeline;
export type AnimationEntry = { id: string; animation: Animation; parentId?: string; start: number };

/** GSAP's authored IDs need not be unique; startTime changes when an animation restarts. */
export function createAnimationRegistry(gsap: typeof Gsap, include: (animation: Animation) => boolean) {
  const tracked = new Map<string, Animation>();
  const ids = new WeakMap<Animation, string>();
  const order = new WeakMap<Animation, number>();
  let discovered = new Map<string, Animation>();
  let counter = 0;

  const idOf = (animation: Animation) => {
    let id = ids.get(animation);
    if (!id) {
      id = `a${++counter}`;
      ids.set(animation, id);
      order.set(animation, counter);
    }
    return id;
  };
  const childrenOf = (animation: Animation) =>
    animation instanceof gsap.core.Timeline
      ? animation.getChildren(false, true, true).filter(include)
      : [];

  function entries(): AnimationEntry[] {
    discovered = new Map();
    const nested = new Set<Animation>();
    const collect = (animation: Animation) => {
      const id = idOf(animation);
      if (discovered.has(id)) return;
      discovered.set(id, animation);
      for (const child of childrenOf(animation)) {
        nested.add(child);
        collect(child);
      }
    };
    for (const animation of tracked.values()) collect(animation);

    const out: AnimationEntry[] = [];
    const visit = (animation: Animation, parent?: AnimationEntry) => {
      const entry = {
        id: idOf(animation), animation, parentId: parent?.id,
        start: (parent?.start ?? 0) + animation.startTime(),
      };
      out.push(entry);
      // Keep a timeline's steps together, in first-seen order, even during solo playback.
      for (const child of childrenOf(animation).sort((a, b) => order.get(a)! - order.get(b)!)) visit(child, entry);
    };
    for (const animation of [...tracked.values()].sort((a, b) => order.get(a)! - order.get(b)!)) {
      if (!nested.has(animation)) visit(animation);
    }
    return out;
  }

  return {
    tracked, idOf, entries,
    find: (id: string) => tracked.get(id) ?? discovered.get(id),
  };
}

/** Detached SplitText pieces cannot be replayed: the app has reverted/re-split their DOM. */
export function replayUnavailable(targets: Element[]): string | undefined {
  if (targets.length && targets.every((target) => !target.isConnected)) {
    return "These targets were removed from the page (for example, SplitText was reverted). Trigger the animation again in the app to create live targets.";
  }
}

/** Prefer a direct target, then split pieces inside the picked element, then its nearest parent. */
export function targetMatchRank(element: Element, targets: Element[]): number {
  let rank = Infinity;
  for (const target of targets) {
    if (!target.isConnected) continue;
    if (target === element) return 0;
    if (element.contains(target)) rank = Math.min(rank, 1);
    else {
      let parent = element.parentElement;
      let distance = 2;
      while (parent) {
        if (parent === target) { rank = Math.min(rank, distance); break; }
        distance++;
        parent = parent.parentElement;
      }
    }
  }
  return rank;
}
