<template>
  <div :style="{ height: '100vh', display: 'grid', alignItems: 'center' }">
    <h1
      v-split-animate="{
        splitBy: 'words',
        options: {
          blur: true,
          translate: 'top',
          rotate: true,
          opacity: true,
          skew: true,
        },
        ease: 'power4.inOut',
        duration: 1.5,
      }"
      :style="{ fontSize: '30vw' }"
    >
      Nuxt is so cool
    </h1>
  </div>
  <div :style="{ height: '200vh', display: 'grid', alignItems: 'center' }">
    <infinite-marquee gap="2rem" :speed="0.1">
      <div :style="{ display: 'inline-flex', gap: '2rem' }">
        <p v-for="_ in 20">Nuxt module playground!</p>
      </div>
    </infinite-marquee>
  </div>
</template>

<script setup lang="ts">
import InfiniteMarquee from "../src/runtime/components/InfiniteMarquee.vue";
import { vSplitAnimate } from "../src/runtime/directives";
</script>
