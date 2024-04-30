import type { FromToTweens, PresetsGeneric } from "../types";
import type { AnimationOptions } from "./types";

/** Generates the baked animation tweens
 * @param animationOptions - The animation options
 * @remarks
 * This is **NOT** unopinionated
 * */
export function generateAnimationTweens(
  animationOptions: AnimationOptions,
  presets: PresetsGeneric,
): FromToTweens {
  const allTweens: FromToTweens = {};

  for (const key in animationOptions) {
    const value = animationOptions[key as keyof AnimationOptions];

    if (!value) continue;

    const { tweens, defaultTween } = presets[key];
    let presetTweenKey: string;
    if (typeof value === "boolean") {
      presetTweenKey = defaultTween;
    } else {
      presetTweenKey = value;
    }

    for (const tweenKey in tweens[presetTweenKey]) {
      allTweens[tweenKey] = tweens[presetTweenKey][tweenKey];
    }
  }
  return allTweens;
}

export * from "./types";
