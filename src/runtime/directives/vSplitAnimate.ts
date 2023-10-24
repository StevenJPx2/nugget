import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "nuxt/dist/app/compat/capi";
import useSplitTextAnimation from "../composables/useSplitTextAnimation";
import type { UseSplitTextAnimationOptions } from "../composables/useSplitTextAnimation";

export const vSplitAnimate: ObjectDirective<
  HTMLElement,
  UseSplitTextAnimationOptions
> = {
  [directiveHooks.mounted]: (el, binding) => {
    useSplitTextAnimation(el, binding.value);
  },
};
