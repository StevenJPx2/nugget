# `useAnimateOnScroll`

Automatically enable animate on scroll for the attached element.

## Usage

```ts
const container = ref<HTMLElement>();
useAnimateOnScroll(container, {
  tweens: { y: [-10, 0], autoAlpha: [0, 1] },
});
```

## Baked version

With [`baked`](../baked) animations.

```ts
const container = ref<HTMLElement>();
useBakedAnimateOnScroll(container, {
  animationOptions: { translate: true, opacity: true },
});
```

## Directive

Can also be imported as `vAos`.

### Unbaked

```vue
<div
  v-aos="{
    options: { tweens: { x: [0, 10] } },
  }"
/>
```

### Baked

```vue
<div
  v-aos="{
    baked: true,
    options: {
      animationOptions: { translate: true, scale: true },
    },
  }"
/>
```

```vue
<div
  v-aos-baked="{
    animationOptions: { translate: true, scale: true },
  }"
/>
```

```vue
<div v-aos-baked-animate="['translate', 'scale:out']" />
```
