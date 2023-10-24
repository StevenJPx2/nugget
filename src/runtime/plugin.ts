import { defineNuxtPlugin } from "#app";
import { vSplitAnimate } from "./directives";
export { vSplitAnimate };

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.directive("split-animate", vSplitAnimate);
});
