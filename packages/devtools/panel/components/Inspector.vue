<script setup lang="ts">
import { computed, ref } from "vue";
import type {
  AnimationDetail,
  AnimationEdit,
  AnimationRow,
  ControlAction,
  EditableValue,
} from "../../src/protocol";
import EaseEditor from "./EaseEditor.vue";
import IconButton from "./IconButton.vue";
import Scrubber from "./Scrubber.vue";

const props = defineProps<{ detail: AnimationDetail; row?: AnimationRow; error?: string }>();
const emit = defineEmits<{
  edit: [edit: AnimationEdit, replay: boolean];
  reset: [];
  close: [];
  control: [action: ControlAction];
  seek: [progress: number];
}>();

const replayOnEdit = ref(true);

const locked = computed(() => Boolean(props.detail.locked));

const valueRows = computed(() => {
  const { from, to } = props.detail;
  const keys = [...new Set([...Object.keys(from ?? {}), ...Object.keys(to ?? {})])];
  return keys.map((key) => ({ key, from: from?.[key], to: to?.[key] }));
});

const edit = (change: AnimationEdit) => emit("edit", change, replayOnEdit.value);

function commitNumber(field: "duration" | "delay" | "stagger" | "repeat", event: Event) {
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  if (input.value.trim() === "" || !Number.isFinite(value)) {
    input.value = String(props.detail[field] ?? "");
    return;
  }
  edit({ [field]: field === "repeat" ? Math.round(value) : value });
}

const NUMERIC = /^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i;
const parseValue = (raw: string): EditableValue => (NUMERIC.test(raw.trim()) ? Number(raw) : raw.trim());

function commitValue(side: "from" | "to", key: string, event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  edit({ [side]: { [key]: parseValue(raw) } });
}
</script>

<template>
  <aside class="inspector" aria-label="Animation inspector">
    <header>
      <div class="title">
        <span class="label">{{ detail.label }}</span>
        <span class="muted">{{ detail.targets || detail.method }}</span>
      </div>
      <IconButton icon="close" label="Close inspector (Esc)" @click="emit('close')" />
    </header>

    <div v-if="row" class="playback" :class="row.active ? 'running' : row.paused ? 'paused' : ''">
      <IconButton
        :icon="row.active ? 'pause' : 'play'"
        :label="row.active ? 'Pause' : 'Play'"
        primary
        @click="emit('control', row.active ? 'pause' : 'play')"
      />
      <IconButton icon="replay" label="Replay" @click="emit('control', 'restart')" />
      <Scrubber :model-value="row.progress" label="Progress" @update:model-value="emit('seek', $event)" />
      <span class="percent">{{ Math.round(row.progress * 100) }}%</span>
    </div>

    <p v-if="detail.locked" class="note">{{ detail.locked }}</p>
    <p v-else-if="detail.targetsHidden" class="note">
      Its element has no size right now, so changes won't be visible. It may rely on another
      animation to set it up first, such as a transition's enter timeline.
    </p>

    <fieldset :disabled="locked">
      <legend>Timing</legend>
      <div class="grid">
        <label>
          <span>Duration</span>
          <input type="number" min="0" step="0.05" :value="detail.duration" @change="commitNumber('duration', $event)" />
        </label>
        <label>
          <span>Delay</span>
          <input type="number" min="0" step="0.05" :value="detail.delay" @change="commitNumber('delay', $event)" />
        </label>
        <label v-if="detail.stagger !== null">
          <span>Stagger</span>
          <input type="number" step="0.01" :value="detail.stagger" @change="commitNumber('stagger', $event)" />
        </label>
        <label>
          <span>Repeat</span>
          <input type="number" min="-1" step="1" :value="detail.repeat" title="-1 repeats forever" @change="commitNumber('repeat', $event)" />
        </label>
        <label class="check">
          <input type="checkbox" :checked="detail.yoyo" @change="edit({ yoyo: ($event.target as HTMLInputElement).checked })" />
          <span>Yoyo</span>
        </label>
      </div>
    </fieldset>

    <fieldset v-if="detail.method !== 'timeline'" :disabled="locked">
      <legend>Ease</legend>
      <EaseEditor :model-value="detail.ease" :duration="detail.duration" @commit="edit({ ease: $event })" />
    </fieldset>

    <fieldset v-if="valueRows.length || detail.computed.length" :disabled="locked">
      <legend>Values</legend>
      <table>
        <thead>
          <tr><th /><th>From</th><th>To</th></tr>
        </thead>
        <tbody>
          <tr v-for="value in valueRows" :key="value.key">
            <th scope="row">{{ value.key }}</th>
            <td>
              <input
                v-if="detail.from"
                :value="value.from ?? ''"
                spellcheck="false"
                @change="commitValue('from', value.key, $event)"
              />
              <span v-else class="muted" title="Recorded from the element when the animation starts">current</span>
            </td>
            <td>
              <input
                v-if="detail.to"
                :value="value.to ?? ''"
                spellcheck="false"
                @change="commitValue('to', value.key, $event)"
              />
              <span v-else class="muted" title="The element's own value">current</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="detail.computed.length" class="muted small">
        Set by code, not editable here: {{ detail.computed.join(", ") }}
      </p>
    </fieldset>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <footer>
      <label class="check">
        <input v-model="replayOnEdit" type="checkbox" />
        <span>Replay after each change</span>
      </label>
      <IconButton v-if="detail.edited" icon="reset" label="Undo all edits to this animation" @click="emit('reset')">
        Reset
      </IconButton>
      <p class="muted small">Edits apply to the running page and last until it reloads.</p>
    </footer>
  </aside>
</template>

<style scoped>
.inspector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 12px 16px;
  border-left: 1px solid var(--line);
  background: var(--bg);
  overflow-y: auto;
}

header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.title {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.title > * {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.label {
  font-family: var(--mono);
  font-weight: 600;
}

.playback {
  display: flex;
  align-items: center;
  gap: 4px;
  --status: var(--accent);
}

.percent {
  width: 3.5ch;
  text-align: right;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

fieldset {
  margin: 0;
  padding: 0;
  border: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

fieldset:disabled {
  opacity: 0.6;
}

legend {
  padding: 0 0 6px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 8px;
}

.grid label:not(.check) {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: var(--muted);
}

.check {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.grid .check {
  align-self: end;
  height: 24px;
}

input:not([type="checkbox"]) {
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
  font-variant-numeric: tabular-nums;
}

input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -1px;
  border-color: transparent;
}

input[type="checkbox"] {
  margin: 0;
  accent-color: var(--accent);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 4px;
  table-layout: fixed;
}

thead th {
  color: var(--muted);
  font-weight: 500;
  text-align: left;
  padding-left: 2px;
}

thead th:first-child {
  width: 34%;
}

tbody th {
  font-family: var(--mono);
  font-weight: 400;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

td {
  padding-left: 4px;
}

td .muted {
  padding-left: 6px;
  font-style: italic;
}

.note {
  margin: 0;
  padding: 8px;
  border-radius: 6px;
  background: var(--rail);
  color: var(--muted);
}

.error {
  margin: 0;
  color: var(--error);
}

footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

footer p {
  flex-basis: 100%;
  margin: 0;
}

.small {
  font-size: 11px;
}
</style>
