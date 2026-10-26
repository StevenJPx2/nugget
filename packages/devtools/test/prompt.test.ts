import { expect, test } from "bun:test";
import { buildPrompt, changesOf } from "../panel/prompt";
import type { EditRecord } from "../src/protocol";

const aosBox: EditRecord = {
  id: "a12",
  label: "fromTo · autoAlpha, y, filter",
  method: "fromTo",
  targets: "div.aos-box",
  components: [{ name: "App", file: "/repo/playground/app.vue" }],
  before: {
    duration: 0.3,
    delay: 0,
    ease: "power1.out",
    repeat: 0,
    yoyo: false,
    from: { autoAlpha: 0, y: "200%" },
    to: { autoAlpha: 1, y: 0 },
  },
  after: {
    duration: 0.3,
    delay: 0,
    ease: "M0,0 C0.23,1 0.32,1 1,1",
    repeat: 0,
    yoyo: false,
    from: { autoAlpha: 0, y: "200%" },
    to: { autoAlpha: 1, y: 40 },
  },
  easeWasDefault: true,
  staggered: false,
  page: "/",
};

const step: EditRecord = {
  ...aosBox,
  id: "a30",
  label: "to · scaleX",
  method: "to",
  targets: "div",
  components: [
    { name: "OffsetTransition", file: "/repo/packages/nuxt/src/runtime/components/OffsetTransition.vue" },
    { name: "App", file: "/repo/playground/app.vue" },
  ],
  timeline: { label: "timeline", step: 3, steps: 4 },
  before: { duration: 0.8, delay: 0, ease: "power4.out", repeat: 0, yoyo: false, to: { scaleX: 0 } },
  after: { duration: 1.2, delay: 0, ease: "power4.out", repeat: 0, yoyo: false, to: { scaleX: 0 } },
  easeWasDefault: false,
};

test("lists only what changed", () => {
  expect(changesOf(aosBox)).toEqual([
    'ease: "power1.out" (GSAP\'s default, not set in code) → "M0,0 C0.23,1 0.32,1 1,1"',
    "to y: 0 → 40",
  ]);
  expect(changesOf(step)).toEqual(["duration: 0.8 → 1.2"]);
});

test("one edit gives a prompt for that animation", () => {
  const prompt = buildPrompt([aosBox])!;
  expect(prompt).toStartWith("I tuned an animation in the Nugget devtools on page `/`.");
  expect(prompt).toContain('`fromTo(div.aos-box, { autoAlpha: 0, y: "200%" }, { autoAlpha: 1, y: 0, duration: 0.3 })`');
  expect(prompt).toContain("Rendered by <App> (/repo/playground/app.vue)");
  expect(prompt).toContain("gsap.registerPlugin(CustomEase)");
});

test("several edits are numbered, with timeline context", () => {
  const prompt = buildPrompt([aosBox, step])!;
  expect(prompt).toContain("I tuned 2 animations");
  expect(prompt).toContain("2. `to · scaleX` on `div`");
  expect(prompt).toContain("Step 3 of 4 in a GSAP timeline");
  expect(prompt).toContain(
    "<OffsetTransition> (/repo/packages/nuxt/src/runtime/components/OffsetTransition.vue), which is used in <App>",
  );
  expect(prompt).toContain('`to(div, { scaleX: 0, duration: 0.8, ease: "power4.out" })`');
});

test("edits that cancel out give no prompt", () => {
  expect(buildPrompt([{ ...aosBox, after: aosBox.before }])).toBeNull();
});
