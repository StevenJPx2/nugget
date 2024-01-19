# Composables

## Low-level

- [`useGsap`](./use-gsap/): Exposes [gsap][gsap-href] functions. This is internally used in all the other animation composables.
- [`useLocomotive`](./use-locomotive/): Exposes [Locomotive Scroll][locomotive-href] for smooth scroll and parallax effects. Use `<Locomotive />` for CSS styles.
- [`useConstructTransition`](./transitions/): Used for creating transitions.

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
[locomotive-href]: https://github.com/locomotivemtl/locomotive-scroll/tree/v5-beta
