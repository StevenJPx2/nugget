import { defineNuxtPlugin } from "#app";
import { vAos, vAosBaked, vAosBakedAnimate } from "./use-animate-on-scroll";
import { vFromTo, vFromToBaked, vFromToBakedAnimate } from "./use-gsap";
import {
  vTextAnimate,
  vTextAnimateBaked,
  vTextAnimateBakedChars,
  vTextAnimateBakedLines,
  vTextAnimateBakedWords,
} from "./use-split-text-animation";

export default defineNuxtPlugin((nuxt) => {
  const app = nuxt.vueApp;

  app.directive("text-animate", vTextAnimate);
  app.directive("text-animate-baked", vTextAnimateBaked);
  app.directive("text-animate-baked-lines", vTextAnimateBakedLines);
  app.directive("text-animate-baked-words", vTextAnimateBakedWords);
  app.directive("text-animate-baked-chars", vTextAnimateBakedChars);

  app.directive("aos", vAos);
  app.directive("aos-baked", vAosBaked);
  app.directive("aos-baked-animate", vAosBakedAnimate);

  app.directive("from-to", vFromTo);
  app.directive("from-to-baked", vFromToBaked);
  app.directive("from-to-baked-animate", vFromToBakedAnimate);
});
