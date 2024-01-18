<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nugget
- Package name: @fdcn/nugget
- Description: Democratise premium animations using nugget.
-->

# Nugget

![Nugget](./src/public/nugget-banner.jpg)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Democratize **premium** animations using nugget. Nugget exposes different
headless, unstyled composables and components to allow you to have the
flexibility to animate what you want, but also has sane, beautiful presets that
you do not have to break your head over.

- [✨ Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@fdcn/nugget?file=playground%2Fapp.vue) -->
- [📖 Documentation](https://nugget.stevenjohn.co) ![WIP](https://img.shields.io/badge/%E2%9A%A0%EF%B8%8F-WIP-red)

![Nugget Preview](./src/public/nugget-preview.gif)

## Usage

```vue
<script setup lang="ts">
const container = ref<HTMLDivElement | null>(null);

const { play } = useBakedTransition({
  parentContainer: container,
  animationOptions: {
    translate: true,
    scale: "in",
    skew: "bottom",
  },
});
</script>

<template>
  <button @click="play()">Hello!</button>
  <h1
    v-split-animate="{
      baked: true,
      options: {
        splitBy: 'lines',
        animationOptions: { translate: true },
        splitOptions: {
          wrapping: {
            select: 'lines',
            wrapClass: 'inline-block overflow-hidden',
          },
        },
      },
    }"
  >
    Nuxt is so cool, and this module is quite awesome.
  </h1>
</template>
```

## Quick Setup

1. Add `@fdcn/nugget` dependency to your project

```bash
# Using pnpm
pnpm add -D @fdcn/nugget

# Using yarn
yarn add --dev @fdcn/nugget

# Using npm
npm install --save-dev @fdcn/nugget
```

2. Add `@fdcn/nugget` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["@fdcn/nugget"],
});
```

That's it! You can now use Nugget Module in your Nuxt app ✨

## Roadmap

- [x] Make non-scroll controlled infinite marquee.
- [x] Make hover stop marquee.
- [ ] Button hover effects
- [ ] Image hover effects
- [ ] Tooltip effects
- [ ] Vue version
- [ ] Docs page

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@fdcn/nugget/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@fdcn/nugget
[npm-downloads-src]: https://img.shields.io/npm/dm/@fdcn/nugget.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@fdcn/nugget
[license-src]: https://img.shields.io/npm/l/@fdcn/nugget.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@fdcn/nugget
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
[gsap-href]: https://gsap.com/
[locomotive-href]: https://github.com/locomotivemtl/locomotive-scroll/tree/v5-beta
