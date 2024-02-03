<script lang="ts" setup>
import { ref, watch } from "#imports";
import { useLocomotive } from ".";
import type { ILocomotiveScrollOptions } from "locomotive-scroll/dist/types/types";

const props = defineProps<{
  /** The options to pass to LocomotiveScroll
   * @default {}
   */
  options?: ILocomotiveScrollOptions;
}>();
const wrapperRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();

watch(
  () => [wrapperRef.value, contentRef.value] as const,
  ([wrapper, content]) => {
    if (!wrapper || !content) return;

    useLocomotive({
      ...props.options,
      lenisOptions: {
        wrapper,
        content,
        ...props.options?.lenisOptions,
      },
    });
  },
  { flush: "post", immediate: true },
);
</script>

<template>
  <div ref="wrapperRef">
    <div ref="contentRef">
      <slot />
    </div>
  </div>
</template>

<style>
html.lenis {
  height: auto;
}

.lenis {
  overflow: hidden;
  position: relative;
  max-height: 100vh;
}

.lenis > * {
  overflow-y: scroll;
  overflow-x: hidden;
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
