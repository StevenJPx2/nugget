import {
  type MaybeRefOrGetter,
  watchPostEffect,
  tryOnScopeDispose,
  createEventHook,
  tryOnMounted,
  shallowRef,
  until,
  isRef,
} from "#imports";
import "gsap";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { Ease } from "../../types";
import { invoke, type EventHookOn } from "@vueuse/core";
import type { ShallowRef } from "vue";

type EaseOption = {
  /** The ease of the tween
   * @remarks
   * - `Ease` is a custom type that allows the LSP to infer the correct string values for `ease`
   * - You can also pass a custom `gsap.EaseFunction`
   * */
  ease?: Ease | gsap.EaseFunction;
};

/** Strongly typed TweenVars */
export type StrongTweenVars = gsap.TweenVars & EaseOption;

/** Strongly typed TimelineVars */
export type StrongTimelineVars = gsap.TimelineVars & EaseOption;

/** Function to activate the tween on mount
 * @param el - The element to tween
 * @param updateFactory - The update function to run on mount
 * */
const activationFn = (
  el: MaybeRefOrGetter<gsap.TweenTarget | undefined>,
  tween: gsap.core.Tween | undefined,
  updateFactory: (el: gsap.TweenTarget | undefined) => void,
) => {
  invoke(async () => {
    if (!isRef<gsap.TweenTarget | undefined>(el)) {
      updateFactory(el);
      return;
    }
    const val = await until(el).toMatch((v) => v !== undefined);
    updateFactory(val);
  });

  tryOnScopeDispose(() => tween?.kill());
};

/** Composable to use gsap
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

    timeline: (
      vars?: StrongTimelineVars,
    ): {
      tl: ShallowRef<gsap.core.Timeline | undefined>;
      tlFn: EventHookOn<gsap.core.Timeline>;
      play: () => gsap.core.Timeline | undefined;
      pause: () => gsap.core.Timeline | undefined;
      restart: () => gsap.core.Timeline | undefined;
      resume: () => gsap.core.Timeline | undefined;
      progress: (value: number) => gsap.core.Timeline | undefined;
      seek: (value: number | string) => gsap.core.Timeline | undefined;
      isActive: () => boolean | undefined;
    } => {
      const tl = shallowRef<gsap.core.Timeline>();

      const onMount = createEventHook<gsap.core.Timeline>();

      tryOnMounted(() => {
        tl.value = gsap.timeline(vars);
      });

      watchPostEffect(() => {
        onMount.trigger(tl.value);
      });

      onMount.off((tl) => tl.kill());

      return {
        tl,
        tlFn: onMount.on,
        play: () => tl.value?.play(),
        pause: () => tl.value?.pause(),
        restart: () => tl.value?.restart(),
        resume: () => tl.value?.resume(),
        progress: (value) => tl.value?.progress(value),
        seek: (value) => tl.value?.seek(value),
        isActive: () => tl.value?.isActive(),
      };
    },

    set: (
      target: MaybeRefOrGetter<gsap.TweenTarget>,
      vars: StrongTweenVars,
    ) => {
      let tween: gsap.core.Tween | undefined;
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween = gsap.set(el, vars);
      });
      return tween;
    },

    fromTo: (
      target: MaybeRefOrGetter<gsap.TweenTarget | undefined>,
      options: { from: StrongTweenVars; to: StrongTweenVars },
    ) => {
      let tween: gsap.core.Tween | undefined;
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween = gsap.fromTo(el, options.from, options.to);
      });
      return tween;
    },

    to: (target: MaybeRefOrGetter<gsap.TweenTarget>, vars: StrongTweenVars) => {
      let tween: gsap.core.Tween | undefined;
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween = gsap.to(el, vars);
      });
      return tween;
    },

    from: (
      target: MaybeRefOrGetter<gsap.TweenTarget>,
      vars: StrongTweenVars,
    ) => {
      let tween: gsap.core.Tween | undefined;
      activationFn(target, tween, (el) => {
        if (!el) return;
        tween = gsap.from(el, vars);
      });
      return tween;
    },
  };
}

export type UseGsapReturn = ReturnType<typeof useGsap>;
