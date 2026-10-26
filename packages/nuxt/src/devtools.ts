import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { addPlugin, addVitePlugin, type Resolver, useLogger } from "@nuxt/kit";
import type { Nuxt } from "@nuxt/schema";
import { dirname, join } from "pathe";
import { name, version } from "../package.json";

const logger = useLogger("nugget");

/** Finds the installed Nuxt DevTools the way Nuxt itself would load it */
function nuxtDevtoolsMajor(rootDir: string) {
  try {
    const fromRoot = createRequire(join(rootDir, "package.json"));
    const fromNuxt = createRequire(fromRoot.resolve("nuxt/package.json"));
    // @nuxt/devtools doesn't export its package.json, so walk up from its entry
    let dir = dirname(fromNuxt.resolve("@nuxt/devtools"));
    while (dir !== dirname(dir)) {
      const file = join(dir, "package.json");
      if (existsSync(file)) {
        const pkg = JSON.parse(readFileSync(file, "utf8")) as { name?: string; version?: string };
        if (pkg.name === "@nuxt/devtools") return Number(pkg.version?.split(".")[0]);
      }
      dir = dirname(dir);
    }
  } catch {
    // Not installed
  }
  return undefined;
}

/**
 * Adds the Nugget tab to Nuxt DevTools v4 in dev. devframe and the Vite DevTools kit are imported
 * here, on the dev server only, so production builds never load them. They're imported
 * dynamically as packages rather than by importing this file dynamically: splitting the module
 * into chunks would move `import.meta.url` away from `runtime/`.
 */
export async function setupDevtools(nuxt: Nuxt, resolver: Resolver) {
  if (nuxt.options.devtools?.enabled === false) return;

  const major = nuxtDevtoolsMajor(nuxt.options.rootDir);
  if (!major || major < 4) {
    logger.info("Nugget devtools need Nuxt DevTools v4 and Nuxt 4.5 or later; skipping them.");
    return;
  }

  // The built panel sits next to the module in dist; in this repo's playground, src points at dist
  const panel = [resolver.resolve("./devtools-panel"), resolver.resolve("../dist/devtools-panel")].find(
    existsSync,
  );
  if (!panel) {
    logger.warn("Nugget devtools panel isn't built. Run `bun run build:panel` in packages/nuxt.");
    return;
  }

  const [{ defineDevframe }, { createPluginFromDevframe }] = await Promise.all([
    import("devframe"),
    import("@vitejs/devtools-kit/node"),
  ]);

  const devframe = defineDevframe({
    id: "nugget",
    name: "Nugget",
    version,
    packageName: name,
    importMetaUrl: import.meta.url,
    homepage: "https://nugget.stevenjohn.co",
    description: "A waterfall of running animations with playback controls and live editing",
    icon: "ph:film-strip-duotone",
    clientAssets: panel,
    // The panel talks to the page over the in-page channel, so there is no node-side work yet
    setup() {},
  });

  // Shows the panel as a tab in the Nuxt group of Nuxt DevTools v4
  addVitePlugin(createPluginFromDevframe(devframe, { dock: { groupId: "nuxt", category: "modules" } }));

  // Lets prompts name source files relative to the repository
  nuxt.options.runtimeConfig.public.nuggetDevtools = { workspaceDir: nuxt.options.workspaceDir };
  addPlugin({ src: resolver.resolve("./runtime/devtools/plugin.client"), mode: "client" });
}
