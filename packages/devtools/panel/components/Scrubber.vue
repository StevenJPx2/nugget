<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";

const props = withDefaults(
  defineProps<{ modelValue: number; label: string; disabled?: boolean; keyStep?: number; valueText?: string }>(),
  { keyStep: 0.01, valueText: undefined },
);
const emit = defineEmits<{
  "update:modelValue": [value: number];
  /** The user let go: pointer released, or 400ms after the last key press */
  commit: [value: number];
}>();

const track = useTemplateRef<HTMLElement>("track");
const dragging = ref(false);
/** The page reports progress every 100ms; hold the user's value meanwhile so the thumb doesn't jump back */
const held = ref<number>();
let release: ReturnType<typeof setTimeout> | undefined;

const shown = computed(() => held.value ?? props.modelValue);
const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

function letGo() {
  if (held.value !== undefined) emit("commit", held.value);
  held.value = undefined;
}

function set(value: number) {
  held.value = clamp(value);
  clearTimeout(release);
  if (!dragging.value) release = setTimeout(letGo, 400);
  emit("update:modelValue", held.value);
}

function valueAt(event: PointerEvent) {
  const rect = track.value!.getBoundingClientRect();
  return (event.clientX - rect.left) / rect.width;
}

function down(event: PointerEvent) {
  if (props.disabled || event.button !== 0) return;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  dragging.value = true;
  set(valueAt(event));
}

function move(event: PointerEvent) {
  if (dragging.value) set(valueAt(event));
}

function up() {
  if (!dragging.value) return;
  dragging.value = false;
  if (held.value !== undefined) emit("commit", held.value);
  release = setTimeout(() => (held.value = undefined), 400);
}

const STEPS: Record<string, (value: number, step: number) => number> = {
  ArrowRight: (v, s) => v + s,
  ArrowUp: (v, s) => v + s,
  ArrowLeft: (v, s) => v - s,
  ArrowDown: (v, s) => v - s,
  Home: () => 0,
  End: () => 1,
};

function key(event: KeyboardEvent) {
  const step = STEPS[event.key];
  if (!step || props.disabled) return;
  event.preventDefault();
  set(step(shown.value, props.keyStep * (event.shiftKey ? 10 : 1)));
}
</script>

<template>
  <div
    class="scrubber"
    :class="{ dragging, disabled }"
    role="slider"
    :tabindex="disabled ? -1 : 0"
    :aria-label="label"
    :title="disabled ? `${label} (driven by scroll)` : label"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(shown * 100)"
    :aria-valuetext="valueText ?? `${Math.round(shown * 100)}%`"
    :aria-disabled="disabled"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
    @keydown="key"
  >
    <div ref="track" class="rail">
      <div class="fill" :style="{ transform: `scaleX(${shown})` }" />
      <div class="thumb" :style="{ left: `${shown * 100}%` }" />
    </div>
  </div>
</template>

<style scoped>
.scrubber {
  flex: 1;
  min-width: 48px;
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;
  touch-action: none;
  border-radius: 4px;
}

.scrubber.disabled {
  cursor: default;
  opacity: 0.5;
}

.scrubber:focus-visible {
  outline: 2px solid var(--accent);
}

.rail {
  position: relative;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--rail);
}

.fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--status, var(--accent));
  transform-origin: left;
}

.thumb {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  border-radius: 50%;
  background: var(--thumb);
  box-shadow:
    0 0 0 1px var(--status, var(--accent)),
    0 1px 2px rgb(0 0 0 / 0.25);
  transform: scale(0.8);
  transition: transform 120ms var(--ease-out);
}

.scrubber:focus-visible .thumb,
.dragging .thumb {
  transform: scale(1.2);
}

@media (hover: hover) and (pointer: fine) {
  .scrubber:not(.disabled):hover .thumb {
    transform: scale(1);
  }

  .scrubber.dragging .thumb {
    transform: scale(1.2);
  }
}
</style>
