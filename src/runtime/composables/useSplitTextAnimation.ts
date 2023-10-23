import type { MaybeComputedElementRef } from "@vueuse/core";
import { useNuxtApp, useSplitText, watchOnce } from "#imports";

type AnimationOptions = {
  opacity?: boolean;
  translate?: "bottom" | "top" | "left" | "right";
  skew?: "bottom" | "top" | "left" | "right";
  scale?: boolean;
  rotate?: boolean;
  blur?: boolean;
};

type UseSplitTextAnimationOptions = {
  splitBy?: "chars" | "words" | "lines";
  options?: AnimationOptions;
  duration?: number;
  stagger?: number;
  ease?: string;
  delay?: number;
};

export default function (
  refEl: MaybeComputedElementRef,
  options?: UseSplitTextAnimationOptions,
) {
  const { $gsap } = useNuxtApp();
  const { words } = useSplitText(refEl, { splitBy: "words" });

  watchOnce(
    words,
    () => {
      if (!words.value) return;
      $gsap.fromTo(
        words.value,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "quart.inOut",
        },
      );
    },
    { immediate: true },
  );
}
