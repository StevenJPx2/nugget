import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "nuxt/dist/app/compat/capi";
import useSplitTextAnimation, {
  type UseBakedSplitTextAnimationOptions,
} from "../composables/baked/split-text";

export const vSplitAnimate: ObjectDirective<
  HTMLElement,
  UseBakedSplitTextAnimationOptions
> = {
  [directiveHooks.mounted]: (el, binding) => {
    useSplitTextAnimation(el, binding.value);
  },
};
