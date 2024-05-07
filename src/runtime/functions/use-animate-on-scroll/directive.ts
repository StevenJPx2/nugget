import {
  type UseBakedAnimateOnScrollOptions,
  useAnimateOnScroll,
  useBakedAnimateOnScroll,
} from ".";
import { defineDirective } from "../../baked";
import type { BakedPresetsArray } from "../../types";
import { directiveObj, transformBakedArrayToObject } from "../../utils";

export const vAos = defineDirective({
  fn: useAnimateOnScroll,
  bakedFn: useBakedAnimateOnScroll,
});

export const vAosBaked = directiveObj<UseBakedAnimateOnScrollOptions>(
  (el, binding) => {
    useBakedAnimateOnScroll(el, binding.value);
  },
);

export const vAosBakedAnimate = directiveObj<BakedPresetsArray>(
  (el, binding) => {
    useBakedAnimateOnScroll(el, {
      animationOptions: transformBakedArrayToObject(binding.value),
    });
  },
);
