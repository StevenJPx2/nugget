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

**`timeline` Usage**
```js
const {
  tl, // exposed timeline object
  tlFn, //
  play, //
  pause, //
  restart, //
  resume, //
  progress, //
  seek, //
} = timeline({ scrollTrigger: ".container", paused: true });
```



[gsap-href]: https://gsap.com/

