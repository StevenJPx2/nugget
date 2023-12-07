<script setup lang="ts">
import { vSplitAnimate } from "../src/runtime/directives";
import { ref } from "#imports";
import { promiseTimeout } from "@vueuse/core";

const runTransition = ref(false);
const direction = ref<"left" | "right">("left");
const onAfterEnter = async () => {
  runTransition.value = false;
  await promiseTimeout(500);
  runTransition.value = true;
};
</script>
<template>
  <smooth-scroll>
    <div :style="{ position: 'relative', width: '400px', height: '400px' }">
      <div
        :style="{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'space-between',
          margin: 'auto',
          zIndex: 1,
        }"
      >
        <button
          @mouseover="
            direction = 'right';
            runTransition = true;
          "
        >
          &lt;
        </button>

        <button
          @mouseover="
            direction = 'left';
            runTransition = true;
          "
        >
          &gt;
        </button>
      </div>
      <transition-offset
        class="red h-full w-full"
        :run="runTransition"
        :direction="direction"
        :main-container-attributes="{ style: { background: 'red' } }"
        :offset-container-attributes="{ style: { background: 'blue' } }"
        @after-leave="runTransition = false"
        @after-enter="onAfterEnter"
      />
    </div>
    <div
      :style="{
        height: '200vh',
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
          <p
            v-for="i in 20"
            :key="i"
          >
            Nuxt module playground!
          </p>
        </div>
      </infinite-marquee>
    </div>
  </smooth-scroll>
</template>

<style>
.h-full {
  height: 100%;
}

.w-full {
  width: 100%;
}

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
