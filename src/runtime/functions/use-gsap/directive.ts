import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "vue";
import { type UseGsapReturn, useBakedFromTo, useGsap } from ".";
import type { DirectiveOptions, UseBakedAnimationOptions } from "../../baked";

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
