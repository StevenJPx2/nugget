import type { Ease } from "../../types";

type EaseOption = {
  /** The ease of the tween
   * @remarks
   * - `Ease` is a custom type that allows the LSP to infer the correct string values for `ease`
   * - You can also pass a custom `gsap.EaseFunction`
   * */
  ease?: Ease | gsap.EaseFunction;
};

/** Strongly typed TweenVars */
export type StrongTweenVars = gsap.TweenVars & EaseOption;

/** Strongly typed TimelineVars */
export type StrongTimelineVars = gsap.TimelineVars & EaseOption;
