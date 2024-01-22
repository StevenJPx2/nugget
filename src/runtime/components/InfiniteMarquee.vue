<script setup lang="ts">
import {
  computed,
  ref,
  tryOnMounted,
  useElementSize,
  useElementVisibility,
  useRafFn,
  useWindowScroll,
  useWindowSize,
  watch,
  watchEffect,
} from "#imports";

// Most of this credit goes to:
// https://stackoverflow.com/questions/71165923/how-do-i-make-an-infinite-marquee-with-js#answer-71167758

const loopContainerParent = ref<HTMLElement | null>(null);
const loopContainer = ref<HTMLElement | null>(null);

const props = withDefaults(
  defineProps<{
    /** The speed of the marquee
     * @default 0.05
     */
    speed?: number;
    /** The gap between the repeated elements
     * @default "0rem"
     */
    gap?: string;
    /** The direction of the marquee
     * @default "right"
     */
    direction?: "left" | "right";
    /** Whether the marquee should pause on hover
     * @default undefined
     */
    pauseOnHover?: boolean;
    /** The acceleration of the marquee
     * @default 0.05
     */
    acceleration?: number;
  }>(),
  { speed: 0.05, gap: "0rem", direction: "right", acceleration: 0.05 },
);

const isHovering = ref(false);
const lerpVals = ref({ current: 0, target: 0 });
const interpolationFactor = 0.1;
const directionConstant: -1 | 1 = props.direction === "left" ? -1 : 1;
const leftPercent = `calc(${directionConstant * -100}% - ${props.gap})`;
const isTargetVisible = useElementVisibility(loopContainerParent);
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
    lerpValsConstant.target += props.speed;
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
  loopContainerParent.value?.children[0].children[1]?.classList.add("repeated");
});

watch(windowY, () => {
  lerpVals.value.target += props.acceleration * 5;
});

watchEffect(() => {
  if ((!isTargetVisible.value || isHovering.value) && isRafActive.value) {
    pauseRaf();
  } else {
    resumeRaf();
  }
});
</script>

<template>
  <div
    ref="loopContainerParent"
    :style="{
      overflow: 'hidden',
    }"
    @mouseover="if (props.pauseOnHover) isHovering = true;"
    @mouseleave="if (props.pauseOnHover) isHovering = false;"
  >
    <div
      ref="loopContainer"
      :style="{
        transform: `translateX(${x}%)`,
      }"
      class="loop-container"
    >
      <slot key="1" />
      <slot key="2" />
    </div>
  </div>
</template>

<style scoped>
.loop-container {
  display: inline-flex;
  position: relative;
  white-space: nowrap;
}

:deep(.repeated) {
  position: absolute;
  left: v-bind(leftPercent);
}
</style>
