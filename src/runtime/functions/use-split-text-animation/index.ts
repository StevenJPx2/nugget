import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resolveScrollTrigger, transformFromToTweens } from "../../utils";
import type { UseAnimateOnScrollOptions } from "../use-animate-on-scroll";
import {
  type MaybeSplitTextTarget,
  type UseSplitTextOptions,
  resolveSplitTextTarget,
  useSplitText,
} from "../use-split-text";

export type PartialSplitTextAnimationOptions = {
  /** Defines which split pieces are animated
   * @default "lines"
   */
  splitBy?: "chars" | "words" | "lines";
  /** Additional `SplitText` vars, such as `mask` or `autoSplit`
   * @remarks `autoSplit` defaults to `true` when animating lines, so fonts and resizes re-split them
   */
  splitOptions?: Omit<UseSplitTextOptions, "onSplit">;
};

/** Completely optional options for the `useSplitTextAnimation` composable */
export type UseSplitTextAnimationOptions = UseAnimateOnScrollOptions &
  PartialSplitTextAnimationOptions;

/**
 * Animates a text split by chars, words or lines
 * @param el - The element or ref to animate
 * @param options - The animation options
 * @remarks
 * - Uses GSAP's `SplitText` through `useSplitText`
 * - The tween is created in `onSplit`, so re-splits swap it seamlessly
 * @example
 * ```ts
 * const refEl = ref<HTMLElement>();
 * useSplitTextAnimation(refEl, {
 *   splitBy: "chars",
 *   tweens: { y: ["100%", 0], stagger: [undefined, 0.05] },
 * });
 * ```
 */
export function useSplitTextAnimation(
  el: MaybeSplitTextTarget,
  options: UseSplitTextAnimationOptions,
) {
  const { splitBy = "lines", splitOptions, tweens } = options;
  const { from, to } = transformFromToTweens(tweens);
  const type = splitOptions?.type ?? splitBy;

  useSplitText(el, {
    autoSplit: splitBy === "lines",
    ...splitOptions,
    type: type.includes(splitBy) ? type : `${type}, ${splitBy}`,
    onSplit: (self) => {
      gsap.registerPlugin(ScrollTrigger);

      // A staggered tween only renders each piece's `from` state when its own turn starts,
      // so later lines would sit visible, then snap hidden one by one. Hide them all now.
      gsap.set(self[splitBy], { ...from });

      return gsap.fromTo(self[splitBy], { ...from }, {
        ...to,
        scrollTrigger: resolveScrollTrigger(
          resolveSplitTextTarget(el),
          options.scrollAnimationOptions,
          to,
        ),
      });
    },
  });
}

export * from "./baked";
export * from "./directive";
