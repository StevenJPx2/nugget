import type { UseBakedAnimationOptions } from "./useBakedAnimation";
import { toValue } from "#imports";
import useBakedAnimation from "./useBakedAnimation";
import { type MaybeElementOrElementListRefOrGetter } from "../types";

/** Options for `useAnimateOnScroll` */
export type UseAnimateOnScrollOptions = Partial<UseBakedAnimationOptions> & {
  /** Determines whether the animation should be triggered on scroll
   * @default true
   * @remarks You can also directly pass `gsap.ScrollTrigger` options
   * */
  scrollAnimationOptions?: boolean | gsap.AnimationVars["scrollTrigger"];
};

export default function (
  el: MaybeElementOrElementListRefOrGetter,
  options: UseAnimateOnScrollOptions = {},
) {
  const unrefEl = toValue(el);
  const { animationOptions = {}, tweenValues = {} } = options;

  let scrollAnimationOptions: gsap.AnimationVars["scrollTrigger"] = undefined;

  if (!!options.scrollAnimationOptions) {
    scrollAnimationOptions = {
      trigger: unrefEl,
      start: "top 80%",
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
