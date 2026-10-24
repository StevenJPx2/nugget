import { addPlugin, addVitePlugin, createResolver, defineNuxtModule } from "@nuxt/kit";
import { createPluginFromDevframe } from "@vitejs/devtools-kit/node";
import { nuggetDevframe } from "./index";

export default defineNuxtModule({
  meta: {
    name: "@fdcn/nugget-devtools",
    configKey: "nuggetDevtools",
  },
  setup(_options, nuxt) {
    if (!nuxt.options.dev) return;
    const { resolve } = createResolver(import.meta.url);

    // Shows the panel as a tab in the Nuxt group of Nuxt DevTools v4
    addVitePlugin(
      createPluginFromDevframe(nuggetDevframe, {
        dock: { groupId: "nuxt", category: "modules" },
      }),
    );
    addPlugin({ src: resolve("./runtime/page-script.client"), mode: "client" });
  },
});
