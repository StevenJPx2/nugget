import { useGsap, useBakedFromTo, type UseGsapReturn } from ".";
import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "nuxt/dist/app/compat/capi";
import type {
  DirectiveOptions,
  UseBakedAnimationOptions,
} from "../../utils/baked";

export const vFromTo: ObjectDirective<
  HTMLElement,
  DirectiveOptions<
    Parameters<UseGsapReturn["fromTo"]>[1],
    UseBakedAnimationOptions
  >
> = {
  [directiveHooks.mounted]: (el, binding) => {
    if (!binding.value?.baked) {
      const { fromTo } = useGsap();
      return fromTo(el, binding.value.options);
    }
    useBakedFromTo(el, binding.value.options);
  },
};
