import type { MaybeComputedElementRef } from "@vueuse/core";
import { useNuxtApp, useSplitText, watchOnce } from "#imports";
import type { Direction, Ease } from "../types";

type AnimationOptions = {
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
   * - `in` means scale from 0.5 to 1
   * - `out` means scale from 1.5 to 1
   * - `true` is the same as `in`
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

export type UseSplitTextAnimationOptions = {
  /** Defines how the text should be split */
  splitBy: "chars" | "words" | "lines";
  /** Options for the animation */
  options?: AnimationOptions;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation stagger in seconds */
  stagger?: number;
  /** Ease function */
  ease?: Ease;
  /** Animation delay in seconds */
  delay?: number;
};

function generateAnimationTweens(animationOptions: AnimationOptions) {
  const { opacity, translate, skew, scale, rotate, blur } = animationOptions;
  const tweens: {
    from: gsap.TweenVars;
    to: gsap.TweenVars;
  } = { from: {}, to: {} };

  if (opacity) {
    if (opacity === "in" || opacity === true) {
      tweens.from.autoAlpha = 0;
      tweens.to.autoAlpha = 1;
    } else if (opacity === "out") {
      tweens.from.autoAlpha = 1;
      tweens.to.autoAlpha = 0;
    }
  }

  if (translate) {
    if (translate === "bottom" || translate === true) {
      tweens.from.y = 50;
      tweens.to.y = 0;
    } else if (translate === "top") {
      tweens.from.y = -50;
      tweens.to.y = 0;
    }
    if (translate === "left") {
      tweens.from.x = -50;
      tweens.to.x = 0;
    } else if (translate === "right") {
      tweens.from.x = 50;
      tweens.to.x = 0;
    }
  }

  if (skew) {
    if (skew === "bottom" || skew === true) {
      tweens.from.skewY = 10;
      tweens.to.skewY = 0;
    } else if (skew === "top") {
      tweens.from.skewY = -10;
      tweens.to.skewY = 0;
    }
    if (skew === "left") {
      tweens.from.skewX = -10;
      tweens.to.skewX = 0;
    } else if (skew === "right") {
      tweens.from.skewX = 10;
      tweens.to.skewX = 0;
    }
  }

  if (scale) {
    if (scale === "in" || scale === true) {
      tweens.from.scale = 0.5;
      tweens.to.scale = 1;
    } else if (scale === "out") {
      tweens.from.scale = 1.5;
      tweens.to.scale = 1;
    }
  }

  if (rotate) {
    if (rotate === "left" || rotate === true) {
      tweens.from.rotation = -15;
      tweens.to.rotation = 0;
    } else if (rotate === "right") {
      tweens.from.rotation = 15;
      tweens.to.rotation = 0;
    }
  }

  if (blur) {
    if (blur === "in" || blur === true) {
      tweens.from.filter = "blur(10px)";
      tweens.to.filter = "blur(0px)";
    } else if (blur === "out") {
      tweens.from.filter = "blur(0px)";
      tweens.to.filter = "blur(10px)";
    }
  }

  return tweens;
}

export default function (
  refEl: MaybeComputedElementRef,
  options: UseSplitTextAnimationOptions,
) {
  const {
    splitBy,
    duration = 0.5,
    stagger = 0.2,
    ease = "none",
    delay = 0,
    options: animationOptions = {},
  } = options;
  const { $gsap } = useNuxtApp();
  const { words } = useSplitText(refEl, { splitBy });

  const { from, to } = generateAnimationTweens(animationOptions);

  watchOnce(
    words,
    () => {
      if (!words.value) return;
      $gsap.fromTo(words.value, from, {
        ...to,
        duration,
        stagger,
        ease,
        delay,
      });
    },
    { immediate: true },
  );
}
