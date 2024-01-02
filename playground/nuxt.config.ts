export default defineNuxtConfig({
  modules: [
    "../src/module",
    "@nuxtjs/tailwindcss",
  ],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
});