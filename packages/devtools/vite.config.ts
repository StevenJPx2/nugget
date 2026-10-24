import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// devframe serves the panel under a mount path it picks, so assets must be relative
export default defineConfig({
  root: "panel",
  base: "./",
  plugins: [vue()],
  build: {
    outDir: "../dist/panel",
    emptyOutDir: true,
  },
});
