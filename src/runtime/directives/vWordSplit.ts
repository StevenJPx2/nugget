import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "nuxt/dist/app/compat/capi";
import useSplitTextAnimation from "../composables/useSplitTextAnimation";

export const vWordSplit: ObjectDirective<HTMLElement> = {
  [directiveHooks.mounted]: (el) => {
    useSplitTextAnimation(el);
  },
};
