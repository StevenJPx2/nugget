<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import {
  BEZIER_PRESETS,
  type Bezier,
  type Direction,
  defaults,
  type EaseModel,
  easeFunction,
  FAMILIES,
  type Family,
  format,
  parse,
  sample,
  UNDIRECTED,
  withDirection,
} from "../ease";
import EaseCurve from "./EaseCurve.vue";
import IconButton from "./IconButton.vue";
import SegmentedControl from "./SegmentedControl.vue";
import SliderField from "./SliderField.vue";

const props = defineProps<{ modelValue: string; duration: number }>();
const emit = defineEmits<{ commit: [ease: string] }>();

const draft = ref<EaseModel | null>(parse(props.modelValue));
const textError = ref<string>();
watch(
  () => props.modelValue,
  (ease) => {
    draft.value = parse(ease);
    textError.value = undefined;
  },
);

const current = computed(() => (draft.value ? format(draft.value) : props.modelValue));
const samples = computed(() => sample(current.value));
const base = computed(() => draft.value ?? defaults());

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "in", label: "In" },
  { value: "out", label: "Out" },
  { value: "inOut", label: "In-out" },
];

const gallery = computed(() =>
  FAMILIES.map(({ family, label }) => ({
    family,
    label,
    samples: sample(format({ ...base.value, family }), 25),
    selected: draft.value?.family === family,
  })),
);

const dot = ref<number | null>(null);
let frame = 0;

function preview() {
  cancelAnimationFrame(frame);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const length = Math.min(Math.max(props.duration, 0.4), 2) * 1000;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min((now - start) / length, 1);
    dot.value = t;
    if (t < 1) frame = requestAnimationFrame(tick);
    else setTimeout(() => (dot.value = null), 300);
  };
  frame = requestAnimationFrame(tick);
}
onBeforeUnmount(() => cancelAnimationFrame(frame));

function commit(model: EaseModel | null = draft.value) {
  if (!model) return;
  draft.value = model;
  emit("commit", format(model));
  preview();
}

const pickFamily = (family: Family) => commit({ ...base.value, family });
const pickDirection = (direction: Direction) => commit(withDirection(base.value, direction));

type Knob = "power" | "overshoot" | "amplitude" | "period" | "steps";
const KNOBS: Partial<Record<Family, { key: Knob; label: string; min: number; max: number; step: number }[]>> = {
  power: [{ key: "power", label: "Strength", min: 1, max: 4, step: 1 }],
  back: [{ key: "overshoot", label: "Overshoot", min: 0, max: 4, step: 0.05 }],
  elastic: [
    { key: "amplitude", label: "Amplitude", min: 1, max: 3, step: 0.05 },
    { key: "period", label: "Period", min: 0.1, max: 1, step: 0.01 },
  ],
  steps: [{ key: "steps", label: "Steps", min: 1, max: 24, step: 1 }],
};
const knobs = computed(() => (draft.value ? (KNOBS[draft.value.family] ?? []) : []));

const setKnob = (key: Knob, value: number) => {
  if (draft.value) draft.value = { ...draft.value, [key]: value };
};
const setHandles = (bezier: Bezier) => {
  if (draft.value) draft.value = { ...draft.value, bezier };
};

function typed(event: Event) {
  const text = (event.target as HTMLInputElement).value.trim();
  if (!easeFunction(text)) {
    textError.value = `GSAP doesn't know the ease "${text}"`;
    return;
  }
  textError.value = undefined;
  const model = parse(text);
  // Eases the editor can't take apart, like rough(), still go through as text
  if (model) commit(model);
  else {
    draft.value = null;
    emit("commit", text);
    preview();
  }
}
</script>

<template>
  <div class="ease-editor">
    <EaseCurve
      :samples="samples"
      :handles="draft?.family === 'custom' ? draft.bezier : undefined"
      :dot="dot"
      @update:handles="setHandles"
      @commit="commit()"
    />

    <div class="row">
      <SegmentedControl
        v-if="draft && !UNDIRECTED.has(draft.family)"
        :model-value="draft.direction"
        :options="DIRECTIONS"
        label="Direction"
        @update:model-value="pickDirection"
      />
      <div v-else-if="draft?.family === 'custom'" class="chips" role="group" aria-label="Curve presets">
        <button
          v-for="preset in BEZIER_PRESETS"
          :key="preset.label"
          type="button"
          @click="commit({ ...base, bezier: preset.bezier })"
        >
          {{ preset.label }}
        </button>
      </div>
      <span class="spacer" />
      <IconButton icon="play" label="Preview the curve" @click="preview" />
    </div>

    <div class="gallery" role="radiogroup" aria-label="Ease">
      <button
        v-for="item in gallery"
        :key="item.family"
        type="button"
        role="radio"
        :aria-checked="item.selected"
        :class="{ selected: item.selected }"
        @click="pickFamily(item.family)"
      >
        <EaseCurve :samples="item.samples" mini />
        <span>{{ item.label }}</span>
      </button>
    </div>

    <div v-if="knobs.length" class="knobs">
      <SliderField
        v-for="knob in knobs"
        :key="knob.key"
        :label="knob.label"
        :model-value="draft![knob.key]"
        :min="knob.min"
        :max="knob.max"
        :step="knob.step"
        @update:model-value="setKnob(knob.key, $event)"
        @commit="commit()"
      />
    </div>

    <input
      class="text"
      :value="current"
      :placeholder="modelValue ? '' : 'custom function'"
      spellcheck="false"
      aria-label="Ease as GSAP code"
      @change="typed"
    >
    <p v-if="!draft && modelValue" class="hint">This ease has no settings here. Pick one above or edit the code.</p>
    <p v-if="draft?.family === 'custom'" class="hint">
      Custom curves use GSAP's CustomEase. The devtools register it during development; keep one in your app by registering it too.
    </p>
    <p v-if="textError" class="error" role="alert">{{ textError }}</p>
  </div>
</template>

<style scoped>
.ease-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
}

.spacer {
  flex: 1;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chips button {
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: transparent;
  color: var(--fg);
  font: inherit;
  cursor: pointer;
  transition: transform 120ms var(--ease-out);
}

.chips button:active {
  transform: scale(0.96);
}

.gallery {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}

.gallery button {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  padding: 4px 4px 3px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 10px;
  cursor: pointer;
  transition: transform 120ms var(--ease-out);
}

.gallery button:active {
  transform: scale(0.96);
}

.gallery button.selected {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--fg);
}

.gallery button:focus-visible,
.chips button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

@media (hover: hover) and (pointer: fine) {
  .gallery button:not(.selected):hover,
  .chips button:hover {
    background: var(--hover);
    color: var(--fg);
  }
}

.knobs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.text {
  width: 100%;
  box-sizing: border-box;
  height: 24px;
  padding: 0 6px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--field);
  color: var(--fg);
  font: inherit;
  font-family: var(--mono);
}

.text:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -1px;
  border-color: transparent;
}

.hint {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

.error {
  margin: 0;
  color: var(--error);
}
</style>
