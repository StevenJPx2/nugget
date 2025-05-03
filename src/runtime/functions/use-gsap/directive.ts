import type { ObjectDirective } from "vue";
import { type UseGsapReturn, useBakedFromTo, useGsap } from ".";
import type { DirectiveOptions, UseBakedAnimationOptions } from "../../baked";
import { directiveObj } from "../../utils";

export const vFromTo: ObjectDirective<
  HTMLElement,
  DirectiveOptions<
    Parameters<UseGsapReturn["fromTo"]>[1],
    UseBakedAnimationOptions
  >
> = {
  mounted(el, binding) {
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

export const vFromToBakedAnimate = directiveObj<
  UseBakedAnimationOptions["animationOptions"]
>((el, binding) => {
  useBakedFromTo(el, {
    animationOptions: binding.value,
  });
});
