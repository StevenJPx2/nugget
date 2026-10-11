# `useSplitTextAnimation`

Automatically enable animate on scroll for the attached element. The text is split with GSAP's SplitText (see [`useSplitText`](../use-split-text/)), and lines re-split on resize and font load by default.

## Usage

```ts
const container = ref<HTMLElement>();
useSplitTextAnimation(container, {
  splitBy: "lines",
  splitOptions: { mask: "lines" },
  tweens: { y: [-10, 0], autoAlpha: [0, 1] },
});
```

## Baked version

With [`baked`](../baked) animations.

```ts
const container = ref<HTMLElement>();
useBakedSplitTextAnimation(container, {
  animationOptions: { translate: true, opacity: true },
});
```

## Directive

Can also be imported as `vTextAnimate`.

### Unbaked

```vue
<div
  v-text-animate="{
    options: {
      splitBy: 'lines',
      tweens: { x: [0, 10] },
    },
  }"
/>
```

### Baked

```vue
<div
  v-text-animate="{
    baked: true,
    options: {
      splitBy: 'lines',
      animationOptions: { translate: true, scale: true },
    },
  }"
/>
```

```vue
<div
  v-text-animate-baked="{
    splitBy: 'lines',
    animationOptions: { translate: true, scale: true },
  }"
/>
```

```vue
<div v-text-animate-baked-lines="['translate', 'scale:out']" />
```


