# `useGsap` function

Exposes [gsap][gsap-href] functions. This is internally used in all the other animation composables.

## Usage

```js
const {
  gsap, // re-exported gsap instance
  timeline, // Define timeline here.
  set, // SSR-friendly `gsap.set`
  fromTo, // SSR-friendly `gsap.fromTo`
  to, // SSR-friendly `gsap.to`
  from, // SSR-friendly `gsap.from`
} = useGsap([ScrollTrigger]); // Add plugins here
```

You can use (`set`, `fromTo`, `to`, `from`) the way you would use it normally, but with no issues.

**`timeline` Usage**

```js
const {
  tl, // timeline ref
  tlFn, // SSR-proof function
  play, // SSR-friendly play
  pause, // SSR-friendly pause
  restart, // SSR-friendly restart
  resume, // SSR-friendly resume
  progress, // SSR-friendly progress
  seek, // SSR-friendly seek
} = timeline({ scrollTrigger: ".container", paused: true });
```

You can use `tlFn` to have an isolated instance of the timeline which will register on mount.

## Baked version

This exposes `fromTo` with [`baked`](../baked) animations.

```ts
const container = ref<HTMLElement>();
useBakedFromTo(container, { translate: true, scale: true });
```

## Directive

Can also be imported as `vFromTo`.

### Unbaked

```vue
<div
  v-from-to="{
    options: { from: { x: 0 }, to: { x: 10 } },
  }"
/>
```

### Baked

```vue
<div
  v-from-to="{
    baked: true,
    options: { translate: true, scale: true },
  }"
/>
```

## Example

```ts
const container = ref<HTMLElement>();
const { set } = useGsap();

set(container, { x: -100 });
```

[gsap-href]: https://gsap.com/
