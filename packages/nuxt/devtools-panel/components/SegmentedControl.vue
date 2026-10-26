<script setup lang="ts" generic="T extends string | number">
defineProps<{ modelValue: T; options: { value: T; label: string }[]; label: string }>();
defineEmits<{ "update:modelValue": [value: T] }>();
</script>

<template>
  <div class="segmented" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="option.value === modelValue"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented {
  display: inline-flex;
  padding: 2px;
  gap: 2px;
  border-radius: 7px;
  background: var(--rail);
}

button {
  height: 20px;
  padding: 0 7px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: transform 120ms var(--ease-out);
}

button[aria-pressed="true"] {
  background: var(--bg);
  color: var(--fg);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.15);
}

button:active {
  transform: scale(0.96);
}

button:focus-visible {
  outline: 2px solid var(--accent);
}

@media (hover: hover) and (pointer: fine) {
  button:not([aria-pressed="true"]):hover {
    color: var(--fg);
  }
}
</style>
