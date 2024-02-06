import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  installModule,
  addImportsDir,
  addComponent,
  addComponentsDir,
  addTypeTemplate,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import fg from "fast-glob";
import { relative, sep } from "pathe";
import { pascalCase } from "string-ts";

// Module options TypeScript interface definition
export interface ModuleOptions {
  baked?: {
    extra?: {
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
    };
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
  async setup() {
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
