import type { Direction } from "../types";
import { type MaybeRefOrGetter, useGsap } from "#imports";
import type { StrongTweenVars } from "./useGsap";

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

/** Generates the baked animation tweens
 * @param animationOptions - The animation options
 * @remarks
 * This is **NOT** unopinionated
 * */
function generateAnimationTweens(animationOptions: AnimationOptions): {
  from: StrongTweenVars;
  to: StrongTweenVars;
} {
  const { opacity, translate, skew, scale, rotate, blur } = animationOptions;
  const tweens: {
    from: StrongTweenVars;
    to: StrongTweenVars;
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
      tweens.from.y = "200%";
      tweens.to.y = 0;
    } else if (translate === "top") {
      tweens.from.y = "-200%";
      tweens.to.y = 0;
    }
    if (translate === "left") {
      tweens.from.x = "-200%";
      tweens.to.x = 0;
    } else if (translate === "right") {
      tweens.from.x = "200%";
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
    if (scale === "out" || scale === true) {
      tweens.from.scale = 0.5;
      tweens.to.scale = 1;
    } else if (scale === "in") {
      tweens.from.scale = 1.5;
      tweens.to.scale = 1;
    }
  }

  if (rotate) {
    if (rotate === "left" || rotate === true) {
      tweens.from.transformOrigin = "top left";
      tweens.from.rotation = 15;
      tweens.to.rotation = 0;
    } else if (rotate === "right") {
      tweens.from.transformOrigin = "bottom right";
      tweens.from.rotation = -15;
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

/**
 * Animates an element with baked animation options to make it easier to animate repetitive animations
 * @param el - The element or ref to animate
 * @param options - The animation options
 * @remarks
 * - This is **NOT** unopinionated
 * - It is meant to be used for repetitive animations that will usually be a hassle to animate otherwise
 *   - It also makes it easy to stack multiple animations for the same element
 * - It uses `gsap.fromTo()` under the hood
 * @example
 * ```ts
 * const refEl = ref<HTMLElement>();
 * const options = {
 *  animationOptions: {
 *    opacity: true,
 *    translate: "top",
 *    skew: true,
 *    scale: "out",
 *    rotate: true,
 *    blur: true,
 *  },
 *  tweenValues: {
 *    duration: 0.5,
 *    stagger: 0.2,
 *    ease: "none",
 *    delay: 0,
 *  },
 * };
 * useBakedAnimation(refEl, options);
 * ```
 * @see {@link https://greensock.com/docs/v3/GSAP/gsap.fromTo()}
 */
export default function (
  el: MaybeRefOrGetter<gsap.TweenTarget | undefined>,
  options: UseBakedAnimationOptions,
) {
  const { animationOptions, tweenValues } = options;
  const { from, to } = generateAnimationTweens(animationOptions);

  const { fromTo } = useGsap();

  fromTo(el, {
    from,
    to: {
      ...to,
      ...tweenValues,
      onUpdate() {
        console.log("updated");
      },
    },
  });
}
