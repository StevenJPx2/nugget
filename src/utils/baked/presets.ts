import type { AnimationOptions } from "./types";
import type { StrongTweenVars } from "../../types";

type RequiredAnimationOptions = Required<AnimationOptions>;
const defineTween = <
  Obj extends Record<string, { from: StrongTweenVars; to: StrongTweenVars }>,
  T extends Exclude<keyof Obj, "DEFAULT">,
>(
  x: Obj,
  defaultTween: T,
) => ({ ...x, DEFAULT: defaultTween });

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
      bottom: { from: { y: "200%" }, to: { y: 0 } },
      top: { from: { y: "-200%" }, to: { y: 0 } },
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
      from: StrongTweenVars;
      to: StrongTweenVars;
    };
  } & {
    DEFAULT: Exclude<RequiredAnimationOptions[K], true>;
  };
};
