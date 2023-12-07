import { toValue, type MaybeRefOrGetter } from "#imports";
import { useGsap, type UseGsapReturn } from "../use-gsap";
import type { Simplify } from "../../types";

/** Options for `useAnimateOnScroll` */
export type UseAnimateOnScrollOptions = Simplify<
  Parameters<UseGsapReturn["fromTo"]>[1] & {
    /** Determines whether the animation should be triggered on scroll
     * @default true
     * @remarks You can also directly pass `gsap.ScrollTrigger` options
     * */
    scrollAnimationOptions?: boolean | gsap.AnimationVars["scrollTrigger"];
  }
>;

export function useAnimateOnScroll(
  el: MaybeRefOrGetter<gsap.DOMTarget | undefined>,
  options: UseAnimateOnScrollOptions,
) {
  const unrefEl = toValue(el);
  const { from, to } = options;

  let scrollAnimationOptions: gsap.AnimationVars["scrollTrigger"] = undefined;

  if (options.scrollAnimationOptions) {
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

  const { fromTo } = useGsap();

  fromTo(el, {
    from,
    to: {
      ...to,
      scrollTrigger: {
        ...(scrollAnimationOptions ?? {}),
        ...(to.scrollTrigger ?? {}),
      },
    },
  });
}
