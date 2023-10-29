<script setup lang="ts">
import InfiniteMarquee from "../src/runtime/components/InfiniteMarquee.vue";
import { vSplitAnimate } from "../src/runtime/directives";
</script>
<template>
  <smooth-scroll>
    <div
      :style="{
        height: '70vh',
      }"
    />
    <div
      :style="{
        height: '100vh',
        display: 'grid',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }"
    >
      <h1
        v-split-animate="{
          splitBy: 'lines',
          animationOptions: { translate: true, rotate: true },
          wrapping: {
            select: 'lines',
            wrapClass: 'inline-block overflow-hidden',
          },
        }"
        :style="{
          fontSize: '25vw',
          textAlign: 'left',
          lineHeight: 0.9,
          overflow: 'hidden',
        }"
      >
        Nuxt is so cool
      </h1>
    </div>
    <div
      :style="{
        height: '200vh',
        display: 'grid',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }"
    >
      <infinite-marquee gap="2rem">
        <div :style="{ display: 'inline-flex', gap: '2rem' }">
          <p v-for="_ in 20">Nuxt module playground!</p>
        </div>
      </infinite-marquee>
    </div>
  </smooth-scroll>
</template>

<style>
.inline-block {
  display: inline-block;
}

.block {
  display: block;
}

.overflow-hidden {
  overflow: hidden;
}

.h-fit {
  height: fit-content;
}
</style>
