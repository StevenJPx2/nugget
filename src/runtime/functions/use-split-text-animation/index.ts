import type { MaybeComputedElementRef } from "@vueuse/core";
import type { UseSplitTextOptions } from "nuxt-split-type";
import { useSplitText } from "#imports";
import {
  type UseAnimateOnScrollOptions,
  useAnimateOnScroll,
} from "../use-animate-on-scroll";

export type PartialSplitTextAnimationOptions = {
  /** Defines how the text should be split
   * @default "lines"
   */
  splitBy?: "chars" | "words" | "lines";
  /** Additional options for the `useSplitText` composable */
  splitOptions?: Omit<Partial<UseSplitTextOptions>, "splitBy">;
};

/** Completely optional options for the `useSplitTextAnimation` composable */
export type UseSplitTextAnimationOptions = UseAnimateOnScrollOptions &
  PartialSplitTextAnimationOptions;

/**
 * Animates a text split by chars, words or lines
 * @param el - The element or ref to animate
 * @param options - The animation options
 * @remarks
 * - Uses the `useSplitText` composable to split the text
 * - Uses the `useAnimateOnScroll` composable for the animation
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
export function useSplitTextAnimation(
  el: MaybeComputedElementRef,
  options: UseSplitTextAnimationOptions,
) {
  const {
    splitBy = "lines",
    splitOptions,
    ...animateOnScrollOptions
  } = options;
  const splitEl = useSplitText(el, {
    splitBy,
    ...splitOptions,
  });

  useAnimateOnScroll(splitEl[splitBy], animateOnScrollOptions);
}

export * from "./baked";
export * from "./directive";
