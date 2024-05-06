import { useAnimateOnScroll, useBakedAnimateOnScroll } from ".";
import { defineDirective } from "../../baked";

export const vAos = defineDirective({
  fn: useAnimateOnScroll,
  bakedFn: useBakedAnimateOnScroll,
});
