<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import type { Bezier } from "../ease";

const props = defineProps<{
  samples: number[];
  /** Bezier control points; shows draggable handles when set */
  handles?: Bezier;
  /** Time (0–1) of the preview dot */
  dot?: number | null;
  mini?: boolean;
}>();
const emit = defineEmits<{ "update:handles": [value: Bezier]; commit: [value: Bezier] }>();

const PAD_X = 0.05;
const PAD_Y = 0.06;
/** Handles move inside a fixed range so the frame doesn't shift under the pointer */
const HANDLE_RANGE = { low: -0.5, high: 1.5 };
const HANDLES = [0, 1] as const;

const frame = computed(() => {
  if (props.handles) return HANDLE_RANGE;
  return { low: Math.min(0, ...props.samples), high: Math.max(1, ...props.samples) };
});

const viewBox = computed(() => {
  const { low, high } = frame.value;
  return `${-PAD_X} ${-high - PAD_Y} ${1 + 2 * PAD_X} ${high - low + 2 * PAD_Y}`;
});

const path = computed(() =>
  props.samples
    .map((value, i) => `${i ? "L" : "M"}${(i / (props.samples.length - 1)).toFixed(4)} ${(-value).toFixed(4)}`)
    .join(""),
);

/** Position of a point in the frame, in percent of the element, for HTML overlays */
const place = (x: number, y: number) => {
  const { low, high } = frame.value;
  return {
    left: `${((x + PAD_X) / (1 + 2 * PAD_X)) * 100}%`,
    top: `${((high + PAD_Y - y) / (high - low + 2 * PAD_Y)) * 100}%`,
  };
};

const valueAt = (t: number) => {
  const { samples } = props;
  const position = t * (samples.length - 1);
  const i = Math.min(Math.floor(position), samples.length - 2);
  return samples[i] + (samples[i + 1] - samples[i]) * (position - i);
};

const box = useTemplateRef<HTMLElement>("box");
const dragging = ref<0 | 1 | null>(null);
let keyCommit: ReturnType<typeof setTimeout> | undefined;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const round = (value: number) => Math.round(value * 1000) / 1000;

function moveHandle(index: 0 | 1, x: number, y: number) {
  const next = [...props.handles!] as Bezier;
  next[index * 2] = round(clamp(x, 0, 1));
  next[index * 2 + 1] = round(clamp(y, HANDLE_RANGE.low, HANDLE_RANGE.high));
  emit("update:handles", next);
  return next;
}

function pointAt(event: PointerEvent) {
  const rect = box.value!.getBoundingClientRect();
  const { low, high } = frame.value;
  return {
    x: ((event.clientX - rect.left) / rect.width) * (1 + 2 * PAD_X) - PAD_X,
    y: high + PAD_Y - ((event.clientY - rect.top) / rect.height) * (high - low + 2 * PAD_Y),
  };
}

function down(index: 0 | 1, event: PointerEvent) {
  if (event.button !== 0) return;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  dragging.value = index;
}

function move(index: 0 | 1, event: PointerEvent) {
  if (dragging.value !== index) return;
  const { x, y } = pointAt(event);
  moveHandle(index, x, y);
}

function up(index: 0 | 1) {
  if (dragging.value !== index) return;
  dragging.value = null;
  emit("commit", props.handles!);
}

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
};

function key(index: 0 | 1, event: KeyboardEvent) {
  const arrow = ARROWS[event.key];
  if (!arrow) return;
  event.preventDefault();
  const step = event.shiftKey ? 0.1 : 0.01;
  const next = moveHandle(
    index,
    props.handles![index * 2] + arrow[0] * step,
    props.handles![index * 2 + 1] + arrow[1] * step,
  );
  clearTimeout(keyCommit);
  keyCommit = setTimeout(() => emit("commit", next), 400);
}
</script>

<template>
  <div ref="box" class="curve" :class="{ mini, editing: handles }">
    <svg :viewBox="viewBox" preserveAspectRatio="none" aria-hidden="true">
      <template v-if="!mini">
        <line x1="0" y1="0" x2="1" y2="0" class="guide" />
        <line x1="0" y1="-1" x2="1" y2="-1" class="guide" />
      </template>
      <template v-if="handles">
        <line x1="0" y1="0" :x2="handles[0]" :y2="-handles[1]" class="arm" />
        <line x1="1" y1="-1" :x2="handles[2]" :y2="-handles[3]" class="arm" />
      </template>
      <path :d="path" class="line" />
    </svg>
    <template v-if="handles">
      <button
        v-for="index in HANDLES"
        :key="index"
        type="button"
        class="handle"
        :class="{ active: dragging === index }"
        :style="place(handles[index * 2], handles[index * 2 + 1])"
        :aria-label="`Control point ${index + 1}: ${handles[index * 2]}, ${handles[index * 2 + 1]}. Arrow keys move it`"
        @pointerdown="down(index, $event)"
        @pointermove="move(index, $event)"
        @pointerup="up(index)"
        @pointercancel="up(index)"
        @keydown="key(index, $event)"
      />
    </template>
    <span v-if="dot != null && samples.length" class="dot" :style="place(dot, valueAt(dot))" />
  </div>
</template>

<style scoped>
.curve {
  position: relative;
  height: 96px;
  border-radius: 6px;
  background: var(--rail);
}

.curve.editing {
  height: 168px;
}

.curve.mini {
  height: 28px;
  border-radius: 4px;
  background: transparent;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.guide {
  stroke: var(--line);
  stroke-dasharray: 2 2;
  vector-effect: non-scaling-stroke;
}

.arm {
  stroke: var(--muted);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.mini .line {
  stroke: currentColor;
}

.handle {
  position: absolute;
  width: 12px;
  height: 12px;
  margin: -6px 0 0 -6px;
  padding: 0;
  border: 2px solid var(--accent);
  border-radius: 50%;
  background: var(--thumb);
  cursor: grab;
  touch-action: none;
  transition: transform 120ms var(--ease-out);
}

.handle.active {
  cursor: grabbing;
  transform: scale(1.25);
}

.handle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (hover: hover) and (pointer: fine) {
  .handle:hover {
    transform: scale(1.15);
  }

  .handle.active {
    transform: scale(1.25);
  }
}

.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent);
  pointer-events: none;
}
</style>
