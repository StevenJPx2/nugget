<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ samples: number[] }>();

const WIDTH = 100;
const HEIGHT = 56;

/** Eases like back and elastic overshoot, so the frame stretches to fit them */
const shape = computed(() => {
  const { samples } = props;
  const low = Math.min(0, ...samples);
  const high = Math.max(1, ...samples);
  const y = (value: number) => HEIGHT - ((value - low) / (high - low)) * HEIGHT;
  const x = (i: number) => (i / Math.max(samples.length - 1, 1)) * WIDTH;
  return {
    path: samples.map((value, i) => `${i ? "L" : "M"}${x(i).toFixed(2)} ${y(value).toFixed(2)}`).join(""),
    zero: y(0),
    one: y(1),
  };
});
</script>

<template>
  <svg class="curve" :viewBox="`-2 -4 ${WIDTH + 4} ${HEIGHT + 8}`" preserveAspectRatio="none" aria-hidden="true">
    <line x1="0" :y1="shape.zero" :x2="WIDTH" :y2="shape.zero" class="guide" />
    <line x1="0" :y1="shape.one" :x2="WIDTH" :y2="shape.one" class="guide" />
    <path :d="shape.path" class="line" />
  </svg>
</template>

<style scoped>
.curve {
  display: block;
  width: 100%;
  height: 64px;
  border-radius: 6px;
  background: var(--rail);
}

.guide {
  stroke: var(--line);
  stroke-dasharray: 2 2;
  vector-effect: non-scaling-stroke;
}

.line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
</style>
