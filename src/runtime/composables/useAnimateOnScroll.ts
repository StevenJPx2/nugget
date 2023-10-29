import type { UseBakedAnimationOptions } from "./useBakedAnimation";
import { toValue, type MaybeRefOrGetter } from "#imports";
import useBakedAnimation from "./useBakedAnimation";
import type { Simplify } from "../types";

/** Options for `useAnimateOnScroll` */
export type UseAnimateOnScrollOptions = Simplify<
  Partial<UseBakedAnimationOptions> & {
    /** Determines whether the animation should be triggered on scroll
     * @default true
     * @remarks You can also directly pass `gsap.ScrollTrigger` options
     * */
    scrollAnimationOptions?: boolean | gsap.AnimationVars["scrollTrigger"];
  }
>;

export default function (
  el: MaybeRefOrGetter<gsap.DOMTarget | undefined>,
  options: UseAnimateOnScrollOptions = {},
) {
  const unrefEl = toValue(el);
  const { animationOptions = {}, tweenValues = {} } = options;

  let scrollAnimationOptions: gsap.AnimationVars["scrollTrigger"] = undefined;

  if (!!options.scrollAnimationOptions) {
    scrollAnimationOptions = {
      trigger: unrefEl,
      start: "top bottom",
    };
    if (options.scrollAnimationOptions instanceof Object) {
      scrollAnimationOptions = {
        trigger: unrefEl,
        ...options.scrollAnimationOptions,
      };
    }
  }

  useBakedAnimation(unrefEl, {
    animationOptions,
    tweenValues: {
      ...tweenValues,
      scrollTrigger: scrollAnimationOptions,
    },
  });
}
