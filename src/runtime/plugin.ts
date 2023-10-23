import { defineNuxtPlugin } from "#app";
import { vWordSplit } from "./directives";
export { vWordSplit };

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.directive("word-split", vWordSplit);
});
