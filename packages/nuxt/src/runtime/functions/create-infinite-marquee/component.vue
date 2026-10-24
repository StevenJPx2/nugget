<script setup lang="ts">
import { type CreateInfiniteMarqueeOptions, createInfiniteMarquee } from ".";

// Most of this credit goes to:
// https://stackoverflow.com/questions/71165923/how-do-i-make-an-infinite-marquee-with-js#answer-71167758

const props = defineProps<CreateInfiniteMarqueeOptions>();

const Marquee = createInfiniteMarquee(props);
</script>

<template>
  <Marquee>
    <slot />
  </Marquee>
</template>
