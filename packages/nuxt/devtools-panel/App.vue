<script setup lang="ts">
import { connectPanelChannel } from "devframe/in-page-channel";
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import {
  type AnimationDetail,
  type AnimationEdit,
  type AnimationRow,
  type ControlAction,
  NUGGET_CHANNEL,
  type NuggetChannelProtocol,
  type NuggetState,
} from "../src/runtime/devtools/protocol";
import { buildPrompt, copyText } from "./prompt";
import CopyPromptButton from "./components/CopyPromptButton.vue";
import IconButton from "./components/IconButton.vue";
import AnimationInspector from "./components/AnimationInspector.vue";
import ProgressScrubber from "./components/ProgressScrubber.vue";
import SegmentedControl from "./components/SegmentedControl.vue";

const channel = connectPanelChannel<NuggetChannelProtocol>({
  name: NUGGET_CHANNEL,
  functions: {},
});

const state = shallowRef<NuggetState>();
const missing = ref(false);
const showNested = ref(true);
const windowSeconds = ref(0);

channel.whenConnected(4000).catch(() => {
  missing.value = true;
});
void channel.sharedState.get("nugget").then((shared) => {
  missing.value = false;
  state.value = shared.value() as NuggetState;
  shared.on("updated", (value) => {
    state.value = value as NuggetState;
  });
});

const SPEEDS = [0.1, 0.25, 0.5, 1, 2].map((value) => ({ value, label: `${value}×` }));
const WINDOWS = [
  { value: 0, label: "All" },
  { value: 10, label: "10s" },
  { value: 30, label: "30s" },
];
/** Infinite repeats would stretch the axis forever, so their bars stop here */
const MAX_BAR_SECONDS = 600;

const end = (row: AnimationRow) => row.start + Math.min(row.duration, MAX_BAR_SECONDS);

const rows = computed(() =>
  (state.value?.rows ?? []).filter((row) => showNested.value || !row.parentId),
);

const axis = computed(() => {
  const now = state.value?.now ?? 0;
  const visible = rows.value;
  const last = Math.max(now, ...visible.map(end));
  const first = windowSeconds.value
    ? last - windowSeconds.value
    : Math.min(now, ...visible.map((row) => row.start));
  return { first, span: Math.max(last - first, 0.001), now };
});

const pct = (time: number) =>
  Math.min(Math.max(((time - axis.value.first) / axis.value.span) * 100, 0), 100);

const ticks = computed(() => {
  const { first, span } = axis.value;
  const step = [0.5, 1, 2, 5, 10, 30, 60, 120].find((s) => span / s <= 10) ?? 300;
  const out: number[] = [];
  for (let t = Math.ceil(first / step) * step; t <= first + span; t += step) out.push(t);
  return out;
});

const status = (row: AnimationRow) =>
  row.active ? "running" : row.paused ? "paused" : row.progress >= 1 ? "done" : "waiting";

const control = (id: string, action: ControlAction) => channel.call("control", id, action);
const seek = (id: string, progress: number) => channel.call("seek", id, progress);
const setGlobal = (options: { paused?: boolean; speed?: number }) =>
  channel.call("setGlobal", options);

const selectedId = ref<string | null>(null);
const pickedIds = ref<string[]>([]);
const pickedTarget = ref("");
const detail = shallowRef<AnimationDetail | null>(null);
const editError = ref<string>();

const highlight = (id: string | null) => channel.emit("highlight", id ?? selectedId.value);

const selectedRow = computed(() =>
  state.value?.rows.find((row) => row.id === selectedId.value),
);

const select = (id: string) => {
  selectedId.value = selectedId.value === id ? null : id;
};

watch(() => state.value?.picker.sequence, async (sequence) => {
  if (!sequence) return;
  const picker = state.value!.picker;
  pickedIds.value = picker.ids;
  pickedTarget.value = picker.target;
  showNested.value = true;
  selectedId.value = picker.ids[0] ?? null;
  await revealPickedRow();
});

async function revealPickedRow() {
  await nextTick();
  const element = [...document.querySelectorAll<HTMLElement>("[data-animation-id]")]
    .find((row) => row.dataset.animationId === selectedId.value);
  element?.scrollIntoView({ block: "nearest" });
  element?.focus({ preventScroll: true });
}

const setPicker = (active: boolean) => channel.call("setPicker", active);

watch(selectedId, async (id) => {
  editError.value = undefined;
  if (!id) {
    detail.value = null;
    channel.emit("highlight", null);
    return;
  }
  const next = await channel.call("inspect", id);
  if (selectedId.value === id) detail.value = next;
});

// Other animations can change what the inspected one looks like, such as giving its element a size
let lastRefresh = 0;
watch(state, async () => {
  const id = selectedId.value;
  if (!id || performance.now() - lastRefresh < 1000) return;
  lastRefresh = performance.now();
  const next = await channel.call("inspect", id);
  if (selectedId.value === id && next) detail.value = next;
});

// Clearing finished animations can remove the one being inspected
watch(selectedRow, (row) => {
  if (state.value && selectedId.value && !row) selectedId.value = null;
});

async function run(call: () => Promise<AnimationDetail | null>, replay = false) {
  const id = selectedId.value;
  if (!id) return;
  try {
    const next = await call();
    editError.value = undefined;
    if (selectedId.value === id) detail.value = next;
    if (replay) await control(selectedRow.value?.parentId ?? id, "restart");
  } catch (error) {
    editError.value = error instanceof Error ? error.message : String(error);
  }
}

const editedCount = computed(() => state.value?.rows.filter((row) => row.edited).length ?? 0);
/** Edits the inspector speaks for: the selected animation, or a selected timeline's steps */
const inspectedEditCount = computed(
  () =>
    state.value?.rows.filter(
      (row) => row.edited && (row.id === selectedId.value || row.parentId === selectedId.value),
    ).length ?? 0,
);

async function copyPrompt(ids?: string[]) {
  const prompt = buildPrompt(await channel.call("edits", ids));
  if (!prompt) return false;
  await copyText(prompt);
  return true;
}

const applyEdit = (change: AnimationEdit, replay: boolean) =>
  run(() => channel.call("edit", selectedId.value!, change), replay);
const resetEdits = () => run(() => channel.call("resetEdits", selectedId.value!), true);

const onKey = (event: KeyboardEvent) => {
  if (event.key === "Escape" && state.value?.picker.active) {
    void setPicker(false);
    return;
  }
  if (event.key === "Escape" && selectedId.value) selectedId.value = null;
};
window.addEventListener("keydown", onKey);
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  void setPicker(false);
});
</script>

<template>
  <main :class="{ inspecting: detail }">
    <header>
      <strong>Nugget</strong>
      <IconButton
        icon="inspect"
        :label="state?.picker.active ? 'Cancel element picker (Esc)' : 'Pick an element to find its animations'"
        :primary="state?.picker.active"
        :aria-pressed="state?.picker.active ?? false"
        @click="setPicker(!state?.picker.active)"
      >
        {{ state?.picker.active ? "Cancel picker" : "Inspect element" }}
      </IconButton>
      <span class="muted count">{{ rows.length }} animations · {{ (state?.now ?? 0).toFixed(1) }}s</span>
      <span class="spacer" />
      <CopyPromptButton v-if="editedCount && !selectedId" :copy="() => copyPrompt()" :count="editedCount" />
      <IconButton
        :icon="state?.paused ? 'play' : 'pause'"
        :label="state?.paused ? 'Resume every animation' : 'Pause every animation'"
        @click="setGlobal({ paused: !state?.paused })"
      >
        {{ state?.paused ? "Resume all" : "Pause all" }}
      </IconButton>
      <SegmentedControl
        :model-value="state?.speed ?? 1"
        :options="SPEEDS"
        label="Global speed"
        @update:model-value="setGlobal({ speed: $event })"
      />
      <SegmentedControl v-model="windowSeconds" :options="WINDOWS" label="Time window" />
      <label class="toggle"><input v-model="showNested" type="checkbox" > Steps</label>
      <button type="button" class="text-button" @click="channel.call('clearFinished')">Clear finished</button>
    </header>

    <p v-if="state?.picker.active" class="picker-status" role="status">
      Click an element on the page to find its animations. Press Esc to cancel.
    </p>
    <div v-else-if="pickedTarget" class="picker-status" role="status">
      <span>{{ pickedIds.length ? `${pickedIds.length} matching animation(s) for ${pickedTarget}` : `No live animations found for ${pickedTarget}. The app may have reverted its split text or not animated it yet.` }}</span>
      <button v-for="(id, index) in pickedIds" :key="id" class="text-button" :aria-pressed="selectedId === id" @click="selectedId = id; revealPickedRow()">
        {{ index + 1 }}
      </button>
      <button class="text-button" @click="pickedIds = []; pickedTarget = ''">Clear</button>
    </div>

    <p v-if="missing && !state" class="empty">
      No Nugget page script found. Open this panel from a page of an app that uses Nugget.
    </p>
    <p v-else-if="!rows.length" class="empty">No animations yet. Interact with the page to create some.</p>

    <div v-else class="body">
      <section class="waterfall">
        <div class="row axis">
          <div class="info" />
          <div class="track">
            <span v-for="tick in ticks" :key="tick" class="tick" :style="{ left: `${pct(tick)}%` }">
              {{ tick.toFixed(tick % 1 ? 1 : 0) }}s
            </span>
            <span class="now" :style="{ left: `${pct(axis.now)}%` }" />
          </div>
          <div class="actions" />
        </div>

        <div
          v-for="row in rows"
          :key="row.id"
          :data-animation-id="row.id"
          class="row"
          :class="[status(row), { nested: row.parentId, selected: row.id === selectedId, matched: pickedIds.includes(row.id) }]"
          tabindex="0"
          :aria-selected="row.id === selectedId"
          @click="select(row.id)"
          @keydown.enter.self="select(row.id)"
          @mouseenter="highlight(row.id)"
          @mouseleave="highlight(null)"
        >
          <div class="info" :title="`${row.label} ${row.targets}`">
            <span class="label">{{ row.label }}</span>
            <span class="muted">{{ row.targets }}</span>
            <span v-if="row.scroll" class="badge">scroll</span>
            <span v-if="row.edited" class="badge edited" title="Edited in devtools">edited</span>
            <span v-if="row.unavailable" class="badge" :title="row.unavailable">removed targets</span>
          </div>
          <div class="track">
            <span class="now" :style="{ left: `${pct(axis.now)}%` }" />
            <div
              class="bar"
              :style="{ left: `${pct(row.start)}%`, width: `max(2px, ${pct(end(row)) - pct(row.start)}%)` }"
            >
              <div class="fill" :style="{ transform: `scaleX(${row.progress})` }" />
            </div>
          </div>
          <div class="actions" @click.stop>
            <IconButton
              :icon="row.active ? 'pause' : 'play'"
              :label="row.active ? 'Pause' : 'Play'"
              :disabled="Boolean(row.unavailable)"
              @click="control(row.id, row.active ? 'pause' : 'play')"
            />
            <IconButton icon="replay" :label="row.unavailable ?? 'Replay'" :disabled="Boolean(row.unavailable)" @click="control(row.id, 'restart')" />
            <ProgressScrubber :model-value="row.progress" label="Seek" :disabled="Boolean(row.unavailable)" @update:model-value="seek(row.id, $event)" />
          </div>
        </div>
      </section>

      <AnimationInspector
        v-if="detail"
        :key="detail.id"
        :detail="detail"
        :row="selectedRow"
        :error="editError"
        :edit-count="inspectedEditCount"
        :copy-prompt="() => copyPrompt([detail!.id])"
        @edit="applyEdit"
        @reset="resetEdits"
        @close="selectedId = null"
        @control="control(detail.id, $event)"
        @seek="seek(detail.id, $event)"
      />
    </div>
  </main>
</template>

<style>
:root {
  color-scheme: light dark;
  --bg: #fff;
  --fg: #1f2328;
  --muted: #6e7781;
  --line: #d0d7de;
  --track: #f6f8fa;
  --rail: #eaeef2;
  --field: #fff;
  --hover: rgb(31 35 40 / 0.07);
  --thumb: #fff;
  --accent: var(--devframe-primary, #0969da);
  --on-accent: #fff;
  --error: #cf222e;
  --running: #2da44e;
  --paused: #e8a33d;
  --done: #8c959f;
  --waiting: #0969da;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  font: 12px/1.4 ui-sans-serif, system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --bg: #0d1117;
    --fg: #e6edf3;
    --muted: #8b949e;
    --line: #30363d;
    --track: #161b22;
    --rail: #21262d;
    --field: #0d1117;
    --hover: rgb(230 237 243 / 0.08);
    --thumb: #e6edf3;
    --accent: var(--devframe-primary, #4493f8);
    --error: #f85149;
    --waiting: #4493f8;
  }
}

:root.dark {
  --bg: #0d1117;
  --fg: #e6edf3;
  --muted: #8b949e;
  --line: #30363d;
  --track: #161b22;
  --rail: #21262d;
  --field: #0d1117;
  --hover: rgb(230 237 243 / 0.08);
  --thumb: #e6edf3;
  --accent: var(--devframe-primary, #4493f8);
  --error: #f85149;
  --waiting: #4493f8;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
}

main {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}

.count {
  font-variant-numeric: tabular-nums;
}

.picker-status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
}

.row.matched:not(.selected) {
  box-shadow: inset 3px 0 var(--accent);
}

.text-button {
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: transform 120ms var(--ease-out);
}

.text-button:active {
  transform: scale(0.97);
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.toggle input {
  margin: 0;
  accent-color: var(--accent);
}

@media (hover: hover) and (pointer: fine) {
  .text-button:hover {
    background: var(--hover);
  }
}

.spacer {
  flex: 1;
}

.muted {
  color: var(--muted);
}

.empty {
  padding: 24px 12px;
  color: var(--muted);
}

.body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

.inspecting .body {
  grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
}

.waterfall {
  overflow-y: auto;
}

.row {
  display: grid;
  grid-template-columns: minmax(160px, 28%) 1fr 170px;
  align-items: center;
  gap: 8px;
  padding: 2px 12px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}

.row.axis {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--bg);
  cursor: default;
}

.row:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.row.selected {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  box-shadow: inset 2px 0 var(--accent);
}

@media (hover: hover) and (pointer: fine) {
  .row:not(.axis, .selected):hover {
    background: var(--track);
  }
}

.row.nested .info {
  padding-left: 16px;
}

.info {
  display: flex;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.label {
  font-family: var(--mono);
}

.badge {
  padding: 0 4px;
  border: 1px solid var(--waiting);
  border-radius: 3px;
  color: var(--waiting);
}

.badge.edited {
  border-color: var(--paused);
  color: var(--paused);
}

.track {
  position: relative;
  height: 18px;
}

.axis .track {
  height: 16px;
}

.tick {
  position: absolute;
  transform: translateX(-50%);
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.now {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--paused);
  opacity: 0.6;
}

.bar {
  position: absolute;
  top: 4px;
  height: 10px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--status) 30%, transparent);
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--status);
  transform-origin: left;
}

.running {
  --status: var(--running);
}

.paused {
  --status: var(--paused);
}

.done {
  --status: var(--done);
}

.waiting {
  --status: var(--waiting);
}

.actions {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: default;
}
</style>
