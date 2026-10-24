import { fileURLToPath } from "node:url";
import { defineDevframe } from "devframe";

export const nuggetDevframe = defineDevframe({
  id: "nugget",
  name: "Nugget",
  version: "0.0.0",
  packageName: "@fdcn/nugget-devtools",
  importMetaUrl: import.meta.url,
  homepage: "https://nugget.stevenjohn.co",
  description: "A waterfall of running animations with playback controls",
  icon: "ph:film-strip-duotone",
  clientAssets: fileURLToPath(new URL("../dist/panel", import.meta.url)),
  // The panel talks to the page over the in-page channel, so there is no node-side work yet
  setup() {},
});

export * from "./protocol";
