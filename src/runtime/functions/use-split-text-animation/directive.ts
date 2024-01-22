import { useSplitTextAnimation, useBakedSplitTextAnimation } from ".";
import { defineDirective } from "../../utils/baked";

export const vSplitAnimate = defineDirective({
  fn: useSplitTextAnimation,
  bakedFn: useBakedSplitTextAnimation,
});
