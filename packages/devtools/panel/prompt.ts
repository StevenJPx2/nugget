import type { EditableValue, EditRecord } from "../src/protocol";

const TIMING = ["duration", "delay", "ease", "stagger", "repeat", "yoyo"] as const;

const show = (value: unknown) => (typeof value === "string" ? JSON.stringify(value) : String(value));

const timingLabel = (key: (typeof TIMING)[number], record: EditRecord) =>
  key === "duration" && record.staggered
    ? "duration (per target)"
    : key === "stagger"
      ? "stagger (seconds between targets)"
      : key === "repeat"
        ? "repeat (-1 is forever)"
        : key;

/** "before → after" lines for what changed; empty when edits cancelled out */
export function changesOf(record: EditRecord): string[] {
  const { before, after } = record;
  const lines: string[] = [];
  for (const key of TIMING) {
    if (after[key] === undefined || before[key] === after[key]) continue;
    const was =
      key === "ease" && record.easeWasDefault
        ? `${show(before.ease)} (GSAP's default, not set in code)`
        : show(before[key]);
    lines.push(`${timingLabel(key, record)}: ${was} → ${show(after[key])}`);
  }
  for (const side of ["from", "to"] as const) {
    const was = before[side] ?? {};
    for (const [key, value] of Object.entries(after[side] ?? {})) {
      if (was[key] === value) continue;
      lines.push(`${side} ${key}: ${was[key] === undefined ? "not set" : show(was[key])} → ${show(value)}`);
    }
  }
  return lines;
}

const literal = (values: Record<string, EditableValue | boolean>) => {
  const entries = Object.entries(values).map(([key, value]) => `${key}: ${show(value)}`);
  return entries.length ? `{ ${entries.join(", ")} }` : "{}";
};

/** The call as it was before editing, so the agent can search for its values */
function originalCall(record: EditRecord) {
  const { before } = record;
  const timing: Record<string, EditableValue | boolean> = {};
  if (before.duration !== undefined) timing.duration = before.duration;
  if (before.delay) timing.delay = before.delay;
  if (before.ease && !record.easeWasDefault) timing.ease = before.ease;
  if (before.stagger !== undefined) timing.stagger = before.stagger;
  if (before.repeat) timing.repeat = before.repeat;
  if (before.yoyo) timing.yoyo = true;

  const target = record.targets || "target";
  if (record.method === "fromTo") {
    return `fromTo(${target}, ${literal(before.from ?? {})}, ${literal({ ...before.to, ...timing })})`;
  }
  const values = record.method === "from" ? before.from : before.to;
  return `${record.method}(${target}, ${literal({ ...values, ...timing })})`;
}

const describeComponents = (record: EditRecord) =>
  record.components
    .map(({ name, file }) => [name && `<${name}>`, file && `(${file})`].filter(Boolean).join(" "))
    .join(", which is used in ");

function section(record: EditRecord, index: number) {
  const lines = [`${index}. \`${record.label}\` on \`${record.targets || "a timeline"}\``];
  if (record.components.length) lines.push(`   Rendered by ${describeComponents(record)}`);
  if (record.timeline) {
    lines.push(
      `   Step ${record.timeline.step} of ${record.timeline.steps} in a GSAP timeline (\`${record.timeline.label}\`)`,
    );
  }
  lines.push("   Before editing it was roughly:", `   \`${originalCall(record)}\``, "   Change:");
  for (const change of changesOf(record)) lines.push(`   - ${change}`);
  return lines.join("\n");
}

export function buildPrompt(records: EditRecord[]): string | null {
  const changed = records.filter((record) => changesOf(record).length);
  if (!changed.length) return null;

  const pages = [...new Set(changed.map((record) => record.page))].map((page) => `\`${page}\``).join(", ");
  const usesCustomEase = changed.some((record) => record.after.ease?.startsWith("M0,0"));
  const intro =
    changed.length === 1
      ? `I tuned an animation in the Nugget devtools on page ${pages}. Apply this change in the source code.`
      : `I tuned ${changed.length} animations in the Nugget devtools on page ${pages}. Apply these changes in the source code.`;

  const notes = [
    "- Nugget is a Nuxt module over GSAP. The animation may come from a Nugget composable, directive, component or preset (`useGsap`, `useAnimateOnScroll`, `v-aos`, `nuggetBakedPresets`, transitions) rather than a direct `gsap` call. Change the options where the app passes them.",
    "- If a value comes from code other animations share, such as a preset or a library component, don't change the shared code. Override it at this call site and tell me you did.",
    ...(usesCustomEase
      ? [
          '- Eases like `"M0,0 C… 1,1"` are GSAP CustomEase curves. Register it once at startup: `import { CustomEase } from "gsap/CustomEase"; gsap.registerPlugin(CustomEase)`.',
        ]
      : []),
    "- Change only the values listed.",
  ];

  const sections = changed.map((record, i) => section(record, i + 1)).join("\n\n");
  return [intro, "", sections, "", "Notes:", ...notes].join("\n");
}

/** Copies through the clipboard API, falling back to a selection for frames that don't allow it */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.cssText = "position:fixed;opacity:0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}
