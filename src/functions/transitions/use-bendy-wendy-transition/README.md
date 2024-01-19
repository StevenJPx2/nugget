# Bendy Wendy

Adds a custom bendy-wendy effect.

## Composable

```ts
useBendyWendyTransition({
  /* options */
});
```

## Component

### Example

```vue
<bendy-wendy-transition
  class="red h-full w-full"
  :run="runBendyTransition"
  @after-leave="runBendyTransition = false"
  @after-enter="onAfterEnterBendy"
/>
```

### Preview

![Bendy Wendy Preview](/bendy-wendy-transition.gif)
