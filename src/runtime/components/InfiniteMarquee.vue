<script setup lang="ts">
import {
  ref,
  tryOnMounted,
  useElementVisibility,
  useRafFn,
  useWindowScroll,
  watch,
} from "#imports";

// Most of this credit goes to:
// https://stackoverflow.com/questions/71165923/how-do-i-make-an-infinite-marquee-with-js#answer-71167758

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
    /** The target distance before resetting the marquee
     * @default 100
     */
    target?: number;
  }>(),
  { speed: 0.05, gap: "0rem", direction: "right", target: 100 },
);
const lerpVals = ref({ current: 0, target: 0 });
const interpolationFactor = 0.1;
const directionConstant: -1 | 1 = props.direction === "left" ? -1 : 1;
const leftPercent = `calc(${directionConstant * -100}% - ${props.gap})`;
const isTargetVisible = useElementVisibility(loopContainer);

const x = ref(0);

const { y: windowY } = useWindowScroll();

const lerp = (lerpVals: { current: number; target: number }) =>
  lerpVals.current * (1 - interpolationFactor) +
  lerpVals.target * interpolationFactor;

const { pause, resume } = useRafFn(
  () => {
    const lerpValsConstant = lerpVals.value;
    lerpValsConstant.target += props.speed;
    lerpValsConstant.current = lerp(lerpValsConstant);

    if (lerpValsConstant.target > props.target) {
      lerpValsConstant.current -= lerpValsConstant.target;
      lerpValsConstant.target = 0;
    }

    x.value = lerpValsConstant.current * directionConstant;
  },
  { immediate: false },
);

tryOnMounted(() => {
  loopContainer.value?.children[0].children[1]?.classList.add("repeated");
});

watch(windowY, () => {
  lerpVals.value.target += props.speed * 5;
});

watch(isTargetVisible, () => {
  if (isTargetVisible.value) {
    resume();
  } else {
    pause();
  }
});
</script>

<template>
  <div ref="loopContainer">
    <div :style="{ transform: `translateX(${x}%)` }" class="loop-container">
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
