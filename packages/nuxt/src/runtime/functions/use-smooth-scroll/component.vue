<script lang="ts" setup>
import { provide, ref } from "#imports";
import {
  type UseSmoothScrollOptions,
  smoothScrollKey,
  useSmoothScroll,
} from ".";

const props = defineProps<{
  /** The vars to pass to `ScrollSmoother.create`
   * @default {}
   */
  options?: UseSmoothScrollOptions;
}>();
const wrapperRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();

const smoother = useSmoothScroll(() => ({
  wrapper: wrapperRef.value,
  content: contentRef.value,
  ...props.options,
}));

provide(smoothScrollKey, smoother);
</script>

<template>
  <div ref="wrapperRef">
    <div ref="contentRef">
      <slot />
    </div>
  </div>
</template>
