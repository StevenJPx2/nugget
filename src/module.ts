import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  installModule,
  addImportsDir,
  addComponent,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import fg from "fast-glob";
import { relative } from "pathe";
import { pascalCase } from "string-ts";

// Module options TypeScript interface definition
export interface ModuleOptions {
  baked?: { extra?: [] };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: name,
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup() {
    const resolver = createResolver(import.meta.url);

    addPlugin(resolver.resolve("./functions/plugin"));

    for (const path of fg.sync(
      resolver.resolve("./functions/**/component.vue"),
    )) {
      addComponent({
        name: pascalCase(
          relative(resolver.resolve("./functions"), path)
            .replace("component.vue", "")
            .replace("use", ""),
        ),
        filePath: path,
      });
    }

    addImportsDir(resolver.resolve("./functions"));

    await installModule("nuxt-split-type", {});
    await installModule("@vueuse/nuxt", {});
  },
});
