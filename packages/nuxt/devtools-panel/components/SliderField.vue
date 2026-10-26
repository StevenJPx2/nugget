<script setup lang="ts">
import { computed } from "vue";
import ProgressScrubber from "./ProgressScrubber.vue";

const props = defineProps<{ label: string; modelValue: number; min: number; max: number; step: number }>();
const emit = defineEmits<{ "update:modelValue": [value: number]; commit: [value: number] }>();

const span = computed(() => props.max - props.min);
const decimals = computed(() => (String(props.step).split(".")[1] ?? "").length);
const snap = (value: number) => Number((Math.round(value / props.step) * props.step).toFixed(decimals.value));
const fromFraction = (fraction: number) => snap(props.min + fraction * span.value);
const fraction = computed(() => Math.min(Math.max((props.modelValue - props.min) / span.value, 0), 1));

function typed(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  if (input.value.trim() === "" || !Number.isFinite(value)) {
    input.value = String(props.modelValue);
    return;
  }
  // Typed values may go past the slider's range, like a back overshoot of 8
  emit("update:modelValue", value);
  emit("commit", value);
}
</script>

<template>
  <div class="slider-field">
    <span class="name">{{ label }}</span>
    <ProgressScrubber
      :model-value="fraction"
      :label="label"
      :key-step="step / span"
      :value-text="String(modelValue)"
      @update:model-value="emit('update:modelValue', fromFraction($event))"
      @commit="emit('commit', fromFraction($event))"
    />
    <input
      type="number"
      :step="step"
      :value="modelValue"
      :aria-label="label"
      @change="typed"
    >
  </div>
</template>

<style scoped>
.slider-field {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 58px;
  align-items: center;
  gap: 6px;
}

.name {
  color: var(--muted);
}

input {
  width: 100%;
  box-sizing: border-box;
  height: 22px;
  padding: 0 4px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--field);
  color: var(--fg);
  font: inherit;
  font-family: var(--mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -1px;
  border-color: transparent;
}
</style>
