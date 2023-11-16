<script setup lang="ts">
import InfiniteMarquee from "../src/runtime/components/InfiniteMarquee.vue";
import TransitionBendyWendy from "../src/runtime/components/transition/BendyWendy.vue";
import { vSplitAnimate } from "../src/runtime/directives";
import { ref } from "#imports";

const runBendyWendy = ref(false);
</script>
<template>
  <smooth-scroll>
    <div :style="{ position: 'relative', width: '100%', height: '400px' }">
      <button @mouseover="runBendyWendy = true">
        {{ runBendyWendy ? "Stop" : "Run" }} Bendy Wendy
      </button>
      <transition-bendy-wendy
        :run="runBendyWendy"
        @complete="runBendyWendy = false"
      />
    </div>
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
          animationOptions: { translate: 'left' },
          splitOptions: {
            wrapping: {
              select: 'lines',
              wrapClass: 'inline-block overflow-hidden',
            },
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
          <p v-for="i in 20" :key="i">Nuxt module playground!</p>
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
