import { defineConfig } from "vitepress";
import {
  generateSidebar,
  ogUrl,
  github,
  ogImage,
  releases,
  logo,
} from "./meta";
import { version, name, description } from "../../package.json";
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
  description,
  cleanUrls: true,
  ignoreDeadLinks: true,

  head: [
    ["link", { rel: "icon", href: logo, type: "image/svg+xml" }],
    ["meta", { name: "author", content: "Steven John" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: ogUrl }],
    ["meta", { property: "og:title", content: name }],
    ["meta", { property: "og:description", content: description }],
    ["meta", { property: "og:image", content: ogImage }],
    ["meta", { name: "twitter:title", content: name }],
    ["meta", { name: "twitter:description", content: description }],
    ["meta", { name: "twitter:image", content: ogImage }],
    ["meta", { name: "twitter:site", content: "@StevenJPx2" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    // Umami analytics
    [
      "script",
      {
        src: "https://eu.umami.is/script.js",
        defer: "",
        "data-website-id": "b4e68fd8-57d8-47ec-b9d8-340aca73b67e",
      },
    ],
  ],

  rewrites: {
    "runtime/:type+/README.md": "ref/:type+/index.md",
    "runtime/:type+.md": "ref/:type+.md",
  },
  sitemap: {
    hostname: "https://nugget.stevenjohn.co",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo,
    editLink: {
      pattern: `${github}/edit/main/src/:path`,
      text: "Suggest changes to this page",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright:
        "Copyright © 2024-PRESENT Steven John.<br> Made with ❤️  from 🇮🇳",
    },

    search: {
      provider: "local",
    },

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
        link: releases,
      },
    ],

    sidebar: {
      "/guide/": guidePaths,
      "/ref/": [{ text: "Reference", items: refPaths }],
    },

    socialLinks: [{ icon: "github", link: github }],
  },
});
