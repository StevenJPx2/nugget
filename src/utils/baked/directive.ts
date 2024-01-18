import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "vue";

export type DirectiveOptions<O, BO> =
  | { baked: true; options: BO }
  | { baked?: false; options: O };

export const defineDirective = <O, BO>({
  fn,
  bakedFn,
}: {
  fn: (el: HTMLElement, options: O) => void;
  bakedFn: (el: HTMLElement, options: BO) => void;
}): ObjectDirective<HTMLElement, DirectiveOptions<O, BO>> => {
  return {
    [directiveHooks.mounted]: (el, binding) => {
      if (!binding.value?.baked) return fn(el, binding.value.options);
      bakedFn(el, binding.value.options);
    },
  };
};
