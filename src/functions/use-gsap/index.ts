import {
  ref,
  type MaybeRefOrGetter,
  tryOnScopeDispose,
  tryOnMounted,
  until,
  type Ref,
  toRef,
} from "#imports";
import "gsap";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { invoke } from "@vueuse/core";
import type { StrongTweenVars } from "../../types";
import { timeline } from "./timeline";

/** Function to activate the tween on mount
 * @param el - The element to tween
 * @param updateFactory - The update function to run on mount
 * */
const activationFn = (
  el: MaybeRefOrGetter<gsap.TweenTarget | undefined>,
  tween: Ref<gsap.core.Tween | undefined>,
  updateFactory: (el: gsap.TweenTarget | undefined) => void,
) => {
  const refEl = toRef(el);
  invoke(async () => {
    const val = await until(refEl).toMatch((v) => v !== undefined);
    updateFactory(val);
  });

  tryOnScopeDispose(() => tween.value?.kill());
};

/**
 * Composable to use gsap
 * @param plugins - The plugins to register to gsap
 * @remarks
 * - This is a composable to make it easier to use gsap with Vue
 * - It also allows the LSP to infer the correct types for `gsap`
 * - It registers `ScrollTrigger` by default
 * */
export function useGsap(plugins: object[] = [ScrollTrigger]) {
  tryOnMounted(() => {
    gsap.registerPlugin(...plugins);
  });
  return {
    gsap,

    timeline,

    set: (
      target: MaybeRefOrGetter<gsap.TweenTarget>,
      vars: StrongTweenVars,
    ) => {
      const tween = ref<gsap.core.Tween>();
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween.value = gsap.set(el, vars);
      });
      return tween;
    },

    fromTo: (
      target: MaybeRefOrGetter<gsap.TweenTarget | undefined>,
      options: { from: StrongTweenVars; to: StrongTweenVars },
    ) => {
      const tween = ref<gsap.core.Tween>();
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween.value = gsap.fromTo(el, options.from, options.to);
      });
      return tween;
    },

    to: (target: MaybeRefOrGetter<gsap.TweenTarget>, vars: StrongTweenVars) => {
      const tween = ref<gsap.core.Tween>();
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween.value = gsap.to(el, vars);
      });
      return tween;
    },

    from: (
      target: MaybeRefOrGetter<gsap.TweenTarget>,
      vars: StrongTweenVars,
    ) => {
      const tween = ref<gsap.core.Tween>();
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween.value = gsap.from(el, vars);
      });
      return tween;
    },
  };
}

export type UseGsapReturn = ReturnType<typeof useGsap>;

export * from "./baked";
