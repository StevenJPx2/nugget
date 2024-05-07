import {
  type UseBakedSplitTextAnimationOptions,
  useBakedSplitTextAnimation,
  useSplitTextAnimation,
} from ".";
import { defineDirective } from "../../baked";
import type { BakedPresetsArray } from "../../types";
import { directiveObj, transformBakedArrayToObject } from "../../utils";

export const vTextAnimate = defineDirective({
  fn: useSplitTextAnimation,
  bakedFn: useBakedSplitTextAnimation,
});

export const vTextAnimateBaked =
  directiveObj<UseBakedSplitTextAnimationOptions>((el, binding) => {
    useBakedSplitTextAnimation(el, binding.value);
  });

export const vTextAnimateBakedLines = directiveObj<BakedPresetsArray>(
  (el, binding) => {
    useBakedSplitTextAnimation(el, {
      splitBy: "lines",
      animationOptions: transformBakedArrayToObject(binding.value),
    });
  },
);

export const vTextAnimateBakedWords = directiveObj<BakedPresetsArray>(
  (el, binding) => {
    useBakedSplitTextAnimation(el, {
      splitBy: "words",
      animationOptions: transformBakedArrayToObject(binding.value),
    });
  },
);

export const vTextAnimateBakedChars = directiveObj<BakedPresetsArray>(
  (el, binding) => {
    useBakedSplitTextAnimation(el, {
      splitBy: "chars",
      animationOptions: transformBakedArrayToObject(binding.value),
    });
  },
);
