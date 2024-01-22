import type { Direction, StrongTweenVars } from "../../types";
import type { presetTweens } from "./presets";

export type AnimationOptions = {
  /** Animation opacity
   * @remarks
   * - `in` means opacity from 0 to 1
   * - `out` means opacity from 1 to 0
   * - `true` is the same as `in`
   * */
  opacity?: "in" | "out" | true;
  /** Animation translate
   * @remarks
   * - `bottom` means translate from bottom to top
   * - `top` means translate from top to bottom
   * - `left` means translate from left to right
   * - `right` means translate from right to left
   * - `true` is the same as `bottom`
   * */
  translate?: Direction | true;
  /** Animation skew
   * @remarks
   * - `bottom` means skew from bottom to top
   * - `top` means skew from top to bottom
   * - `left` means skew from left to right
   * - `right` means skew from right to left
   * - `true` is the same as `bottom`
   * */
  skew?: Direction | true;
  /** Animation scale
   * @remarks
   * - `out` means scale from 0.5 to 1
   * - `in` means scale from 1.5 to 1
   * - `true` is the same as `out`
   * */
  scale?: "out" | "in" | true;
  /** Animation rotate
   * @remarks
   * - `left` means rotate from -15deg to 0deg
   * - `right` means rotate from 15deg to 0deg
   * - `true` is the same as `left`
   * */
  rotate?: "left" | "right" | true;
  /** Animation blur
   * @remarks
   * - `in` means blur from 10px to 0px
   * - `out` means blur from 0px to 10px
   * - `true` is the same as `in`
   * */
  blur?: "in" | "out" | true;
};

export type PresetTweens = typeof presetTweens;

export type NewAnimationOptions = {
  [K in keyof PresetTweens]: Exclude<keyof PresetTweens[K], "DEFAULT"> | true;
};

/** Options for the animation
 * @remarks
 * Uses `gsap.TweenVars` as a base type for the animation options
 * @see {@link https://greensock.com/docs/v3/GSAP/gsap.to()}
 * */
export type UseBakedAnimationOptions = {
  /** Options for the animation */
  animationOptions: AnimationOptions;
  /** Tween values for `gsap.to()`
   * @remarks `ease` is strongly typed
   * */
  tweenValues?: StrongTweenVars;
};
