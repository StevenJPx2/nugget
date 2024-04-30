import type { MaybeComputedElementRef } from "@vueuse/core";
import { nuggetBakedPresets } from "#imports";
import {
  type PartialSplitTextAnimationOptions,
  useSplitTextAnimation,
} from ".";
import type { Ease, Simplify } from "../../types";
import type { UseBakedAnimateOnScrollOptions } from "../use-animate-on-scroll/baked";

import { generateAnimationTweens } from "../../baked";
import { mergeTweens } from "../../utils";

/** Completely optional options for the `useSplitTextAnimation` composable */
export type UseBakedSplitTextAnimationOptions = Simplify<
  UseBakedAnimateOnScrollOptions &
    PartialSplitTextAnimationOptions & {
      /** Animation duration in seconds
       * @default 2s
       * */
      duration?: number;
      /** Animation stagger in seconds
       * @remarks
       * - If left undefined, stagger is defined by how the text is split
       * - `lines` has a default of `0.2s`
       * - `words` has a default of `0.1s`
       * - `chars` has a default of `0.05s`
       * */
      stagger?: number;
      /** Ease function
       * @default "expo.inOut"
       * */
      ease?: Ease;
      /** Animation delay in seconds
       * @default 0s
       * */
      delay?: number;
    }
>;

/**
 * Animates a text split by chars, words or lines
 * @param el - The element or ref to animate
 * @param options - The animation options
 * @remarks
 * - Made so that it works with a basic but nice effect out of the box
 * - Uses the `useSplitText` composable to split the text
 * - Uses the `useBakedAnimation` composable for the animation
 * @example
 * ```ts
 * const refEl = ref<HTMLElement>();
 * const options = {
 *  splitBy: "chars",
 *  duration: 0.5,
 *  stagger: 0.2,
 *  ease: "none",
 *  delay: 0,
 * };
 * useSplitTextAnimation(refEl, options);
 * ```
 */
export function useBakedSplitTextAnimation(
  el: MaybeComputedElementRef,
  {
    stagger,
    splitBy = "lines",
    splitOptions,
    duration = 1,
    ease = "expo.inOut",
    delay = 0,
    scrollAnimationOptions = true,
    animationOptions = { opacity: true, blur: true },
  }: UseBakedSplitTextAnimationOptions = {},
) {
  const animationTweens = generateAnimationTweens(
    animationOptions,
    nuggetBakedPresets,
  );

  if (splitBy === "lines") {
    stagger ??= 0.2;
  } else if (splitBy === "words") {
    stagger ??= 0.1;
  } else if (splitBy === "chars") {
    stagger ??= 0.05;
  }

  const tweens = mergeTweens(animationTweens, {
    duration: [undefined, duration],
    ease: [undefined, ease],
    delay: [undefined, delay],
    stagger: [undefined, stagger],
  });

  useSplitTextAnimation(el, {
    splitOptions,
    splitBy,
    tweens,
    scrollAnimationOptions,
  });
}
