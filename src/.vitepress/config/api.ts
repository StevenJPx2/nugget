import { camelCase } from "string-ts";
import { type DefaultTheme } from "vitepress";
import { generateSidebar } from "./utils";

export const prepareApiRoutes = (): DefaultTheme.SidebarItem[] =>
  generateSidebar("runtime", {
    leadingPath: "/api",
    leafFile: "README",
    transformName: camelCase,
  });
