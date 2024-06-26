import { camelCase, titleCase } from "string-ts";
import { defineConfig } from "vitepress";
import { generateSidebar } from "vitepress-extras";
import { description, name, version } from "../../package.json";
import { github, logo, ogImage, ogUrl, releases } from "./meta";

const functionPaths = generateSidebar({
  rootPath: "src/runtime",
  contentPath: "functions",
  leadingPath: "/",
  leafFile: "README",
  transformName: (fileName) =>
    fileName !== "functions" ? camelCase(fileName) : "Functions",
});
console.log(JSON.stringify(functionPaths, null, 2));

const guidePaths = generateSidebar({
  rootPath: "src/guide",
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
    "runtime/functions/:type*/README.md": "functions/:type*/index.md",
    "runtime/functions/:type+.md": "functions/:type+.md",
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
        "Copyright © 2024-PRESENT Steven John.<br> Made with ❤  from 🇮",
    },

    search: {
      provider: "local",
    },

    nav: [
      // @ts-expect-error NavItem is close to sidebar item
      generateSidebar({
        rootPath: "src/guide",
        leadingPath: "/guide",
        leafFile: "README",
        depth: 1,
        transformName: (fileName) =>
          fileName === "" ? "Guide" : titleCase(fileName),
      })[0],

      { text: "Functions", link: "/functions/" },

      {
        text: `v${version}`,
        link: releases,
      },
    ],

    sidebar: {
      "/guide/": guidePaths,
      "/functions/": functionPaths,
    },

    socialLinks: [{ icon: "github", link: github }],
  },
});
