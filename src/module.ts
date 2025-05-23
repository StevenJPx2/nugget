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
import { relative, sep } from "pathe";
import { camelCase, pascalCase } from "string-ts";
import { name, version } from "../package.json";
import { defaultPresets } from "./baked/presets";
import type { PresetsGeneric } from "./types";

// Module options TypeScript interface definition
export interface ModuleOptions {
  baked: {
    defaults?: PresetsGeneric;
    custom?: PresetsGeneric;
  };
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
  },
  async setup(options) {
    const allBakedPresets = {
      ...options.baked.defaults,
      ...options.baked.custom,
    };

    const { resolve } = createResolver(import.meta.url);
    const resolveRuntime = (...path: string[]) => resolve("./runtime", ...path);

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

    for (const path of components) {
      addComponent({
        name: pascalCase(
          relative(
            resolveRuntime("./functions"),
            path.split(sep).slice(-2, -1)[0],
          )
            .replace("component.vue", "")
            .replace(/use/, "")
            .replace(/create/, ""),
        ),
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

    await installModule("nuxt-split-type", {});
    await installModule("@vueuse/nuxt", {});
  },
});
