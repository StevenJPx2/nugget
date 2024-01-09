import { defineConfig } from "vitepress";
import { resolve, relative, join } from "pathe";
import { readdirSync } from "fs";
import { camelCase } from "string-ts";

type Item = { text: string; link: string };

const path = resolve(__dirname, "../runtime");

const Composables: Item[] = [];
const Components: Item[] = [];

const paths = { components: Components, composables: Composables };

for (const file of readdirSync(path, {
  withFileTypes: true,
  recursive: true,
})) {
  if (file.name.endsWith(".md")) {
    const filePath = relative(path, file.path);
    const [dir, parent] = filePath.split("/").slice(-2);

    if (!parent) throw new Error("Could not find parent directory");

    if (file.name === "README.md") {
      paths[dir].push({
        text: camelCase(parent),
        link: join(dir, parent),
      });
    } else {
      paths[dir].push({
        text: camelCase(file.name.replace(".md", "")),
        link: filePath,
      });
    }
  }
}

console.log(Composables, "composables");

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nugget",
  description: "A Nuxt module that enchances your animations ✨",
  cleanUrls: true,
  rewrites: {
    "runtime/:path": ":path.md",
    "runtime/:type/:obj/README.md": ":type/:obj.md",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/get-started" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [{ text: "Get started", link: "/get-started" }],
      },
      {
        text: "Components",
        items: Components,
      },
      {
        text: "Composables",
        items: Composables,
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/StevenJPx2/nugget" },
    ],
  },
});
