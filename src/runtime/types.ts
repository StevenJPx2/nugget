import "gsap";
import type { AnimationOptions } from "./baked/types";

export type Direction = "bottom" | "top" | "left" | "right";
type EaseFunction =
  | "power1"
  | "power2"
  | "power3"
  | "power4"
  | "back"
  | "circ"
  | "expo"
  | "sine";

type ExpressiveEaseFunctions =
  | "linear"
  | "none"
  | "elastic"
  | "bounce"
  | "rough"
  | "slow"
  | `steps(${number})`;

type EaseType = "in" | "out" | "inOut";

export type Ease =
  | `${EaseFunction}.${EaseType}`
  | EaseFunction
  | ExpressiveEaseFunctions;

type EaseOption = {
  /** The ease of the tween
   * @remarks
   * - `Ease` is a custom type that allows the LSP to infer the correct string values for `ease`
   * - You can also pass a custom `gsap.EaseFunction`
   * */
  ease?: Ease | gsap.EaseFunction;
};

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

/** Strongly typed TweenVars */
export type StrongTweenVars = gsap.TweenVars & EaseOption;

/** Strongly typed TimelineVars */
export type StrongTimelineVars = gsap.TimelineVars & EaseOption;

/**
 * Tweens defined in a simpler format:
 * instead of:
 * ```jsx
 *  {
 *    from: { translateX: 0 },
 *    to: { translateX: 10 }
 *  }
 * ```
 * it will be:
 * ```jsx
 *  {
 *    translateX: [0, 10]
 *  }
 * ```
 * */
export type FromToTweens = {
  [P in keyof StrongTweenVars]: [StrongTweenVars[P], StrongTweenVars[P]];
};

export type TweenObj<
  Obj extends Record<string, FromToTweens>,
  T extends keyof Obj & string = keyof Obj & string,
> = {
  tweens: Obj;
  defaultTween: T;
};

export type PresetsGeneric = Record<
  string,
  TweenObj<{
    [x: string]: FromToTweens;
  }>
>;

export type BakedPresetsArray = (keyof {
  [P in keyof AnimationOptions as
    | P
    | (AnimationOptions[P] extends infer V
        ? V extends string
          ? `${P}:${V}`
          : never
        : never)]: true;
})[];
