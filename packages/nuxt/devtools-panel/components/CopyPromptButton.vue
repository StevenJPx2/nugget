<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import IconButton from "./IconButton.vue";

const props = defineProps<{
  /** Copies the prompt; resolves false when there was nothing to copy */
  copy: () => Promise<boolean>;
  count: number;
}>();

const status = ref<"idle" | "copied" | "empty" | "failed">("idle");
let reset: ReturnType<typeof setTimeout> | undefined;

async function run() {
  try {
    status.value = (await props.copy()) ? "copied" : "empty";
  } catch {
    status.value = "failed";
  }
  clearTimeout(reset);
  reset = setTimeout(() => (status.value = "idle"), 1600);
}
onBeforeUnmount(() => clearTimeout(reset));

const TEXT = { copied: "Copied", empty: "Nothing changed", failed: "Couldn't copy" };
</script>

<template>
  <IconButton
    :icon="status === 'copied' ? 'check' : 'copy'"
    :label="`Copy a prompt for your coding agent that applies ${count === 1 ? 'this edit' : `these ${count} edits`} in code`"
    primary
    @click="run"
  >
    <span aria-live="polite">{{ status === "idle" ? `Copy prompt${count > 1 ? ` · ${count}` : ""}` : TEXT[status] }}</span>
  </IconButton>
</template>
