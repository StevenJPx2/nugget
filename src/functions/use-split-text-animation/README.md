# `useSplitTextAnimation`

Automatically enable animate on scroll for the attached element.

## Usage

```ts
const container = ref<HTMLElement>();
useSplitTextAnimation(container, {
  splityBy: "lines",
  from: { y: -10, autoAlpha: 0 },
  to: { y: 0, autoAlpha: 1 },
});
```

## Baked version

With [`baked`](../baked) animations.

```ts
const container = ref<HTMLElement>();
useBakedSplitTextAnimation(container, { translate: true, opacity: true });
```

## Directive

Can also be imported as `vSplitAnimate`.

### Unbaked

```vue
<div
  v-split-animate="{
    options: {
      splitBy: 'lines',
      from: { x: 0 },
      to: { x: 10 },
    },
  }"
/>
```

### Baked

```vue
<div
  v-aos="{
    baked: true,
    options: { splitBy: 'lines', translate: true, scale: true },
  }"
/>
```
