import fs from "fast-glob";
import { join, resolve, sep } from "pathe";
import { capitalize } from "string-ts";
import { withoutLeadingSlash, withoutTrailingSlash } from "ufo";
import { type DefaultTheme } from "vitepress";

export const generateSidebar = (
  rootPath: string,
  options: {
    leadingPath?: string;
    leafFile?: string;
    transformName?: (fileName: string, filePath: string) => string;
    transformPath?: (filePath: string, fileName: string) => string;
    depth?: number;
  },
): DefaultTheme.SidebarItem[] => {
  const {
    leadingPath = "",
    transformName = (val) => val,
    transformPath = (path, name) => join(path, name),
    leafFile = "index",
    depth = Infinity,
  } = options;
  const path = resolve(__dirname, "..", "..", rootPath);

  const sidebar: DefaultTheme.SidebarItem[] = [];
  const files = fs
    .globSync("*.md", {
      cwd: path,
      deep: depth,
      objectMode: true,
      baseNameMatch: true,
    })
    .map((val) => ({
      name: val.name.replace(".md", ""),
      path: withoutTrailingSlash(val.path).split(sep).slice(0, -1).join(sep),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort(
      (a, b) => a.path.length - b.path.length - (a.name === leafFile ? 1 : 0),
      // sort by path length (shorter first), but put the leaf file at the start
    );

  const filesRemap: DefaultTheme.SidebarItem[] = files.map(({ name, path }) => {
    const parentPath = path.split(sep);
    const parentName =
      parentPath.at(-1) ||
      capitalize(withoutLeadingSlash(withoutTrailingSlash(leadingPath)));

    const transformNameNormalized = (name: string) => {
      const nameNormalized = name.replace(/^(?:\d+\.)/g, "").trim();
      return transformName(nameNormalized, path);
    };

    return parentPath.reduceRight((acc, curr, index, arr) => {
      if (index === arr.length - 1) {
        if (name === leafFile) {
          return {
            text: transformNameNormalized(parentName),
            link: join(leadingPath, transformPath(path, ""), sep),
            items: [],
          };
        }
        return {
          text: transformNameNormalized(parentName),
          items: [
            {
              text: transformNameNormalized(name),
              link: join(leadingPath, transformPath(path, name)),
            },
          ],
        };
      }

      return { text: transformNameNormalized(curr), items: [acc] };
    }, {} as DefaultTheme.SidebarItem);
  });

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

  console.log(JSON.stringify(sidebar, null, 2), { options });

  return sidebar;
};
