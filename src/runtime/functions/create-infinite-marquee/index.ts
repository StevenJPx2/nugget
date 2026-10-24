import gsap from "gsap";
import type { DefineComponent } from "vue";
import {
  computed,
  defineComponent,
  h,
  ref,
  tryOnScopeDispose,
  useElementHover,
  useElementSize,
  useElementVisibility,
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
): DefineComponent => {
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

  const lerp = (lerpVals: { current: number; target: number }, ratio = 1) => {
    const factor = 1 - (1 - interpolationFactor) ** ratio;
    return lerpVals.current * (1 - factor) + lerpVals.target * factor;
  };

  const target = computed(
    () =>
      ((containerWidth.value - windowWidth.value) / containerWidth.value) * 100,
  );

  // Speeds are tuned per 60fps frame, so scale them by gsap's delta ratio
  // to keep the marquee at the same pace on any refresh rate.
  const tick = () => {
    const ratio = gsap.ticker.deltaRatio(60);
    const lerpValsConstant = lerpVals.value;
    lerpValsConstant.target += speed * ratio;
    lerpValsConstant.current = lerp(lerpValsConstant, ratio);

    if (lerpValsConstant.target > target.value) {
      lerpValsConstant.current -= lerpValsConstant.target;
      lerpValsConstant.target = 0;
    }

    x.value = lerpValsConstant.current * directionConstant;
  };

  let isTicking = false;
  const setTicking = (value: boolean) => {
    if (value === isTicking) return;

    isTicking = value;
    if (value) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
  };

  watch(windowY, () => {
    lerpVals.value.target += acceleration * 5;
  });

  watchPostEffect(() => {
    setTicking(isTargetVisible.value && !isHovering.value);
  });

  tryOnScopeDispose(() => setTicking(false));

  return defineComponent({
    setup(_, { slots }) {
      return () => {
        const content = slots.default?.() ?? [];

        return h(
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
                // Reuse the host app's Vue so the repeated copy renders identically
                content.map((vnode) =>
                  h(vnode.type as string, vnode.props, vnode.children as string),
                ),
              ),
              ...content,
            ],
          ),
        );
      };
    },
  });
};
