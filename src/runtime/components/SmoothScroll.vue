<script lang="ts" setup>
import { ref } from "#imports";
import { useLocomotive } from "../composables";

const slotRef = ref<HTMLElement>();

useLocomotive({ lenisOptions: { content: slotRef.value } });
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
