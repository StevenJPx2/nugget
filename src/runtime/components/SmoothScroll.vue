<script lang="ts" setup>
import { ref } from "#imports";
import { useLocomotive } from "../composables";
import type { ILocomotiveScrollOptions } from "locomotive-scroll/dist/types/types";

const props = defineProps<{
  /** The options to pass to LocomotiveScroll
   * @default {}
   */
  options?: ILocomotiveScrollOptions;
}>();
const slotRef = ref<HTMLElement>();

useLocomotive({
  ...props.options,
  lenisOptions: { content: slotRef.value, ...props.options?.lenisOptions },
});
</script>

<template>
  <div>
    <slot ref="slotRef" />
  </div>
</template>

<style>
html.lenis {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
</style>
