import { type MaybeRefOrGetter, toValue } from "#imports";
import type { FromToTweens } from "../../types";
import {
  type ScrollAnimationOptions,
  resolveScrollTrigger,
  transformFromToTweens,
} from "../../utils";
import { useGsap } from "../use-gsap";

/** Options for `useAnimateOnScroll` */
export type UseAnimateOnScrollOptions = {
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
   *
   * ```jsx
   * {
   *  [propertyName]: [from, to]
   * }
   * ```
   */
  tweens: FromToTweens;

  /** Determines whether the animation should be triggered on scroll
   * @default true
   * @remarks You can also directly pass `gsap.ScrollTrigger` options
   */
  scrollAnimationOptions?: ScrollAnimationOptions;
};

export function useAnimateOnScroll(
  el: MaybeRefOrGetter<gsap.DOMTarget | undefined>,
  options: UseAnimateOnScrollOptions,
) {
  const { from, to } = transformFromToTweens(options.tweens);
  const { fromTo } = useGsap();

  fromTo(el, {
    from,
    to: {
      ...to,
      scrollTrigger: resolveScrollTrigger(
        toValue(el),
        options.scrollAnimationOptions,
        to,
      ),
    },
  });
}

export * from "./baked";
export * from "./directive";
