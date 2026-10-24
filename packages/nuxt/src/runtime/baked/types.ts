import type { BakedPresets } from "#build/types/nugget";
import type { StrongTweenVars } from "../types";

export type { BakedPresets };

export type AnimationOptions = BakedPresets;

/**
 * Options for the animation
 * @remarks
 * Uses `gsap.TweenVars` as a base type for the animation options
 * @see {@link https://greensock.com/docs/v3/GSAP/gsap.to()}
 */
export type UseBakedAnimationOptions = {
  /**
   * Options for the animation
   */
  animationOptions: BakedPresets | BakedPresetsArray;

  /**
   * Tween values for `gsap.to()`
   * @remarks `ease` is strongly typed
   */
  tweenValues?: StrongTweenVars;
};

export type BakedPresetsArray = (keyof {
  [P in keyof AnimationOptions as
    | P
    | (AnimationOptions[P] extends infer V
        ? V extends string
          ? `${P}:${V}`
          : never
        : never)]: true;
})[];
