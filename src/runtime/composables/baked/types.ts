import type { Direction } from "../../types";

const defineTween = <
  Obj extends Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }>,
  T extends Exclude<keyof Obj, "DEFAULT">,
>(
  x: Obj,
  defaultTween: T,
) => ({ ...x, DEFAULT: defaultTween });

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

type RequiredAnimationOptions = Required<AnimationOptions>;

export const presetTweens = {
  opacity: defineTween(
    {
      in: { from: { autoAlpha: 0 }, to: { autoAlpha: 1 } },
      out: { from: { autoAlpha: 1 }, to: { autoAlpha: 0 } },
    },
    "in",
  ),
  translate: defineTween(
    {
      bottom: {
        from: { y: "200%" },
        to: {
          y: 0,
          scrollTrigger: {
            start: "top-=100% center",
            end: "bottom center",
          },
        },
      },
      top: {
        from: {
          y: "-200%",
        },
        to: {
          y: 0,
          scrollTrigger: {
            start: "top+=50% center",
            end: "bottom center",
          },
        },
      },
      left: { from: { x: "-200%" }, to: { x: 0 } },
      right: { from: { x: "200%" }, to: { x: 0 } },
    },
    "bottom",
  ),
  skew: defineTween(
    {
      bottom: { from: { skewY: 10 }, to: { skewY: 0 } },
      top: { from: { skewY: -10 }, to: { skewY: 0 } },
      left: { from: { skewX: -10 }, to: { skewX: 0 } },
      right: { from: { skewX: 10 }, to: { skewX: 0 } },
    },
    "bottom",
  ),
  scale: defineTween(
    {
      in: { from: { scale: 0 }, to: { scale: 1 } },
      out: { from: { scale: 1 }, to: { scale: 0 } },
    },
    "in",
  ),
  rotate: defineTween(
    {
      left: {
        from: { rotation: 15, transformOrigin: "top left" },
        to: { rotation: 0 },
      },
      right: {
        from: { rotation: -15, transformOrigin: "top right" },
        to: { rotation: 0 },
      },
    },
    "left",
  ),
  blur: defineTween(
    {
      in: { from: { filter: "blur(10px)" }, to: { filter: "blur(0px)" } },
      out: { from: { filter: "blur(0px)" }, to: { filter: "blur(10px)" } },
    },
    "in",
  ),
} satisfies {
  [K in keyof RequiredAnimationOptions]: {
    [P in RequiredAnimationOptions[K] as Exclude<
      RequiredAnimationOptions[K],
      true
    >]: {
      from: gsap.TweenVars;
      to: gsap.TweenVars;
    };
  } & {
    DEFAULT: Exclude<RequiredAnimationOptions[K], true>;
  };
};
