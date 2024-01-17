# `useAnimateOnScroll`

Automatically enable animate on scroll for the attached element.

## Usage

```ts
const container = ref<HTMLElement>();
useAnimateOnScroll(container, {
  from: { y: -10, autoAlpha: 0 },
  to: { y: 0, autoAlpha: 1 },
});
```

## Baked version

With [`baked`](../baked) animations.

```ts
const container = ref<HTMLElement>();
useBakedAnimateOnScroll(container, { translate: true, opacity: true });
```

## Directive

Can also be imported as `vAos`.

### Unbaked

```vue
<div
  v-aos="{
    options: { from: { x: 0 }, to: { x: 10 } },
  }"
/>
```

### Baked

```vue
<div
  v-aos="{
    baked: true,
    options: { translate: true, scale: true },
  }"
/>
```
