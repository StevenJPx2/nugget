import { directiveHooks } from "@vueuse/core";
import type { ObjectDirective } from "vue";
import { type UseGsapReturn, useBakedFromTo, useGsap } from ".";
import type { DirectiveOptions, UseBakedAnimationOptions } from "../../baked";
import type { BakedPresetsArray } from "../../types";
import { directiveObj, transformBakedArrayToObject } from "../../utils";

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

export const vFromToBaked = directiveObj<UseBakedAnimationOptions>(
  (el, binding) => {
    useBakedFromTo(el, binding.value);
  },
);

export const vFromToBakedAnimate = directiveObj<BakedPresetsArray>(
  (el, binding) => {
    useBakedFromTo(el, {
      animationOptions: transformBakedArrayToObject(binding.value),
    });
  },
);
