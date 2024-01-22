import { defineNuxtPlugin } from "#app";
import { vAos } from "./use-animate-on-scroll/directive";
import { vSplitAnimate } from "./use-split-text-animation/directive";
import { vFromTo } from "./use-gsap/directive";

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.directive("split-animate", vSplitAnimate);
  nuxt.vueApp.directive("aos", vAos);
  nuxt.vueApp.directive("from-to", vFromTo);
});
