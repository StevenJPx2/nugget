import "gsap";
import { useGsap } from "../use-gsap";
import {
  readonly,
  ref,
  watch,
  type MaybeRef,
  unrefElement,
  unref,
  type Ref,
} from "#imports";
import type { ShallowRef } from "vue";
import type { MaybeComputedElementRef } from "@vueuse/core";
import type { Direction, Simplify } from "../../types";
import { concat, pascalCase } from "string-ts";

export type UseConstructTransitionCallbackOptions = {
  /** Callback when the enter animation is about to start */
  onBeforeEnter?: () => void;
  /** Callback when the enter animation starts */
  onEnter?: () => void;
  /** Callback when the enter animation is complete */
  onAfterEnter?: () => void;
  /** Callback when the leave animation is about to start */
  onBeforeLeave?: () => void;
  /** Callback when the leave animation starts */
  onLeave?: () => void;
  /** Callback when the leave animation is complete */
  onAfterLeave?: () => void;
};

export type PlayState =
  keyof UseConstructTransitionCallbackOptions extends `on${infer K}`
    ? Uncapitalize<K>
    : never;

export type UseConstructTransitionOptions = Simplify<
  {
    /** The element to animate */
    parentContainer: MaybeComputedElementRef;
    /** Direction to animate transition in */
    direction?: MaybeRef<Direction | undefined>;
  } & UseConstructTransitionCallbackOptions
>;

export type TransitionOutput = {
  state: Readonly<Ref<PlayState>>;
  isActive: () => "enter" | "leave" | "none";
  isAnimating: () => boolean;
  play: () => void;
  stop: () => void;
};

export type UseConstructTransitionOutput = Simplify<
  TransitionOutput & {
    enterTl: ShallowRef<gsap.core.Timeline | undefined>;
    leaveTl: ShallowRef<gsap.core.Timeline | undefined>;
  }
>;

export function useConstructTransition(
  options: UseConstructTransitionOptions,
): UseConstructTransitionOutput {
  const { gsap, timeline } = useGsap();
  const playState = ref<PlayState>("beforeEnter");

  watch(
    () =>
      [
        unrefElement(options.parentContainer),
        unref(options.direction),
      ] as const,
    ([container, direction]) => {
      if (!container) return;
      gsap.set(container, {
        scaleY: direction === "bottom" ? -1 : 1,
        scaleX: direction === "right" ? -1 : 1,
      });
    },
    { immediate: true, flush: "post" },
  );

  const {
    tl: enterTl,
    isActive: isEnterActive,
    restart: enterRestart,
    pause: enterPause,
  } = timeline({
    paused: true,
    onStart: () => {
      playState.value = "enter";
    },
    onComplete: () => {
      playState.value = "afterEnter";
    },
  });
  const {
    tl: leaveTl,
    isActive: isLeaveActive,
    restart: leaveRestart,
    pause: leavePause,
  } = timeline({
    paused: true,
    onStart: () => {
      playState.value = "leave";
    },
    onComplete: () => {
      playState.value = "afterLeave";
    },
  });

  const isActive = () =>
    isEnterActive() ? "enter" : isLeaveActive() ? "leave" : "none";

  const isAnimating = () => isActive() !== "none";

  const play = () => {
    if (isAnimating()) return;

    if (playState.value === "beforeEnter" || playState.value === "afterLeave") {
      playState.value = "beforeEnter";
      enterRestart();
    } else if (playState.value === "afterEnter") {
      playState.value = "beforeLeave";
      leaveRestart();
    }
  };

  const stop = () => {
    if (!isAnimating()) return;

    if (playState.value === "enter") {
      enterPause()?.progress(1);
      playState.value = "afterEnter";
    } else if (playState.value === "leave") {
      leavePause()?.progress(1);
      playState.value = "afterLeave";
    }
  };

  watch(playState, (value) => {
    options[concat("on", pascalCase(value))]?.();
  });

  return {
    enterTl,
    leaveTl,
    state: readonly(playState),
    isActive,
    isAnimating,
    play,
    stop,
  };
}
