import { type MaybeRefOrGetter, toValue } from "#imports";
import type { FromToTweens } from "../../types";
import { transformFromToTweens } from "../../utils";
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
  scrollAnimationOptions?: boolean | gsap.AnimationVars["scrollTrigger"];
};

export function useAnimateOnScroll(
  el: MaybeRefOrGetter<gsap.DOMTarget | undefined>,
  options: UseAnimateOnScrollOptions,
) {
  const unrefEl = toValue(el);
  const { tweens } = options;
  const { from, to } = transformFromToTweens(tweens);

  let scrollTrigger: gsap.AnimationVars["scrollTrigger"] = undefined;

  if (options.scrollAnimationOptions) {
    scrollTrigger = {
      trigger: unrefEl,
      start: "top 80%",
    };
    if (options.scrollAnimationOptions instanceof Object) {
      scrollTrigger = {
        trigger: unrefEl,
        ...options.scrollAnimationOptions,
      };
    }

    scrollTrigger = {
      ...scrollTrigger,
      ...(to.scrollTrigger ?? {}),
    };
  }

  const { fromTo } = useGsap();

  fromTo(el, {
    from,
    to: {
      ...to,
      scrollTrigger,
    },
  });
}

export * from "./baked";
export * from "./directive";
