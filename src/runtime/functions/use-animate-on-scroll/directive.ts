import { useAnimateOnScroll, useBakedAnimateOnScroll } from ".";
import { defineDirective } from "../../utils/baked";

export const vAos = defineDirective({
  fn: useAnimateOnScroll,
  bakedFn: useBakedAnimateOnScroll,
});
