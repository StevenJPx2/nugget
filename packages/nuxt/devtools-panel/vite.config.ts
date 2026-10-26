import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// The panel ships prebuilt in the module's dist. devframe serves it under a mount path it
// picks, so assets must be relative
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [vue()],
  build: {
    outDir: "../dist/devtools-panel",
    emptyOutDir: true,
  },
});
