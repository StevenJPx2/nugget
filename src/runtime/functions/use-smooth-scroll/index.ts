import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InjectionKey, MaybeRefOrGetter, ShallowRef } from "vue";
import {
  inject,
  shallowRef,
  toValue,
  tryOnMounted,
  tryOnScopeDispose,
} from "#imports";

/** Options for `useSmoothScroll`, passed straight to `ScrollSmoother.create` */
export type UseSmoothScrollOptions = ScrollSmoother.Vars;

export const smoothScrollKey: InjectionKey<
  ShallowRef<ScrollSmoother | undefined>
> = Symbol("nugget-smooth-scroll");

/**
 * Smooth scrolling with GSAP's `ScrollSmoother`
 * @param options - `ScrollSmoother` vars, or a getter for them
 * @remarks
 * - Created on mount (so it stays SSR friendly) and killed when the scope is disposed
 * - Only one `ScrollSmoother` can exist at a time
 * - Prefer the `SmoothScroll` component, which renders the wrapper and content elements
 */
export function useSmoothScroll(
  options: MaybeRefOrGetter<UseSmoothScrollOptions> = {},
): ShallowRef<ScrollSmoother | undefined> {
  const smoother = shallowRef<ScrollSmoother>();

  tryOnMounted(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    smoother.value = ScrollSmoother.create(toValue(options));
    ScrollTrigger.refresh();
  });

  tryOnScopeDispose(() => {
    smoother.value?.kill();
    smoother.value = undefined;
  });

  return smoother;
}

/** The `ScrollSmoother` of the closest `SmoothScroll` component */
export function injectSmoothScroll(): ShallowRef<ScrollSmoother | undefined> {
  return inject(smoothScrollKey, shallowRef());
}
