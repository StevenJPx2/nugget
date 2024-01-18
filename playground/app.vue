<script setup lang="ts">
import { vSplitAnimate, vAos } from "../src/functions/directives";
import { ref, useBakedTransition } from "#imports";
import { promiseTimeout } from "@vueuse/core";

const stingEffectContainer = ref<HTMLDivElement | null>(null);

const { play, stop } = useBakedTransition({
  parentContainer: stingEffectContainer,
  animationOptions: {
    translate: true,
    scale: "in",
    skew: "bottom",
  },
});

const runTransition = ref(false);
const direction = ref<"left" | "right">("left");
const onAfterEnter = async () => {
  runTransition.value = false;
  await promiseTimeout(500);
  runTransition.value = true;
};
</script>
<template>
  <locomotive>
    <button
      class="bg-yellow-500 rounded-md grid place-content-center relative px-8 py-5 overflow-hidden"
      @mouseover="
        stop();
        play();
      "
      @mouseout="
        stop();
        play();
      "
    >
      <div
        ref="stingEffectContainer"
        class="rounded-lg bg-red-500 pointer-events-none absolute inset-0 border-4 border-yellow-500"
      />
      <span class="inline-block text-white z-[1] pointer-events-none">
        hover over me!
      </span>
    </button>
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
      <transitions-offset
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
      v-aos="{
        baked: true,
        options: {
          scrollAnimationOptions: { start: 'top 60%' },
          animationOptions: {
            opacity: true,
            translate: true,
            blur: true,
          },
        },
      }"
      class="bg-blue-500 size-10 mx-auto opacity-0"
    />
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
          baked: true,
          options: {
            splitBy: 'lines',
            animationOptions: { translate: true },
            splitOptions: {
              wrapping: {
                select: 'lines',
                wrapClass: 'inline-block overflow-hidden',
              },
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
      <infinite-marquee
        gap="2rem"
        :pause-on-hover="true"
        :speed="0.07"
        :acceleration="0"
      >
        <div :style="{ display: 'inline-flex', gap: '2rem' }">
          <p v-for="i in 20" :key="i">Nuxt module playground!</p>
        </div>
      </infinite-marquee>
    </div>
  </locomotive>
</template>

<style>
button {
  @apply bg-yellow-500 grid place-content-center relative px-8 py-5 overflow-hidden;
  @apply m-5 shadow-md;
}
</style>
