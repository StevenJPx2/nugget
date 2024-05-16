import type { UseSplitTextOptions as _ } from "nuxt-split-type";
import {
  type UseBakedSplitTextAnimationOptions,
  useBakedSplitTextAnimation,
  useSplitTextAnimation,
} from ".";
import { defineDirective } from "../../baked";
import { directiveObj } from "../../utils";

export const vTextAnimate = defineDirective({
  fn: useSplitTextAnimation,
  bakedFn: useBakedSplitTextAnimation,
});

export const vTextAnimateBaked =
  directiveObj<UseBakedSplitTextAnimationOptions>((el, binding) => {
    useBakedSplitTextAnimation(el, binding.value);
  });

export const vTextAnimateBakedLines = directiveObj<
  UseBakedSplitTextAnimationOptions["animationOptions"]
>((el, binding) => {
  useBakedSplitTextAnimation(el, {
    splitBy: "lines",
    animationOptions: binding.value,
  });
});

export const vTextAnimateBakedWords = directiveObj<
  UseBakedSplitTextAnimationOptions["animationOptions"]
>((el, binding) => {
  useBakedSplitTextAnimation(el, {
    splitBy: "words",
    animationOptions: binding.value,
  });
});

export const vTextAnimateBakedChars = directiveObj<
  UseBakedSplitTextAnimationOptions["animationOptions"]
>((el, binding) => {
  useBakedSplitTextAnimation(el, {
    splitBy: "chars",
    animationOptions: binding.value,
  });
});
