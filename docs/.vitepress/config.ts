import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nugget",
  description: "A Nuxt module that enchances your animations ✨",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/get-started" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [{ text: "Get started", link: "/get-started" }],
      },
      {
        text: "Components",
        items: [
          { text: "InfiniteMarquee", link: "/components/infinite-marquee" },
          { text: "SmoothScroll", link: "/components/smooth-scroll" },
        ],
      },
      {
        text: "Composables",
        items: [
          { text: "useGsap", link: "/composables/use-gsap" },
          {
            text: "useAnimateOnScroll",
            link: "/composables/use-animate-on-scroll",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
