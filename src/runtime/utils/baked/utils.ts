import type { FromToTweens } from "../../types";
import { defaultPresets } from "./presets";
import type { AnimationOptions, DefaultPresets } from "./types";

/** Generates the baked animation tweens
 * @param animationOptions - The animation options
 * @remarks
 * This is **NOT** unopinionated
 * */
export function generateAnimationTweens(
  animationOptions: AnimationOptions,
): FromToTweens {
  const allTweens: FromToTweens = {};

  Object.entries(animationOptions)
    .filter(([, val]) => !!val)
    .map(([key, value]) => {
      const { tweens, defaultTween } =
        defaultPresets[key as keyof DefaultPresets];
      let tweenKey: string;
      if (typeof value === "boolean") {
        tweenKey = defaultTween;
      } else {
        tweenKey = value;
      }

      allTweens[key] = tweens[tweenKey as never];
    });

  return allTweens;
}

export * from "./types";
