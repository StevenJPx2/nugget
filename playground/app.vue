<template>
  <infinite-marquee gap="2rem">
    <div :style="{ display: 'inline-flex', gap: '2rem' }">
      <div v-for="_ in 20">Nuxt module playground!</div>
    </div>
  </infinite-marquee>
</template>

<script setup lang="ts">
import InfiniteMarquee from "../src/runtime/components/InfiniteMarquee.vue";
</script>
