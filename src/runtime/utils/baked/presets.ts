import type { FromToTweens } from "../../types";

const defineTween = <
  Obj extends Record<string, FromToTweens>,
  const T extends keyof Obj,
>(
  tweens: Obj,
  defaultTween: T,
) => ({ tweens, defaultTween });

export const defaultPresets = {
  opacity: defineTween(
    {
      in: { autoAlpha: [0, 1] },
      out: { autoAlpha: [1, 0] },
    },
    "in",
  ),
  translate: defineTween(
    {
      bottom: { y: ["200%", 0] },
      top: { y: ["-200%", 0] },
      left: { x: ["-200%", 0] },
      right: { x: ["200%", 0] },
    },
    "bottom",
  ),
  skew: defineTween(
    {
      bottom: { skewY: [10, 0] },
      top: { skewY: [-10, 0] },
      left: { skewX: [-10, 0] },
      right: { skewX: [10, 0] },
    },
    "bottom",
  ),
  scale: defineTween(
    {
      in: { scale: [0, 1] },
      out: { scale: [1, 0] },
    },
    "in",
  ),
  rotate: defineTween(
    {
      left: { rotation: [15, 0], transformOrigin: ["top left", undefined] },
      right: { rotation: [-15, 0], transformOrigin: ["top right", undefined] },
    },
    "left",
  ),
  blur: defineTween(
    {
      in: { filter: ["blur(10px)", "blur(0px)"] },
      out: { filter: ["blur(0px)", "blur(10px)"] },
    },
    "in",
  ),
} satisfies Record<
  string,
  {
    tweens: {
      [x: string]: FromToTweens;
    };
    defaultTween: string;
  }
>;
