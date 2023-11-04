import { type MaybeRefOrGetter, useGsap } from "#imports";
import type { StrongTweenVars } from "../useGsap";
import { type AnimationOptions } from "./types";
import { generateAnimationTweens } from "./utils";

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

      scrollTrigger: {
        ...(tweenValues?.scrollTrigger ?? {}),
        ...(to.scrollTrigger ?? {}),
      },
    },
  });
}
