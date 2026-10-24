import { type MaybeRefOrGetter, nuggetBakedPresets, toRef } from "#imports";
import { useAnimateOnScroll } from ".";
import {
  type UseBakedAnimationOptions,
  generateAnimationTweens,
} from "../../baked";
import { generateTweenValues, mergeTweens } from "../../utils";

/** Options for `useAnimateOnScroll` */
export type UseBakedAnimateOnScrollOptions =
  Partial<UseBakedAnimationOptions> & {
    /**
     * Determines whether the animation should be triggered on scroll
     * @default true
     * @remarks You can also directly pass `gsap.ScrollTrigger` options
     */
    scrollAnimationOptions?: boolean | gsap.AnimationVars["scrollTrigger"];
  };

export function useBakedAnimateOnScroll(
  el: MaybeRefOrGetter<gsap.DOMTarget | undefined>,
  {
    animationOptions = {},
    tweenValues,
    scrollAnimationOptions = true,
  }: UseBakedAnimateOnScrollOptions = {},
) {
  const tweens = mergeTweens(
    generateAnimationTweens(animationOptions, nuggetBakedPresets),
    generateTweenValues(tweenValues),
  );

  useAnimateOnScroll(toRef(el), {
    tweens,
    scrollAnimationOptions,
  });
}
