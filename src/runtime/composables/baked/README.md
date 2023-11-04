# 'Baked' animations

This is a suite of composables to use **opinionated**, **premium** animations with just adding keys to them.

## Directory structure

```
baked/
├─ animate.ts
├─ index.ts
├─ on-scroll.ts
├─ split-text.ts
├─ types.ts
├─ utils.ts
```

- `animate.ts` - exports `useBakedAnimation`. This will allow you to animate any element with the `fromTo` function from `useGsap`.
- `index.ts` - exports all the composables.
- `on-scroll.ts` - [`useAnimateOnScroll`](../useAnimateOnScroll.ts) but with the baked animation options.
- `split-text.ts` - [`useSplitTextAnimation`](../useSplitTextAnimation.ts) but with the baked animation options.
- `types.ts` - common types used by composables
- `utils.ts` - common utility functions used by composables
