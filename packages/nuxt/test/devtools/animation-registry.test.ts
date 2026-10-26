import { afterEach, describe, expect, test } from "vitest";
import { gsap } from "gsap";
import { createAnimationRegistry, replayUnavailable, targetMatchRank } from "../../src/runtime/devtools/animation-registry";

afterEach(() => gsap.globalTimeline.clear());

describe("waterfall identity and ordering", () => {
  test("authored IDs are labels, never lookup keys", () => {
    const registry = createAnimationRegistry(gsap, () => true);
    const first = gsap.to({}, { id: "reveal", duration: 1, paused: true });
    const second = gsap.to({}, { id: "reveal", duration: 1, paused: true });
    for (const animation of [first, second]) registry.tracked.set(registry.idOf(animation), animation);
    const entries = registry.entries();
    expect(entries[0].id).not.toBe(entries[1].id);
    expect(registry.find(entries[0].id)).toBe(first);
    expect(registry.find(entries[1].id)).toBe(second);
  });

  test("restarting or retiming one animation never moves its row under another control", () => {
    const registry = createAnimationRegistry(gsap, () => true);
    const first = gsap.timeline({ paused: true }).to({}, { duration: 1 });
    const second = gsap.timeline({ paused: true }).to({}, { duration: 1 });
    for (const animation of [first, second]) registry.tracked.set(registry.idOf(animation), animation);
    const before = registry.entries().map(({ id }) => id);
    first.restart().pause();
    first.startTime(100);
    expect(registry.entries().map(({ id }) => id)).toEqual(before);
  });

  test("nested timelines stay grouped, are found recursively, and have no duplicate rows", () => {
    const registry = createAnimationRegistry(gsap, () => true);
    const child = gsap.to({}, { duration: 1, paused: true });
    registry.tracked.set(registry.idOf(child), child);
    const inner = gsap.timeline({ paused: true }).add(child, 0.2);
    const outer = gsap.timeline({ paused: true }).add(inner, 0.3);
    registry.tracked.set(registry.idOf(outer), outer);
    registry.tracked.set(registry.idOf(inner), inner);
    const entries = registry.entries();
    expect(entries.map(({ animation }) => animation)).toEqual([outer, inner, child]);
    expect(entries[2].parentId).toBe(entries[1].id);
    expect(entries[2].start - entries[0].start).toBeCloseTo(0.5);
    expect(registry.find(entries[2].id)).toBe(child);
  });

  test("removed/reparented steps do not leave stale parent relationships", () => {
    const registry = createAnimationRegistry(gsap, () => true);
    const child = gsap.to({}, { duration: 1, paused: true });
    const parent = gsap.timeline({ paused: true }).add(child);
    for (const animation of [parent, child]) registry.tracked.set(registry.idOf(animation), animation);
    expect(registry.entries()[1].parentId).toBe(registry.idOf(parent));
    parent.remove(child);
    expect(registry.entries().find(({ animation }) => animation === child)?.parentId).toBeUndefined();
  });
});

// Only the structural DOM contract used by matching is needed; no browser globals or new dependency.
function element(parent?: Element): Element {
  const node = {
    isConnected: true,
    parentElement: parent ?? null,
    contains(other: Element) {
      let current: Element | null = other;
      while (current) {
        if (current === node as unknown as Element) return true;
        current = current.parentElement;
      }
      return false;
    },
  };
  return node as unknown as Element;
}

describe("element picking and reverted SplitText", () => {
  test("a heading finds its split words and a word finds its animated heading", () => {
    const heading = element();
    const mask = element(heading);
    const word = element(mask);
    expect(targetMatchRank(heading, [word])).toBe(1);
    expect(targetMatchRank(word, [word])).toBe(0);
    expect(targetMatchRank(word, [heading])).toBe(3);
    expect(targetMatchRank(element(), [word])).toBe(Infinity);
  });

  test("removed pieces cannot be replayed or selected as live animations", () => {
    const heading = element();
    const oldWord = element(heading);
    Object.assign(oldWord, { isConnected: false });
    expect(replayUnavailable([oldWord])).toContain("SplitText was reverted");
    expect(targetMatchRank(heading, [oldWord])).toBe(Infinity);
    expect(replayUnavailable([oldWord, element()])).toBeUndefined();
    expect(replayUnavailable([])).toBeUndefined();
  });
});
