import { useSplitTextAnimation, useBakedSplitTextAnimation } from ".";
import { defineDirective } from "../baked/directive";

export const vSplitAnimate = defineDirective({
  fn: useSplitTextAnimation,
  bakedFn: useBakedSplitTextAnimation,
});
