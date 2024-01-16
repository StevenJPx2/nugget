import { defineNuxtPlugin } from "#app";
import {
  vSplitAnimate,
  vAos,
  vFromTo,
} from "../runtime/composables/directives";

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.directive("split-animate", vSplitAnimate);
  nuxt.vueApp.directive("aos", vAos);
  nuxt.vueApp.directive("from-to", vFromTo);
});
