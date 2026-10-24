# `useSmoothScroll`

This composable adds GSAP's [ScrollSmoother][smoother-href] to Vue while keeping it SSR friendly. It ships with `gsap`, so there is nothing else to install.

::: info
ScrollSmoother needs a wrapper and a content element around everything that scrolls. The [`<SmoothScroll />`](#component) component renders both for you.
:::

## Example

```ts
useSmoothScroll({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1,
  effects: true,
});
```

## Component

```vue
<smooth-scroll :options="{ smooth: 1, effects: true }">
  <!-- everything that scrolls -->
</smooth-scroll>
```

- Keep `position: fixed` elements (navbars, overlays) outside the component, since the content is transformed.
- With `effects: true`, `data-speed` and `data-lag` attributes add parallax.
- Children can reach the instance with `injectSmoothScroll()`, for example to call `effects()` or `paused()`.

[smoother-href]: https://gsap.com/docs/v3/Plugins/ScrollSmoother/
