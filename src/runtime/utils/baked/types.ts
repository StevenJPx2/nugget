import type { StrongTweenVars } from "../../types";
import type { defaultPresets } from "./presets";

export type DefaultPresets = typeof defaultPresets;

/**
 * Animation options defined from presetTweens
 * */
export type AnimationOptions = {
  [K in keyof DefaultPresets]?: keyof DefaultPresets[K]["tweens"] | true;
};

/**
 * Options for the animation
 * @remarks
 * Uses `gsap.TweenVars` as a base type for the animation options
 * @see {@link https://greensock.com/docs/v3/GSAP/gsap.to()}
 * */
export type UseBakedAnimationOptions = {
  /**
   * Options for the animation
   * */
  animationOptions: AnimationOptions;
};
