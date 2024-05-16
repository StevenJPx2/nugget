import type { FromToTweens, PresetsGeneric } from "../types";
import type { BakedPresets, BakedPresetsArray } from "./types";

/** Generates the baked animation tweens
 * @param animationOptions - The animation options
 * @remarks
 * This is **NOT** unopinionated
 */
export function generateAnimationTweens(
  animationOptions: BakedPresets | BakedPresetsArray,
  presets: PresetsGeneric,
): FromToTweens {
  const allTweens: FromToTweens = {};

  const normalizedAnimationOptions = Array.isArray(animationOptions)
    ? transformBakedArrayToObject(animationOptions)
    : animationOptions;

  for (const key in normalizedAnimationOptions) {
    const value = normalizedAnimationOptions[key as keyof BakedPresets];

    if (!value) continue;

    const { tweens, defaultTween } = presets[key];
    let presetTweenKey: string;
    if (typeof value === "boolean") {
      presetTweenKey = defaultTween;
    } else {
      presetTweenKey = value;
    }

    for (const tweenKey in tweens[presetTweenKey]) {
      allTweens[tweenKey] = tweens[presetTweenKey][tweenKey].map(
        (v) => v ?? undefined,
      ) as [any, any];
    }
  }

  return allTweens;
}

export const transformBakedArrayToObject = (v: BakedPresetsArray) =>
  Object.fromEntries(
    v.map((val) => {
      const [key, value] = val.split(":");
      return [key, value === undefined ? true : value];
    }),
  ) as BakedPresets;

export * from "./types";
