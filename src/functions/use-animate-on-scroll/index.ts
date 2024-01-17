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
