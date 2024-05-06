import {
  computed,
  defineComponent,
  h,
  ref,
  useElementHover,
  useElementSize,
  useElementVisibility,
  useRafFn,
  useWindowScroll,
  useWindowSize,
  watch,
  watchPostEffect,
} from "#imports";

// Most of this credit goes to:
// https://stackoverflow.com/questions/71165923/how-do-i-make-an-infinite-marquee-with-js#answer-71167758

export type CreateInfiniteMarqueeOptions = {
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

export const createInfiniteMarquee = (
  options: CreateInfiniteMarqueeOptions = {},
) => {
  const {
    speed = 0.05,
    gap = "0rem",
    direction = "right",
    acceleration = 0.05,
  } = options;

  const parent = ref<HTMLElement>();
  const child = ref<HTMLElement>();

  const lerpVals = ref({ current: 0, target: 0 });
  const interpolationFactor = 0.1;
  const directionConstant: -1 | 1 = direction === "left" ? -1 : 1;
  const left = `calc(${directionConstant * -100}% - ${gap})`;
  const isHovering =
    options.pauseOnHover === false ? ref(false) : useElementHover(parent);
  const isTargetVisible = useElementVisibility(parent);
  const { width: containerWidth } = useElementSize(child);

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

  watch(windowY, () => {
    lerpVals.value.target += acceleration * 5;
  });

  watchPostEffect(() => {
    if ((!isTargetVisible.value || isHovering.value) && isRafActive.value) {
      pauseRaf();
    } else {
      resumeRaf();
    }
  });

  return defineComponent({
    setup(_, { slots }) {
      return () =>
        h(
          "div",
          {
            ref: parent,
            style: { overflow: "hidden" },
          },
          h(
            "div",
            {
              ref: child,
              style: {
                transform: `translateX(${x.value}%)`,
                display: "inline-flex",
                "white-space": "nowrap",
                position: "relative",
              },
            },
            [
              h(
                "div",
                {
                  style: {
                    position: "absolute",
                    left,
                  },
                },
                slots.default?.(),
              ),
              slots.default?.(),
            ],
          ),
        );
    },
  });
};
