import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  installModule,
  addImportsDir,
  addComponent,
  addComponentsDir,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import fg from "fast-glob";
import { relative, sep } from "pathe";
import { pascalCase } from "string-ts";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: name,
  },
  // Default configuration options of the Nuxt module
  defaults: {
    baked: { extra: { hello: { in: { from: {}, to: {} }, DEFAULT: "in" } } },
  },
  async setup() {
    const resolver = createResolver(import.meta.url);

    addPlugin(resolver.resolve("./functions/plugin"));

    for (const path of fg.sync(
      resolver.resolve("./functions/**/component.vue"),
    )) {
      addComponent({
        name: pascalCase(
          relative(
            resolver.resolve("./functions"),
            path.split(sep).slice(-2, -1)[0],
          )
            .replace("component.vue", "")
            .replace("use", ""),
        ),
        filePath: path,
      });
    }

    addImportsDir(resolver.resolve("./functions"));
    addComponentsDir({ path: resolver.resolve("./components") });

    await installModule("nuxt-split-type", {});
    await installModule("@vueuse/nuxt", {});
  },
});
