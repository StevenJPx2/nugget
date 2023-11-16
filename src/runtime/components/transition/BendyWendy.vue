<script lang="ts" setup>
import { ref, toRefs, useBendyWendyTransition, watch } from "#imports";

const props = defineProps<{ run: boolean }>();
const emit = defineEmits<{ complete: [] }>();
const { run } = toRefs(props);

const svgRef = ref<SVGElement | null>(null);
const pathRef = ref<SVGPathElement | null | undefined>(null);

watch(svgRef, (val) => (pathRef.value = val?.querySelector("path")));

const { play, stop, isAnimating } = useBendyWendyTransition({
  svg: svgRef,
  path: pathRef,
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
