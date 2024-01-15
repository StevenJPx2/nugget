import { defineConfig } from "vitepress";
import { generateSidebar } from "./meta";
import { version } from "../../package.json";
import { titleCase, camelCase } from "string-ts";

const refPaths = generateSidebar("runtime", {
  leadingPath: "/ref",
  leafFile: "README",
  transformName: camelCase,
});

const guidePaths = generateSidebar("guide", {
  leadingPath: "/guide",
  leafFile: "README",
  transformName: titleCase,
});

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nugget",
  description: "A Nuxt module that enchances your animations ✨",
  cleanUrls: true,
  ignoreDeadLinks: true,
  rewrites: {
    "runtime/:type+/README.md": "ref/:type+/index.md",
    "runtime/:type+.md": "ref/:type+.md",
  },
  sitemap: {
    hostname: "https://nugget.stevenjohn.co",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // @ts-expect-error
      generateSidebar("guide", {
        leadingPath: "/guide",
        leafFile: "README",
        depth: 1,
        transformName: titleCase,
      })[0],
      {
        text: "Reference",
        // @ts-expect-error
        items: generateSidebar("runtime", {
          leadingPath: "/ref",
          leafFile: "README",
          depth: 2,
          transformName: titleCase,
        }),
      },
      {
        text: `v${version}`,
        link: "https://github.com/StevenJPx2/nugget/releases",
      },
    ],

    sidebar: {
      "/guide/": guidePaths,
      "/ref/": [{ text: "Reference", items: refPaths }],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/StevenJPx2/nugget" },
    ],
  },
});
