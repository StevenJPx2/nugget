import {
  addComponent,
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  installModule,
} from "@nuxt/kit";
import fg from "fast-glob";
import { relative, sep } from "pathe";
import { pascalCase } from "string-ts";
import { name, version } from "../package.json";

// Module options TypeScript interface definition
export interface ModuleOptions {
  baked?: {
    extra?: Record<
      string,
      {
        tweens?: Record<
          string,
          {
            [x: string]: {
              from: {
                [x: string]: string | number;
              };
              to: {
                [x: string]: string | number;
              };
            };
          }
        >;
      }
    >;
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "nugget",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const resolveRuntime = (...path: string[]) => resolve("./runtime", ...path);

    addPlugin(resolveRuntime("./functions/plugin"));
    addTypeTemplate({
      filename: "types/locomotive-scroll.d.ts",
      src: resolveRuntime("./functions/use-locomotive/types/index.d.ts"),
    });

    for (const path of fg.sync(
      resolveRuntime("./functions/**/component.vue"),
    )) {
      addComponent({
        name: pascalCase(
          relative(
            resolveRuntime("./functions"),
            path.split(sep).slice(-2, -1)[0],
          )
            .replace("component.vue", "")
            .replace("use", ""),
        ),
        filePath: path,
      });
    }

    addImportsDir(resolveRuntime("./functions"));
    addComponentsDir({ path: resolveRuntime("./components") });

    await installModule("nuxt-split-type", {});
    await installModule("@vueuse/nuxt", {});
  },
});
