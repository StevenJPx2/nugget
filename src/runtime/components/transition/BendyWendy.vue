<script lang="ts" setup>
import { ref, toRefs, useBendyWendyTransition, watch } from "#imports";
import type { TransitionProps, TransitionEmits } from "./utils";
import { callbackFactory } from "./utils";

const props = withDefaults(defineProps<TransitionProps>(), {
  direction: "top",
});
const emit = defineEmits<TransitionEmits>();
const { run, direction } = toRefs(props);

const svgRef = ref<SVGElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);

const { play, stop } = useBendyWendyTransition({
  svg: svgRef,
  path: pathRef,
  direction: direction,
  ...callbackFactory(emit),
});

watch(run, (value) => {
  if (value) {
    play();
  } else if (!value) {
    stop();
  }
});
</script>

<template>
  <svg ref="svgRef">
    <path ref="pathRef" />
  </svg>
</template>
