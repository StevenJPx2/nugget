import {
  computed,
  ref,
  toRef,
  toValue,
  tryOnMounted,
  useElementSize,
  useElementVisibility,
  useRafFn,
  useWindowScroll,
  useWindowSize,
  watch,
  watchEffect,
  type MaybeRef,
} from "#imports";
import type { MaybeComputedElementRef } from "@vueuse/core";

// Most of this credit goes to:
// https://stackoverflow.com/questions/71165923/how-do-i-make-an-infinite-marquee-with-js#answer-71167758

export type UseInfiniteMarqueeOptions = {
  /**
   * The speed of the marquee
   * @default 0.05
   */
  speed?: number;
  /**
   * The gap between the repeated elements
   * @default "0rem"
   */
  gap?: string;
  /**
   * The direction of the marquee
   * @default "right"
   */
  direction?: "left" | "right";
  /**
   * Whether the marquee should pause on hover
   * @default undefined
   */
  pauseOnHover?: boolean;
  /**
   * The acceleration of the marquee
   * @default 0.05
   */
  acceleration?: number;
};

export const useInfiniteMarquee = (
  container: MaybeRef<HTMLElement>,
  options: UseInfiniteMarqueeOptions = {},
) => {
  const {
    speed = 0.05,
    gap = "0rem",
    direction = "right",
    acceleration = 0.05,
  } = options;
  const loopContainerParent = toRef(container);
  const loopObjects = computed(() => loopContainerParent.value?.children[0]);

  const isHovering = ref(false);
  const lerpVals = ref({ current: 0, target: 0 });
  const interpolationFactor = 0.1;
  const directionConstant: -1 | 1 = direction === "left" ? -1 : 1;
  const leftPercent = `calc(${directionConstant * -100}% - ${gap})`;
  const isTargetVisible = useElementVisibility(container);
  const { width: containerWidth } = useElementSize(loopContainer);

  const x = ref(0);

  const { width: windowWidth } = useWindowSize();
  const { y: windowY } = useWindowScroll();

  const lerp = (lerpVals: { current: number; target: number }) =>
    lerpVals.current * (1 - interpolationFactor) +
    lerpVals.target * interpolationFactor;

  const target = computed(
    () =>
      ((containerWidth.value - windowWidth.value) / containerWidth.value) * 100,
  );

  const {
    pause: pauseRaf,
    resume: resumeRaf,
    isActive: isRafActive,
  } = useRafFn(
    () => {
      const lerpValsConstant = lerpVals.value;
      lerpValsConstant.target += speed;
      lerpValsConstant.current = lerp(lerpValsConstant);

      if (lerpValsConstant.target > target.value) {
        lerpValsConstant.current -= lerpValsConstant.target;
        lerpValsConstant.target = 0;
      }

      x.value = lerpValsConstant.current * directionConstant;
    },
    { immediate: false },
  );

  tryOnMounted(() => {
    loopObjects.value.parentElement?.appendChild(
      document.createElement("div", {
        style: { transform: `translateX(${x})` },
      }),
    );
  });

  watch(windowY, () => {
    lerpVals.value.target += acceleration * 5;
  });

  watchEffect(() => {
    if ((!isTargetVisible.value || isHovering.value) && isRafActive.value) {
      pauseRaf();
    } else {
      resumeRaf();
    }
  });
};
