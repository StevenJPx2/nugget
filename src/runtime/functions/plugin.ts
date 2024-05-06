import { defineNuxtPlugin } from "#app";
import nuggetBakedPresets from "#build/nugget/presets.mjs";
import { type AnimationOptions, DirectiveOptions } from "../baked";
import { vAos } from "./use-animate-on-scroll/directive";
import { vFromTo } from "./use-gsap/directive";
import { vTextAnimate } from "./use-split-text-animation/directive";

export default defineNuxtPlugin((nuxt) => {
  const app = nuxt.vueApp;

  for (const key in nuggetBakedPresets) {
    const typedKey = key as keyof AnimationOptions;
    nuggetBakedPresets;
  }

  app.directive("yo", (el, binding) => {});

  nuxt.vueApp.directive("text-animate", vTextAnimate);
  nuxt.vueApp.directive("aos", vAos);
  nuxt.vueApp.directive("from-to", vFromTo);
});
