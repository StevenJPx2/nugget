<script setup lang="ts">
import { computed } from "vue";
import { type IconName, icons } from "../icons";

const props = defineProps<{ icon: IconName; label: string; primary?: boolean }>();

const shape = computed(() => icons[props.icon] as { fill?: string; stroke?: string });
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :class="{ primary, 'with-text': $slots.default }"
    :aria-label="$slots.default ? undefined : label"
    :title="label"
  >
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path v-if="shape.fill" :d="shape.fill" fill="currentColor" />
      <path
        v-else
        :d="shape.stroke"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <slot />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--fg);
  cursor: pointer;
  transition:
    background-color 120ms ease,
    transform 120ms var(--ease-out);
}

.icon-button.with-text {
  width: auto;
  padding: 0 10px 0 8px;
  border-color: var(--line);
}

.icon-button.primary {
  background: var(--accent);
  color: var(--on-accent);
}

.icon-button:active {
  transform: scale(0.94);
}

.icon-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.icon-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

@media (hover: hover) and (pointer: fine) {
  .icon-button:hover {
    background: var(--hover);
  }

  .icon-button.primary:hover {
    background: color-mix(in srgb, var(--accent) 85%, var(--fg));
  }
}

svg {
  width: 14px;
  height: 14px;
  flex: none;
}
</style>
