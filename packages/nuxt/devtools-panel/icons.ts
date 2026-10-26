/** 16×16 icons. Filled ones use `fill`, line ones use a 1.5px stroke. */
export const icons = {
  play: { fill: "M5 3.4v9.2a.6.6 0 0 0 .92.5l7.1-4.6a.6.6 0 0 0 0-1L5.92 2.9A.6.6 0 0 0 5 3.4Z" },
  pause: {
    fill: "M4.6 3h1.8c.33 0 .6.27.6.6v8.8a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6V3.6c0-.33.27-.6.6-.6Zm5 0h1.8c.33 0 .6.27.6.6v8.8a.6.6 0 0 1-.6.6H9.6a.6.6 0 0 1-.6-.6V3.6c0-.33.27-.6.6-.6Z",
  },
  replay: { stroke: "M2.75 8a5.25 5.25 0 1 0 1.54-3.71M2.75 2.5v2.75H5.5" },
  close: { stroke: "M4 4l8 8M12 4l-8 8" },
  reset: { stroke: "M5.5 3.25 2.75 6 5.5 8.75M2.75 6h6.5a3.5 3.5 0 0 1 0 7H6.5" },
  copy: {
    stroke: "M5.75 5.75V3.5c0-.41.34-.75.75-.75h6c.41 0 .75.34.75.75v6c0 .41-.34.75-.75.75h-2.25M3.5 5.75h6c.41 0 .75.34.75.75v6c0 .41-.34.75-.75.75h-6a.75.75 0 0 1-.75-.75v-6c0-.41.34-.75.75-.75Z",
  },
  check: { stroke: "M3 8.5 6.5 12 13 4.5" },
  inspect: { stroke: "M6 2.5H2.5V6M10 2.5h3.5V6M2.5 10v3.5H6M8 7l5 2-2 1.5L9.5 13 8 7Z" },
} satisfies Record<string, { fill: string } | { stroke: string }>;

export type IconName = keyof typeof icons;
