import { type MaybeRefOrGetter, toRef } from "#imports";
import { type UseBakedAnimationOptions } from "./animate";
import type { Simplify } from "../../types";
import { generateAnimationTweens } from "./utils";
import { useAnimateOnScroll } from "../use-animate-on-scroll";

/** Options for `useAnimateOnScroll` */
export type UseBakedAnimateOnScrollOptions = Simplify<
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
  options: UseBakedAnimateOnScrollOptions = {},
) {
  const {
    animationOptions = {},
    tweenValues = {},
    scrollAnimationOptions = true,
  } = options;

  const { from, to } = generateAnimationTweens(animationOptions);
  useAnimateOnScroll(toRef(el), {
    from,
    to: { ...to, ...tweenValues },
    scrollAnimationOptions,
  });
}
