import { globSync } from "glob";
import { join, relative, resolve } from "pathe";
import { type DefaultTheme } from "vitepress";

export const generateSidebar = (
  rootPath: string,
  options: {
    leadingPath?: string;
    leafFile?: string;
    transformName?: (fileName: string, filePath: string) => string;
    transformPath?: (filePath: string, fileName: string) => string;
  },
): DefaultTheme.SidebarItem[] => {
  const {
    leadingPath = "",
    transformName = (val) => val,
    transformPath = (path, name) => join(path, name),
    leafFile = "index",
  } = options;
  const path = resolve(__dirname, "..", "..", rootPath);

  const sidebar: DefaultTheme.SidebarItem[] = [];
  const files = globSync(`${path}/**/*.md`, { withFileTypes: true })
    .map((val) => ({
      name: val.name.replace(".md", ""),
      path: relative(path, val.path),
    }))
    .sort(
      (a, b) => a.path.length - b.path.length - (a.name === leafFile ? 1 : 0),
      // sort by path length (shorter first), but put the leaf file at the start
    );

  const filesRemap: DefaultTheme.SidebarItem[] = files.map(({ name, path }) =>
    path.split("/").reduceRight((acc, curr, index, arr) => {
      const parentName = path.split("/").pop() ?? "";
      if (index === arr.length - 1) {
        if (name === leafFile) {
          return {
            text: transformName(parentName, path),
            link: join(leadingPath, transformPath(path, ""), "/"),
            items: [],
          };
        }
        return {
          text: parentName,
          items: [
            {
              text: transformName(name, path),
              link: join(leadingPath, transformPath(path, name)),
            },
          ],
        };
      }

      return { text: curr, items: [acc] };
    }, {} as DefaultTheme.SidebarItem),
  );

  for (const file of filesRemap) {
    let tmpFile = file;
    let current = sidebar;
    while (current.length > 0) {
      const items = current.find((val) => val.text === tmpFile.text)?.items;

      if (!items) break;

      current = items;

      if (
        "items" in tmpFile &&
        Array.isArray(tmpFile.items) &&
        tmpFile.items.length > 0
      ) {
        tmpFile = tmpFile.items[0];
      }
    }

    if (current) {
      current.push(tmpFile);
    } else {
      sidebar.push(tmpFile);
    }
  }

  console.log(JSON.stringify(sidebar, null, 2));

  return sidebar;
};
