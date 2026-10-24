# Offset

Adds a custom offset effect.

## Composable

```ts
useOffsetTransition({
  /* options */
});
```

## Component

### Example

```vue
<offset-transition
  class="red h-full w-full"
  :run="runTransition"
  :direction="direction"
  :main-container-attributes="{ style: { background: 'red' } }"
  :offset-container-attributes="{ style: { background: 'blue' } }"
  @after-leave="runTransition = false"
  @after-enter="onAfterEnter"
/>
```

### Preview

![Offset Preview](/offset-transition.gif)
