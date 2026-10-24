import {
  type UseBakedAnimateOnScrollOptions,
  useAnimateOnScroll,
  useBakedAnimateOnScroll,
} from ".";
import { defineDirective } from "../../baked";
import { directiveObj } from "../../utils";

export const vAos = defineDirective({
  fn: useAnimateOnScroll,
  bakedFn: useBakedAnimateOnScroll,
});

export const vAosBaked = directiveObj<UseBakedAnimateOnScrollOptions>(
  (el, binding) => {
    useBakedAnimateOnScroll(el, binding.value);
  },
);

export const vAosBakedAnimate = directiveObj<
  UseBakedAnimateOnScrollOptions["animationOptions"]
>((el, binding) => {
  useBakedAnimateOnScroll(el, {
    animationOptions: binding.value,
  });
});
