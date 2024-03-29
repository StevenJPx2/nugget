import type { StrongTweenVars } from "../../types";
import { presetTweens } from "./presets";
import { type AnimationOptions } from "./types";

/** Generates the baked animation tweens
 * @param animationOptions - The animation options
 * @remarks
 * This is **NOT** unopinionated
 * */
export function generateAnimationTweens(animationOptions: AnimationOptions): {
  from: StrongTweenVars;
  to: StrongTweenVars;
} {
  const tweens: {
    from: StrongTweenVars;
    to: StrongTweenVars;
  } = { from: {}, to: {} };

  Object.entries(animationOptions)
    .filter(([, val]) => !!val)
    .map(([key, value]) => {
      const tween = presetTweens[key as keyof typeof presetTweens];
      let tweenKey: string;
      if (typeof value === "boolean") {
        tweenKey = tween.DEFAULT;
      } else {
        tweenKey = value;
      }

      // @ts-expect-error
      tweens.from = { ...tweens.from, ...tween[tweenKey].from };

      // @ts-expect-error
      tweens.to = { ...tweens.to, ...tween[tweenKey].to };
    });

  return tweens;
}

export * from "./types";
