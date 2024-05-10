import { type MaybeRefOrGetter, nuggetBakedPresets, toRef } from "#imports";
import { useAnimateOnScroll } from ".";
import {
  type UseBakedAnimationOptions,
  generateAnimationTweens,
} from "../../baked";

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
    scrollAnimationOptions = true,
  }: UseBakedAnimateOnScrollOptions = {},
) {
  const tweens = generateAnimationTweens(animationOptions, nuggetBakedPresets);

  useAnimateOnScroll(toRef(el), {
    tweens,
    scrollAnimationOptions,
  });
}
