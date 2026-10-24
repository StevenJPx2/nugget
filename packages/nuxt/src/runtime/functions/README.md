# Functions

## Low-level

- [`useGsap`](./use-gsap/): Exposes [gsap][gsap-href] functions. This is internally used in all the other animation composables.
- [`useSmoothScroll`](./use-smooth-scroll/): Exposes GSAP's [ScrollSmoother][smoother-href] for smooth scroll and parallax effects. Use `<SmoothScroll />` for the wrapper and content elements.
- [`useSplitText`](./use-split-text/): Splits text with GSAP's [SplitText][split-href].
- [`useConstructTransition`](./transitions/): Used for creating transitions.
- [`createInfiniteMarquee`](./create-infinite-marquee/): Returns a component that you can wrap the content you want the marquee for.

## Mid-level

- [`useAnimateOnScroll`](./use-animate-on-scroll/)
- [`useSplitTextAnimation`](./use-split-text-animation/)

## High-level

- [**Baked** animations](/guide/2.baked): Define stackable, premium animations. All mid-level composables have a baked version.
  - `useBakedAnimation`: Exposes a `fromTo` tween with baked settings.
  - `useBakedAnimateOnScroll`: Runs baked animations on scroll. Scroll settings are automatically determined if not explicitly set.
  - `useBakedSplitTextAnimation`: Runs `useSplitTextAnimation` with baked presets.
- [Transitions](./transitions/): Composables for kickass transitions that can be used for anything.

  - `useBendyWendy`
  - `useOffset`

[gsap-href]: https://gsap.com/
[smoother-href]: https://gsap.com/docs/v3/Plugins/ScrollSmoother/
[split-href]: https://gsap.com/docs/v3/Plugins/SplitText/
