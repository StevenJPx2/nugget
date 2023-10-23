import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  installModule,
  addComponentsDir,
} from "@nuxt/kit";
import { name, version } from "../package.json";

// Module options TypeScript interface definition
export interface ModuleOptions {}

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

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin"));

    addComponentsDir({ path: resolver.resolve("./runtime/components") });

    await installModule("nuxt-split-type", {});
    await installModule("@vueuse/nuxt", {});
    await installModule("@hypernym/nuxt-gsap", {});
  },
});
