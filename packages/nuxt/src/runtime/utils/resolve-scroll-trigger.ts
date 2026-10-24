import type { StrongTweenVars } from "../types";

/** Scroll settings accepted by the animate-on-scroll composables */
export type ScrollAnimationOptions =
  | boolean
  | gsap.AnimationVars["scrollTrigger"];

/**
 * Builds the `scrollTrigger` for an animate-on-scroll tween
 * @param trigger - The element that triggers the animation
 * @param options - `true` for the default trigger, or `ScrollTrigger` vars
 * @param to - The `to` tween, whose own `scrollTrigger` wins
 */
export function resolveScrollTrigger(
  trigger: gsap.DOMTarget | undefined,
  options: ScrollAnimationOptions | undefined,
  to: StrongTweenVars = {},
): gsap.AnimationVars["scrollTrigger"] {
  if (!options) return undefined;

  const scrollTrigger =
    options instanceof Object
      ? { trigger, ...options }
      : { trigger, start: "top 80%" };

  return { ...scrollTrigger, ...(to.scrollTrigger ?? {}) };
}
