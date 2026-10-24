<script setup lang="ts">
import {
  ref,
  useBakedTransition,
  useGsap,
  vAos,
  vTextAnimateBaked,
} from "#imports";

const hi = ref<HTMLElement>();
const { set } = useGsap();
set(hi, { x: 100 });

const stingEffectContainer = ref<HTMLDivElement | null>(null);

const { play, stop } = useBakedTransition({
  parentContainer: stingEffectContainer,
  animationOptions: ["translate", "skew:bottom", "scale:in", "rotate"],
});

const runTransition = ref(false);
const direction = ref<"left" | "right">("left");
const onAfterEnter = async () => {
  runTransition.value = false;
};

const runBendyTransition = ref(false);
const onAfterEnterBendy = async () => {
  runBendyTransition.value = false;
};
</script>

<template>
  <smooth-scroll :options="{ smooth: 1, effects: true }">
    <div ref="hi">hello</div>
    <button
      class="sting-button"
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
        class="sting-effect"
      />
      <span class="sting-label">
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
      <offset-transition
        class="red fill"
        :run="runTransition"
        :direction="direction"
        :main-container-attributes="{ style: { background: 'red' } }"
        :offset-container-attributes="{ style: { background: 'blue' } }"
        @after-leave="runTransition = false"
        @after-enter="onAfterEnter"
      />
    </div>
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
        <button @mouseover="runBendyTransition = true">v</button>
      </div>
      <bendy-wendy-transition
        class="red fill"
        :run="runBendyTransition"
        @after-leave="runBendyTransition = false"
        @after-enter="onAfterEnterBendy"
      />
    </div>

    <div
      v-aos="{
        baked: true,
        options: {
          scrollAnimationOptions: { start: 'top 60%' },
          tweenValues: { duration: 0.3 },
          animationOptions: ['opacity', 'translate', 'blur'],
        },
      }"
      class="aos-box"
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
        v-text-animate-baked="{
          animationOptions: ['translate', 'rotate'],
          splitOptions: { mask: 'lines' },
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
      <infinite-marquee gap="2rem" :pause-on-hover="true" :speed="0.07">
        <div :style="{ display: 'inline-flex', gap: '2rem' }">
          <p v-for="i in 20" :key="i">Nuxt module playground!</p>
        </div>
      </infinite-marquee>
    </div>
  </smooth-scroll>
</template>

<style>
button {
  display: grid;
  place-content: center;
  position: relative;
  overflow: hidden;
  margin: 1.25rem;
  padding: 1.25rem 2rem;
  background: #eab308;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.sting-button {
  border-radius: 0.375rem;
}

.sting-effect {
  position: absolute;
  inset: 0;
  border: 4px solid #eab308;
  border-radius: 0.5rem;
  background: #ef4444;
  pointer-events: none;
}

.sting-label {
  display: inline-block;
  z-index: 1;
  color: white;
  pointer-events: none;
}

.fill {
  width: 100%;
  height: 100%;
}

.aos-box {
  width: 2.5rem;
  height: 2.5rem;
  margin-inline: auto;
  background: #3b82f6;
  opacity: 0;
}
</style>
