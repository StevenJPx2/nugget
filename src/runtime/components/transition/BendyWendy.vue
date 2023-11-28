<script lang="ts" setup>
import { ref, toRefs, useBendyWendyTransition, watch } from "#imports";
import type { Direction } from "../../types";

const props = withDefaults(
  defineProps<{ run: boolean; direction: Direction }>(),
  { direction: "top" },
);
const emit = defineEmits<{ complete: [] }>();
const { run, direction } = toRefs(props);

const svgRef = ref<SVGElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);

const { play, stop, isAnimating } = useBendyWendyTransition({
  svg: svgRef,
  path: pathRef,
  direction: direction,
  onAfterEnter: () => {
    emit("complete");
  },
  onAfterLeave: () => {
    emit("complete");
  },
});

watch(run, (value) => {
  if (value && !isAnimating()) {
    play();
  } else if (!value && isAnimating()) {
    stop();
  }
});
</script>

<template>
  <svg ref="svgRef">
    <path ref="pathRef" />
  </svg>
</template>
