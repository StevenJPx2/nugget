export default defineNuxtConfig({
  modules: ["../src/module", "@nuxtjs/tailwindcss"],
  nugget: {
    baked: {
      custom: {
        zoom: {
          tweens: {
            in: {
              scale: ["100%", "110%"],
            },
            out: {
              scale: ["110%", "100%"],
            },
          },
          defaultTween: "in",
        },
      },
    },
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
});
