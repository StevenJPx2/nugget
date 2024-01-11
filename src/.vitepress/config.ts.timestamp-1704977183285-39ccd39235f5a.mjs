// src/.vitepress/config.ts
import { defineConfig } from "file:///Users/stevenjohn/Documents/Projects/nugget/node_modules/vitepress/dist/node/index.js";

// src/.vitepress/config/api.ts
import { camelCase } from "file:///Users/stevenjohn/Documents/Projects/nugget/node_modules/string-ts/dist/index.js";
import "file:///Users/stevenjohn/Documents/Projects/nugget/node_modules/vitepress/dist/node/index.js";

// src/.vitepress/config/utils.ts
import { readdirSync } from "fs";
import { join, relative, resolve } from "file:///Users/stevenjohn/Documents/Projects/nugget/node_modules/pathe/dist/index.mjs";
import "file:///Users/stevenjohn/Documents/Projects/nugget/node_modules/vitepress/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/stevenjohn/Documents/Projects/nugget/src/.vitepress/config";
var generateSidebar = (rootPath, options) => {
  const {
    leadingPath = "",
    transformName = (val) => val,
    transformPath = (path2, name) => join(path2, name),
    leafFile = "index"
  } = options;
  const path = resolve(__vite_injected_original_dirname, "..", "..", rootPath);
  const sidebar = [];
  const files = readdirSync(path, {
    withFileTypes: true,
    recursive: true
  }).filter((val) => val.name.endsWith(".md")).map((val) => ({
    name: val.name.replace(".md", ""),
    path: relative(path, val.path)
  }));
  const filesRemap = files.map(
    ({ name, path: path2 }) => path2.split("/").reduceRight((acc, curr, index, arr) => {
      if (index === arr.length - 1) {
        if (name === leafFile) {
          return {
            text: transformName(name, path2),
            link: join(leadingPath, transformPath(path2, ""), "/")
          };
        }
        return {
          text: path2.split("/").pop() ?? "",
          items: [
            {
              text: transformName(name, path2),
              link: join(leadingPath, transformPath(path2, name), "/")
            }
          ]
        };
      }
      return { text: curr, items: [acc] };
    }, {})
  );
  for (const file of filesRemap) {
    let tmpFile = file;
    let current = sidebar;
    console.log(file, "file");
    while (current.length > 0) {
      console.log(current, "current", tmpFile, "tmpFile");
      const items = current.find((val) => val.text === tmpFile.text)?.items;
      if ("items" in tmpFile && Array.isArray(tmpFile.items) && tmpFile.items.length > 0) {
        tmpFile = tmpFile.items[0];
      }
    }
    if (current) {
      current.push(tmpFile);
    } else {
      sidebar.push(tmpFile);
    }
    console.log(sidebar, "sidebar");
  }
  return sidebar;
};

// src/.vitepress/config/api.ts
var prepareApiRoutes = () => {
  const sidebar = generateSidebar(
    "runtime/components",
    {
      leadingPath: "/api",
      leafFile: "README",
      transformName: (val, path) => camelCase(val === "README" ? path.split("/").pop() ?? "Intro" : val)
    }
  );
  console.log(JSON.stringify(sidebar, null, 2));
  return sidebar;
};

// src/.vitepress/config.ts
var apiPaths = prepareApiRoutes();
var config_default = defineConfig({
  title: "Nugget",
  description: "A Nuxt module that enchances your animations \u2728",
  cleanUrls: true,
  rewrites: {
    "runtime/:path": "api/:path.md",
    "runtime/:type/:obj/README.md": "api/:type/:obj/index.md"
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/get-started" },
      { text: "Reference", link: "/api/composables/baked" }
    ],
    sidebar: {
      "/guide/": [],
      "/api/": [{ text: "Reference", items: apiPaths }]
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/StevenJPx2/nugget" }
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjLy52aXRlcHJlc3MvY29uZmlnLnRzIiwgInNyYy8udml0ZXByZXNzL2NvbmZpZy9hcGkudHMiLCAic3JjLy52aXRlcHJlc3MvY29uZmlnL3V0aWxzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3N0ZXZlbmpvaG4vRG9jdW1lbnRzL1Byb2plY3RzL251Z2dldC9zcmMvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N0ZXZlbmpvaG4vRG9jdW1lbnRzL1Byb2plY3RzL251Z2dldC9zcmMvLnZpdGVwcmVzcy9jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N0ZXZlbmpvaG4vRG9jdW1lbnRzL1Byb2plY3RzL251Z2dldC9zcmMvLnZpdGVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZXByZXNzXCI7XG5pbXBvcnQgeyBwcmVwYXJlQXBpUm91dGVzIH0gZnJvbSBcIi4vY29uZmlnL2FwaVwiO1xuXG5jb25zdCBhcGlQYXRocyA9IHByZXBhcmVBcGlSb3V0ZXMoKTtcblxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdGl0bGU6IFwiTnVnZ2V0XCIsXG4gIGRlc2NyaXB0aW9uOiBcIkEgTnV4dCBtb2R1bGUgdGhhdCBlbmNoYW5jZXMgeW91ciBhbmltYXRpb25zIFx1MjcyOFwiLFxuICBjbGVhblVybHM6IHRydWUsXG4gIHJld3JpdGVzOiB7XG4gICAgXCJydW50aW1lLzpwYXRoXCI6IFwiYXBpLzpwYXRoLm1kXCIsXG4gICAgXCJydW50aW1lLzp0eXBlLzpvYmovUkVBRE1FLm1kXCI6IFwiYXBpLzp0eXBlLzpvYmovaW5kZXgubWRcIixcbiAgfSxcbiAgdGhlbWVDb25maWc6IHtcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXG4gICAgbmF2OiBbXG4gICAgICB7IHRleHQ6IFwiSG9tZVwiLCBsaW5rOiBcIi9cIiB9LFxuICAgICAgeyB0ZXh0OiBcIkd1aWRlXCIsIGxpbms6IFwiL2d1aWRlL2dldC1zdGFydGVkXCIgfSxcbiAgICAgIHsgdGV4dDogXCJSZWZlcmVuY2VcIiwgbGluazogXCIvYXBpL2NvbXBvc2FibGVzL2Jha2VkXCIgfSxcbiAgICBdLFxuXG4gICAgc2lkZWJhcjoge1xuICAgICAgXCIvZ3VpZGUvXCI6IFtdLFxuICAgICAgXCIvYXBpL1wiOiBbeyB0ZXh0OiBcIlJlZmVyZW5jZVwiLCBpdGVtczogYXBpUGF0aHMgfV0sXG4gICAgfSxcblxuICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICB7IGljb246IFwiZ2l0aHViXCIsIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlbkpQeDIvbnVnZ2V0XCIgfSxcbiAgICBdLFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zdGV2ZW5qb2huL0RvY3VtZW50cy9Qcm9qZWN0cy9udWdnZXQvc3JjLy52aXRlcHJlc3MvY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc3RldmVuam9obi9Eb2N1bWVudHMvUHJvamVjdHMvbnVnZ2V0L3NyYy8udml0ZXByZXNzL2NvbmZpZy9hcGkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N0ZXZlbmpvaG4vRG9jdW1lbnRzL1Byb2plY3RzL251Z2dldC9zcmMvLnZpdGVwcmVzcy9jb25maWcvYXBpLnRzXCI7aW1wb3J0IHsgY2FtZWxDYXNlIH0gZnJvbSBcInN0cmluZy10c1wiO1xuaW1wb3J0IHsgdHlwZSBEZWZhdWx0VGhlbWUgfSBmcm9tIFwidml0ZXByZXNzXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZVNpZGViYXIgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgY29uc3QgcHJlcGFyZUFwaVJvdXRlcyA9ICgpOiBEZWZhdWx0VGhlbWUuU2lkZWJhckl0ZW1bXSA9PiB7XG4gIGNvbnN0IHNpZGViYXI6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdID0gZ2VuZXJhdGVTaWRlYmFyKFxuICAgIFwicnVudGltZS9jb21wb25lbnRzXCIsXG4gICAge1xuICAgICAgbGVhZGluZ1BhdGg6IFwiL2FwaVwiLFxuICAgICAgbGVhZkZpbGU6IFwiUkVBRE1FXCIsXG4gICAgICB0cmFuc2Zvcm1OYW1lOiAodmFsLCBwYXRoKSA9PlxuICAgICAgICBjYW1lbENhc2UodmFsID09PSBcIlJFQURNRVwiID8gcGF0aC5zcGxpdChcIi9cIikucG9wKCkgPz8gXCJJbnRyb1wiIDogdmFsKSxcbiAgICB9LFxuICApO1xuXG4gIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHNpZGViYXIsIG51bGwsIDIpKTtcbiAgcmV0dXJuIHNpZGViYXI7XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3RldmVuam9obi9Eb2N1bWVudHMvUHJvamVjdHMvbnVnZ2V0L3NyYy8udml0ZXByZXNzL2NvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3N0ZXZlbmpvaG4vRG9jdW1lbnRzL1Byb2plY3RzL251Z2dldC9zcmMvLnZpdGVwcmVzcy9jb25maWcvdXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3N0ZXZlbmpvaG4vRG9jdW1lbnRzL1Byb2plY3RzL251Z2dldC9zcmMvLnZpdGVwcmVzcy9jb25maWcvdXRpbHMudHNcIjtpbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgam9pbiwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tIFwicGF0aGVcIjtcblxuaW1wb3J0IHsgdHlwZSBEZWZhdWx0VGhlbWUgfSBmcm9tIFwidml0ZXByZXNzXCI7XG5cbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVNpZGViYXIgPSAoXG4gIHJvb3RQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHtcbiAgICBsZWFkaW5nUGF0aD86IHN0cmluZztcbiAgICBsZWFmRmlsZT86IHN0cmluZztcbiAgICB0cmFuc2Zvcm1OYW1lPzogKGZpbGVOYW1lOiBzdHJpbmcsIGZpbGVQYXRoOiBzdHJpbmcpID0+IHN0cmluZztcbiAgICB0cmFuc2Zvcm1QYXRoPzogKGZpbGVQYXRoOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpID0+IHN0cmluZztcbiAgfSxcbik6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdID0+IHtcbiAgY29uc3Qge1xuICAgIGxlYWRpbmdQYXRoID0gXCJcIixcbiAgICB0cmFuc2Zvcm1OYW1lID0gKHZhbCkgPT4gdmFsLFxuICAgIHRyYW5zZm9ybVBhdGggPSAocGF0aCwgbmFtZSkgPT4gam9pbihwYXRoLCBuYW1lKSxcbiAgICBsZWFmRmlsZSA9IFwiaW5kZXhcIixcbiAgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IHBhdGggPSByZXNvbHZlKF9fZGlybmFtZSwgXCIuLlwiLCBcIi4uXCIsIHJvb3RQYXRoKTtcblxuICBjb25zdCBzaWRlYmFyOiBEZWZhdWx0VGhlbWUuU2lkZWJhckl0ZW1bXSA9IFtdO1xuICBjb25zdCBmaWxlcyA9IHJlYWRkaXJTeW5jKHBhdGgsIHtcbiAgICB3aXRoRmlsZVR5cGVzOiB0cnVlLFxuICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgfSlcbiAgICAuZmlsdGVyKCh2YWwpID0+IHZhbC5uYW1lLmVuZHNXaXRoKFwiLm1kXCIpKVxuICAgIC5tYXAoKHZhbCkgPT4gKHtcbiAgICAgIG5hbWU6IHZhbC5uYW1lLnJlcGxhY2UoXCIubWRcIiwgXCJcIiksXG4gICAgICBwYXRoOiByZWxhdGl2ZShwYXRoLCB2YWwucGF0aCksXG4gICAgfSkpO1xuXG4gIGNvbnN0IGZpbGVzUmVtYXA6IERlZmF1bHRUaGVtZS5TaWRlYmFySXRlbVtdID0gZmlsZXMubWFwKCh7IG5hbWUsIHBhdGggfSkgPT5cbiAgICBwYXRoLnNwbGl0KFwiL1wiKS5yZWR1Y2VSaWdodCgoYWNjLCBjdXJyLCBpbmRleCwgYXJyKSA9PiB7XG4gICAgICBpZiAoaW5kZXggPT09IGFyci5sZW5ndGggLSAxKSB7XG4gICAgICAgIGlmIChuYW1lID09PSBsZWFmRmlsZSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0ZXh0OiB0cmFuc2Zvcm1OYW1lKG5hbWUsIHBhdGgpLFxuICAgICAgICAgICAgbGluazogam9pbihsZWFkaW5nUGF0aCwgdHJhbnNmb3JtUGF0aChwYXRoLCBcIlwiKSwgXCIvXCIpLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZXh0OiBwYXRoLnNwbGl0KFwiL1wiKS5wb3AoKSA/PyBcIlwiLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IHRyYW5zZm9ybU5hbWUobmFtZSwgcGF0aCksXG4gICAgICAgICAgICAgIGxpbms6IGpvaW4obGVhZGluZ1BhdGgsIHRyYW5zZm9ybVBhdGgocGF0aCwgbmFtZSksIFwiL1wiKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgdGV4dDogY3VyciwgaXRlbXM6IFthY2NdIH07XG4gICAgfSwge30gYXMgRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtKSxcbiAgKTtcblxuICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXNSZW1hcCkge1xuICAgIGxldCB0bXBGaWxlID0gZmlsZTtcbiAgICBsZXQgY3VycmVudCA9IHNpZGViYXI7XG4gICAgY29uc29sZS5sb2coZmlsZSwgXCJmaWxlXCIpO1xuICAgIHdoaWxlIChjdXJyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnQsIFwiY3VycmVudFwiLCB0bXBGaWxlLCBcInRtcEZpbGVcIik7XG4gICAgICBjb25zdCBpdGVtcyA9IGN1cnJlbnQuZmluZCgodmFsKSA9PiB2YWwudGV4dCA9PT0gdG1wRmlsZS50ZXh0KT8uaXRlbXM7XG5cbiAgICAgIGlmIChcbiAgICAgICAgXCJpdGVtc1wiIGluIHRtcEZpbGUgJiZcbiAgICAgICAgQXJyYXkuaXNBcnJheSh0bXBGaWxlLml0ZW1zKSAmJlxuICAgICAgICB0bXBGaWxlLml0ZW1zLmxlbmd0aCA+IDBcbiAgICAgICkge1xuICAgICAgICB0bXBGaWxlID0gdG1wRmlsZS5pdGVtc1swXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgY3VycmVudC5wdXNoKHRtcEZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaWRlYmFyLnB1c2godG1wRmlsZSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coc2lkZWJhciwgXCJzaWRlYmFyXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNpZGViYXI7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVixTQUFTLG9CQUFvQjs7O0FDQWQsU0FBUyxpQkFBaUI7QUFDL1gsT0FBa0M7OztBQ0R1VSxTQUFTLG1CQUFtQjtBQUNyWSxTQUFTLE1BQU0sVUFBVSxlQUFlO0FBRXhDLE9BQWtDO0FBSGxDLElBQU0sbUNBQW1DO0FBS2xDLElBQU0sa0JBQWtCLENBQzdCLFVBQ0EsWUFNK0I7QUFDL0IsUUFBTTtBQUFBLElBQ0osY0FBYztBQUFBLElBQ2QsZ0JBQWdCLENBQUMsUUFB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
