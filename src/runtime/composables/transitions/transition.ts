import useGsap from "../useGsap";
import {
  readonly,
  ref,
  watch,
  type MaybeRef,
  unrefElement,
  unref,
  type Ref,
} from "#imports";
import type { MaybeComputedElementRef } from "@vueuse/core";
import type { Simplify } from "../../types";

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

type PlayState =
  keyof UseConstructTransitionCallbackOptions extends `on${infer K}`
    ? Uncapitalize<K>
    : never;

export type UseConstructTransitionOptions = Simplify<
  {
    /** The element to animate */
    parentContainer: MaybeComputedElementRef;
    /** Should the animation be flipped horizontally */
    flipX?: MaybeRef<boolean>;
    /** Should the animation be flipped vertically */
    flipY?: MaybeRef<boolean>;
  } & UseConstructTransitionCallbackOptions
>;

export default function useConstructTransition(
  options: UseConstructTransitionOptions,
) {
  const { gsap, timeline } = useGsap();
  const playState = ref<PlayState>("beforeEnter");

  watch(
    () =>
      [
        unrefElement(options.parentContainer),
        unref(options.flipX),
        unref(options.flipY),
      ] as const,
    ([container, flipX, flipY]) => {
      if (!container) return;
      gsap.set(container, {
        scaleY: flipY ? -1 : 1,
        scaleX: flipX ? -1 : 1,
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
    switch (value) {
      case "beforeEnter": {
        options.onBeforeEnter?.();
        break;
      }
      case "beforeLeave": {
        options.onBeforeLeave?.();
        break;
      }
      case "afterEnter": {
        options.onAfterEnter?.();
        break;
      }
      case "afterLeave": {
        options.onAfterLeave?.();
        break;
      }
      case "enter": {
        options.onEnter?.();
        break;
      }
      case "leave": {
        options.onLeave?.();
        break;
      }
      default: {
        // compile-time check to ensure all cases are handled
        const _: never = value;
        _;
      }
    }
  });

  return {
    enterTl,
    leaveTl,
    state: readonly(playState) as Readonly<Ref<PlayState>>,
    isActive,
    isAnimating,
    play,
    stop,
  };
}
