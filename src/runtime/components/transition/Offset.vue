<script setup lang="ts">
import { ref, toRefs, useOffsetTransition, watch } from "#imports";
import type { HTMLAttributes } from "vue";

const parentContainer = ref<HTMLElement | null>(null);
const mainContainer = ref<HTMLElement | null>(null);
const offsetContainer = ref<HTMLElement | null>(null);

const props = defineProps<{
  run: boolean;
  mainContainerAttributes?: HTMLAttributes;
  offsetContainerAttributes?: HTMLAttributes;
}>();
const emit = defineEmits<{ complete: [] }>();
const { run } = toRefs(props);
const { play, stop, isAnimating } = useOffsetTransition({
  parentContainer,
  mainContainer,
  offsetContainer,
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
  <div ref="parentContainer">
    <div
      ref="mainContainer"
      v-bind="props.mainContainerAttributes"
    />
    <div
      ref="offsetContainer"
      v-bind="props.offsetContainerAttributes"
    />
  </div>
</template>
