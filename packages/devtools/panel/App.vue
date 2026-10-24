<script setup lang="ts">
import { connectPanelChannel } from "devframe/in-page-channel";
import { computed, ref, shallowRef } from "vue";
import {
  type AnimationRow,
  type ControlAction,
  NUGGET_CHANNEL,
  type NuggetChannelProtocol,
  type NuggetState,
} from "../src/protocol";

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

const SPEEDS = [0.1, 0.25, 0.5, 1, 2];
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
const seek = (id: string, event: Event) =>
  channel.call("seek", id, Number((event.target as HTMLInputElement).value));
const setGlobal = (options: { paused?: boolean; speed?: number }) =>
  channel.call("setGlobal", options);
const highlight = (id: string | null) => channel.emit("highlight", id);
</script>

<template>
  <main>
    <header>
      <strong>Nugget</strong>
      <span class="muted">{{ rows.length }} animations · {{ (state?.now ?? 0).toFixed(1) }}s</span>
      <span class="spacer" />
      <button @click="setGlobal({ paused: !state?.paused })">
        {{ state?.paused ? "Resume all" : "Pause all" }}
      </button>
      <label>
        Speed
        <select
          :value="state?.speed ?? 1"
          @change="setGlobal({ speed: Number(($event.target as HTMLSelectElement).value) })"
        >
          <option v-for="speed in SPEEDS" :key="speed" :value="speed">{{ speed }}×</option>
        </select>
      </label>
      <label>
        Show
        <select v-model.number="windowSeconds">
          <option :value="0">all</option>
          <option :value="10">last 10s</option>
          <option :value="30">last 30s</option>
        </select>
      </label>
      <label><input v-model="showNested" type="checkbox" /> Steps</label>
      <button @click="channel.call('clearFinished')">Clear finished</button>
    </header>

    <p v-if="missing && !state" class="empty">
      No Nugget page script found. Open this panel from a page of an app that uses Nugget.
    </p>
    <p v-else-if="!rows.length" class="empty">No animations yet. Interact with the page to create some.</p>

    <section v-else class="waterfall">
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
        class="row"
        :class="[status(row), { nested: row.parentId }]"
        @mouseenter="highlight(row.id)"
        @mouseleave="highlight(null)"
      >
        <div class="info" :title="`${row.label} ${row.targets}`">
          <span class="label">{{ row.label }}</span>
          <span class="muted">{{ row.targets }}</span>
          <span v-if="row.scroll" class="badge">scroll</span>
        </div>
        <div class="track">
          <span class="now" :style="{ left: `${pct(axis.now)}%` }" />
          <div
            class="bar"
            :style="{ left: `${pct(row.start)}%`, width: `max(2px, ${pct(end(row)) - pct(row.start)}%)` }"
          >
            <div class="fill" :style="{ width: `${row.progress * 100}%` }" />
          </div>
        </div>
        <div class="actions">
          <button
            :title="row.active ? 'Pause' : 'Play'"
            @click="control(row.id, row.active ? 'pause' : 'play')"
          >
            {{ row.active ? "⏸" : "▶" }}
          </button>
          <button title="Replay" @click="control(row.id, 'restart')">↺</button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            :value="row.progress"
            title="Seek"
            @input="seek(row.id, $event)"
          />
        </div>
      </div>
    </section>
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
  --running: #2da44e;
  --paused: #e8a33d;
  --done: #8c959f;
  --waiting: #0969da;
  font: 12px/1.4 ui-sans-serif, system-ui, sans-serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --fg: #e6edf3;
    --muted: #8b949e;
    --line: #30363d;
    --track: #161b22;
  }
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
}

header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}

button,
select {
  font: inherit;
  color: inherit;
  background: var(--track);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
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

.row {
  display: grid;
  grid-template-columns: minmax(180px, 28%) 1fr 190px;
  align-items: center;
  gap: 8px;
  padding: 2px 12px;
  border-bottom: 1px solid var(--line);
}

.row:not(.axis):hover {
  background: var(--track);
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
  font-family: ui-monospace, monospace;
}

.badge {
  padding: 0 4px;
  border: 1px solid var(--waiting);
  border-radius: 3px;
  color: var(--waiting);
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
  gap: 4px;
}

.actions input {
  flex: 1;
  min-width: 0;
}
</style>
