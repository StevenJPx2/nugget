# `createInfiniteMarquee`

> [!TIP]
> It's recommended to use the [component](#component) because that wraps the component directly.

Add an unstyled infinite marquee to your page.

## Usage

```vue
<script setup lang="ts">
const Marquee = createInfiniteMarquee(props);
</script>

<template>
  <Marquee>
    <div class="flex">
      <p v-for="i in 10" :key="i">WHO I AM</p>
    </div>
  </Marquee>
</template>
```

## Component

```vue
<infinite-marquee>
  <div class="flex">
    <p v-for="i in 10" :key="i">WHO I AM</p>
  </div>
</infinite-marquee>
```

![Infinite Marquee Video](/infinite-marquee.gif)
