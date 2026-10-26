import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export type Direction = "in" | "out" | "inOut";
export type Family =
  | "none" | "power" | "sine" | "expo" | "circ" | "back" | "elastic" | "bounce" | "steps" | "custom";
export type Bezier = [x1: number, y1: number, x2: number, y2: number];

/** A GSAP ease string taken apart into the settings the editor shows */
export type EaseModel = {
  family: Family;
  direction: Direction;
  power: number;
  overshoot: number;
  amplitude: number;
  period: number;
  steps: number;
  bezier: Bezier;
};

export const FAMILIES: { family: Family; label: string }[] = [
  { family: "none", label: "Linear" },
  { family: "power", label: "Power" },
  { family: "sine", label: "Sine" },
  { family: "expo", label: "Expo" },
  { family: "circ", label: "Circ" },
  { family: "back", label: "Back" },
  { family: "elastic", label: "Elastic" },
  { family: "bounce", label: "Bounce" },
  { family: "steps", label: "Steps" },
  { family: "custom", label: "Custom" },
];

/** Families without in/out variants */
export const UNDIRECTED = new Set<Family>(["none", "steps", "custom"]);

export const BEZIER_PRESETS: { label: string; bezier: Bezier }[] = [
  { label: "Strong out", bezier: [0.23, 1, 0.32, 1] },
  { label: "Strong in-out", bezier: [0.77, 0, 0.175, 1] },
  { label: "Drawer", bezier: [0.32, 0.72, 0, 1] },
  { label: "CSS ease", bezier: [0.25, 0.1, 0.25, 1] },
];

const elasticPeriod = (direction: Direction) => (direction === "inOut" ? 0.45 : 0.3);

export const defaults = (direction: Direction = "out"): EaseModel => ({
  family: "power",
  direction,
  power: 1,
  overshoot: 1.70158,
  amplitude: 1,
  period: elasticPeriod(direction),
  steps: 5,
  bezier: [0.23, 1, 0.32, 1],
});

const ALIASES: Record<string, { family: Family; power?: number }> = {
  linear: { family: "none" },
  power0: { family: "none" },
  quad: { family: "power", power: 1 },
  cubic: { family: "power", power: 2 },
  quart: { family: "power", power: 3 },
  quint: { family: "power", power: 4 },
  strong: { family: "power", power: 4 },
  sine: { family: "sine" },
  expo: { family: "expo" },
  circ: { family: "circ" },
  back: { family: "back" },
  elastic: { family: "elastic" },
  bounce: { family: "bounce" },
};

const NAMED = /^([a-z]+?)([0-4]?)(?:\.(in|out|inOut))?(?:\(([^)]*)\))?$/i;
const STEPS = /^steps\((\d+)\)$/;
const NUMBER = String.raw`(-?\d*\.?\d+)`;
const PATH = new RegExp(String.raw`^M0,0 C${NUMBER},${NUMBER} ${NUMBER},${NUMBER} 1,1$`);
const CSS_BEZIER = new RegExp(String.raw`^cubic-bezier\(\s*${NUMBER}\s*,\s*${NUMBER}\s*,\s*${NUMBER}\s*,\s*${NUMBER}\s*\)$`);

/** Returns null for eases the editor can't show as settings, such as CustomEase paths with several segments */
export function parse(ease: string): EaseModel | null {
  const text = ease.trim();
  const base = defaults();
  if (text === "none") return { ...base, family: "none" };

  const steps = STEPS.exec(text);
  if (steps) return { ...base, family: "steps", steps: Number(steps[1]) };

  const bezier = PATH.exec(text) ?? CSS_BEZIER.exec(text);
  if (bezier) return { ...base, family: "custom", bezier: bezier.slice(1, 5).map(Number) as Bezier };

  const named = NAMED.exec(text);
  if (!named) return null;
  const [, name, digit, direction = "out", args = ""] = named;
  const alias = name === "power" ? { family: "power" as const, power: Number(digit || 1) } : ALIASES[name.toLowerCase()];
  if (!alias || (digit && name !== "power")) return null;
  if (alias.family === "power" && alias.power === 0) return { ...base, family: "none" };

  const params = args.split(",").map((value) => value.trim()).filter(Boolean).map(Number);
  const dir = direction as Direction;
  return {
    ...base,
    family: alias.family,
    direction: dir,
    power: alias.power ?? base.power,
    overshoot: alias.family === "back" && params[0] !== undefined ? params[0] : base.overshoot,
    amplitude: alias.family === "elastic" && params[0] !== undefined ? params[0] : base.amplitude,
    period: alias.family === "elastic" && params[1] !== undefined ? params[1] : elasticPeriod(dir),
  };
}

const trim = (value: number) => String(Math.round(value * 1000) / 1000);

export function format(model: EaseModel): string {
  const { family, direction } = model;
  switch (family) {
    case "none":
      return "none";
    case "steps":
      return `steps(${Math.max(1, Math.round(model.steps))})`;
    case "custom":
      return `M0,0 C${trim(model.bezier[0])},${trim(model.bezier[1])} ${trim(model.bezier[2])},${trim(model.bezier[3])} 1,1`;
    case "power":
      return `power${model.power}.${direction}`;
    case "back":
      return model.overshoot === 1.70158
        ? `back.${direction}`
        : `back.${direction}(${trim(model.overshoot)})`;
    case "elastic":
      return model.amplitude === 1 && model.period === elasticPeriod(direction)
        ? `elastic.${direction}`
        : `elastic.${direction}(${trim(model.amplitude)}, ${trim(model.period)})`;
    default:
      return `${family}.${direction}`;
  }
}

/** Moves to another family or direction, keeping settings that still apply */
export function withFamily(model: EaseModel, family: Family): EaseModel {
  return { ...model, family };
}

export function withDirection(model: EaseModel, direction: Direction): EaseModel {
  const periodWasDefault = model.period === elasticPeriod(model.direction);
  return { ...model, direction, period: periodWasDefault ? elasticPeriod(direction) : model.period };
}

export function easeFunction(ease: string): ((t: number) => number) | undefined {
  try {
    const parsed = gsap.parseEase(ease);
    return typeof parsed === "function" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function sample(ease: string, count = 61): number[] {
  const fn = easeFunction(ease);
  return fn ? Array.from({ length: count }, (_, i) => fn(i / (count - 1))) : [];
}

export { gsap };
