import { useAnimateOnScroll, useBakedAnimateOnScroll } from ".";
import { defineDirective } from "../baked/directive";

export const vAos = defineDirective({
  fn: useAnimateOnScroll,
  bakedFn: useBakedAnimateOnScroll,
});
