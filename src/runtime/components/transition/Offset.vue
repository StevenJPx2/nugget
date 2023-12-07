<script setup lang="ts">
import { ref, toRefs, useOffsetTransition, watch } from "#imports";
import type { HTMLAttributes } from "vue";
import type { TransitionEmits } from "./utils";
import { callbackFactory } from "./utils";
import type { Direction } from "../../types";

const parentContainer = ref<HTMLElement | null>(null);
const mainContainer = ref<HTMLElement | null>(null);
const offsetContainer = ref<HTMLElement | null>(null);

const props = defineProps<{
  mainContainerAttributes?: HTMLAttributes;
  offsetContainerAttributes?: HTMLAttributes;
  run: boolean;
  direction?: Direction;
}>();
const emit = defineEmits<TransitionEmits>();
const { run, direction } = toRefs(props);
const { play, stop } = useOffsetTransition({
  parentContainer,
  mainContainer,
  offsetContainer,
  direction,
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
