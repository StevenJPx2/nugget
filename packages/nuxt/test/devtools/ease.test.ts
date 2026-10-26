import { expect, test } from "vitest";
import { easeFunction, format, parse } from "../../devtools-panel/ease";

const cases: [string, string][] = [
  ["none", "none"],
  ["linear", "none"],
  ["power2.out", "power2.out"],
  ["power4.inOut", "power4.inOut"],
  ["power0", "none"],
  ["cubic.in", "power2.in"],
  ["sine", "sine.out"],
  ["expo.inOut", "expo.inOut"],
  ["back.out", "back.out"],
  ["back.out(3)", "back.out(3)"],
  ["elastic.out(1.5, 0.4)", "elastic.out(1.5, 0.4)"],
  ["elastic.inOut", "elastic.inOut"],
  ["bounce.in", "bounce.in"],
  ["steps(6)", "steps(6)"],
  ["M0,0 C0.23,1 0.32,1 1,1", "M0,0 C0.23,1 0.32,1 1,1"],
  ["cubic-bezier(0.77, 0, 0.175, 1)", "M0,0 C0.77,0 0.175,1 1,1"],
];

test.each(cases)("%s → %s", (input, output) => {
  const model = parse(input);
  expect(model).not.toBeNull();
  const text = format(model!);
  expect(text).toBe(output);
  expect(typeof easeFunction(text)).toBe("function");
});

test("unknown shapes are left alone", () => {
  expect(parse("rough({strength: 2})")).toBeNull();
  expect(parse("power9.out")).toBeNull();
  expect(parse("hop")).toBeNull();
});

test("bezier eases run through CustomEase", () => {
  const fn = easeFunction("M0,0 C0.23,1 0.32,1 1,1")!;
  expect(fn(0)).toBeCloseTo(0);
  expect(fn(1)).toBeCloseTo(1);
  expect(fn(0.5)).toBeGreaterThan(0.8);
});
