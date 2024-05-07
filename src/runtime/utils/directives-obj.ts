import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "vue";

export function directiveObj<Options = unknown, Element = HTMLElement>(
  fn: ObjectDirective<Element, Options>["mounted"],
): ObjectDirective<Element, Options> {
  return {
    [directiveHooks.mounted]: fn,
  };
}
