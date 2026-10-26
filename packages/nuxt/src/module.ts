import {
  addComponent,
  addComponentsDir,
  addImports,
  addImportsDir,
  addPlugin,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import { glob } from "tinyglobby";
import { basename, dirname } from "pathe";
import { camelCase, pascalCase } from "string-ts";
import { name, version } from "../package.json";
import { defaultPresets } from "./baked/presets";
import { setupDevtools } from "./devtools";
import type { PresetsGeneric } from "./types";

// Module options TypeScript interface definition
export interface ModuleOptions {
  baked: {
    defaults?: PresetsGeneric;
    custom?: PresetsGeneric;
  };
  /**
   * Adds a Nugget tab to Nuxt DevTools in dev, with a waterfall of animations, playback controls
   * and live editing. Needs Nuxt DevTools v4. Never part of production builds
   * @default true
   */
  devtools?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "nugget",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    baked: {
      defaults: defaultPresets,
      custom: {},
    },
    devtools: true,
  },
  async setup(options, nuxt) {
    const allBakedPresets = {
      ...options.baked.defaults,
      ...options.baked.custom,
    };

    const resolver = createResolver(import.meta.url);
    const { resolve } = resolver;
    const resolveRuntime = (...path: string[]) => resolve("./runtime", ...path);

    if (nuxt.options.dev && options.devtools) await setupDevtools(nuxt, resolver);

    addPlugin(resolveRuntime("./functions/plugin"));

    addTypeTemplate({
      filename: "types/nugget.d.ts",
      getContents: () => {
        let content = "export type BakedPresets = {\n";
        for (const key in allBakedPresets) {
          const tweens = Object.keys(allBakedPresets[key].tweens);
          content += `\t${camelCase(key)}?: true | ${tweens
            .map((tween) => `'${tween}'`)
            .join(" | ")};\n`;
        }
        content += "}";
        return content;
      },
    });

    addTemplate({
      filename: "nugget/presets.mjs",
      write: true,
      getContents: () => {
        return `export default ${JSON.stringify(allBakedPresets, null, 2)}`;
      },
    });

    const components = await glob(
      resolveRuntime("./functions/**/component.vue"),
      { absolute: true },
    );

    // Each component is named after its folder: `use-smooth-scroll` -> `SmoothScroll`
    for (const path of components) {
      const folder = basename(dirname(path));

      addComponent({
        name: pascalCase(folder.replace(/^(use|create)-/, "")),
        filePath: path,
      });
    }

    addImports([
      {
        name: "default",
        as: "nuggetBakedPresets",
        from: "#build/nugget/presets",
      },
    ]);

    addImportsDir(resolveRuntime("./functions"));
    addComponentsDir({ path: resolveRuntime("./components") });

    await installModule("@vueuse/nuxt", {});
  },
});
