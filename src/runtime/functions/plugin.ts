import { directiveHooks } from "@vueuse/core";
import { defineNuxtPlugin } from "#app";
import type { BakedPresets } from "#build/types/nugget";
import type { UseBakedAnimationOptions } from "../baked";
import {
  type UseBakedAnimateOnScrollOptions,
  useBakedAnimateOnScroll,
  vAos,
} from "./use-animate-on-scroll";
import { useBakedFromTo, vFromTo } from "./use-gsap";
import {
  type UseBakedSplitTextAnimationOptions,
  useBakedSplitTextAnimation,
  vTextAnimate,
} from "./use-split-text-animation";

type BakedPresetsArray = (keyof {
  [P in keyof BakedPresets as
    | P
    | (BakedPresets[P] extends infer V
        ? V extends string
          ? `${P}:${V}`
          : never
        : never)]: true;
})[];

const transformBakedArrayToObject = <const T extends BakedPresetsArray>(v: T) =>
  Object.fromEntries(
    v.map((val) => {
      const [key, value] = val.split(":");
      return [key, value === undefined ? true : value];
    }),
  ) as {
    [P in T[number] as P extends `${infer K}:${string}`
      ? K
      : P]: P extends `${string}:${infer V}` ? V : true;
  };

export default defineNuxtPlugin((nuxt) => {
  const app = nuxt.vueApp;

  app.directive("text-animate", vTextAnimate);

  app.directive<HTMLElement, UseBakedSplitTextAnimationOptions>(
    "text-animate-baked",
    {
      [directiveHooks.mounted]: (el, binding) => {
        useBakedSplitTextAnimation(el, binding.value);
      },
    },
  );

  for (const splitBy of ["lines", "words", "chars"] as const) {
    app.directive<HTMLElement, BakedPresetsArray>(
      `text-animate-baked-${splitBy}`,
      {
        [directiveHooks.mounted]: (el, binding) => {
          useBakedSplitTextAnimation(el, {
            splitBy,
            animationOptions: transformBakedArrayToObject(binding.value),
          });
        },
      },
    );
  }

  app.directive("aos", vAos);

  app.directive<HTMLElement, UseBakedAnimateOnScrollOptions>("aos-baked", {
    [directiveHooks.mounted]: (el, binding) => {
      useBakedAnimateOnScroll(el, binding.value);
    },
  });

  app.directive<HTMLElement, BakedPresetsArray>("aos-baked-animate", {
    [directiveHooks.mounted]: (el, binding) => {
      useBakedAnimateOnScroll(el, {
        animationOptions: transformBakedArrayToObject(binding.value),
      });
    },
  });

  app.directive("from-to", vFromTo);

  app.directive<HTMLElement, UseBakedAnimationOptions>("from-to-baked", {
    [directiveHooks.mounted]: (el, binding) => {
      useBakedFromTo(el, binding.value);
    },
  });

  app.directive<HTMLElement, BakedPresetsArray>("from-to-baked-animate", {
    [directiveHooks.mounted]: (el, binding) => {
      useBakedFromTo(el, {
        animationOptions: transformBakedArrayToObject(binding.value),
      });
    },
  });
});
