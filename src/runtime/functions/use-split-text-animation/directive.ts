import { useBakedSplitTextAnimation, useSplitTextAnimation } from ".";
import { defineDirective } from "../../baked";

export const vTextAnimate = defineDirective({
  fn: useSplitTextAnimation,
  bakedFn: useBakedSplitTextAnimation,
});
