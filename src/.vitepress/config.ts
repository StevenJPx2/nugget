import { defineConfig } from "vitepress";
import { prepareApiRoutes } from "./config/api";

const apiPaths = prepareApiRoutes();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nugget",
  description: "A Nuxt module that enchances your animations ✨",
  cleanUrls: true,
  ignoreDeadLinks: true,
  rewrites: {
    "runtime/:type/:obj*/README.md": "api/:type/:obj*/index.md",
    "runtime/:type+.md": "api/:type+.md",
  },
  sitemap: {
    hostname: "https://nugget.stevenjohn.co",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/get-started" },
      { text: "Reference", link: "/api/composables/baked/" },
    ],

    sidebar: {
      "/guide/": [],
      "/api/": [{ text: "Reference", items: apiPaths }],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/StevenJPx2/nugget" },
    ],
  },
});
