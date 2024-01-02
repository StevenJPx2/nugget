import "gsap";
import { gsap } from "gsap";
import {
  shallowRef,
  tryOnMounted,
  watchPostEffect,
  createEventHook,
} from "#imports";
import type { EventHookOn } from "@vueuse/core";
import type { ShallowRef } from "vue";
import type { StrongTimelineVars } from "./types";

export type TimelineReturn = {
  tl: ShallowRef<gsap.core.Timeline | undefined>;
  tlFn: EventHookOn<gsap.core.Timeline>;
  play: () => gsap.core.Timeline | undefined;
  pause: () => gsap.core.Timeline | undefined;
  restart: () => gsap.core.Timeline | undefined;
  resume: () => gsap.core.Timeline | undefined;
  progress: (value: number) => gsap.core.Timeline | undefined;
  seek: (value: number | string) => gsap.core.Timeline | undefined;
  isActive: () => boolean | undefined;
};

export function timeline(vars?: StrongTimelineVars): TimelineReturn {
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
}
