<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nugget
- Package name: @fdcn/nugget
- Description: Democratise premium animations using nugget.
-->

# Nugget

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Democratize **premium** animations using nugget.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@fdcn/nugget?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz

### Composables

#### Low-level
- `useGsap`: Exposes [gsap][gsap-href] functions. This is internally used in all the other animation composables.
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
  modules: [
    '@fdcn/nugget'
  ]
})
```

That's it! You can now use Nugget Module in your Nuxt app ✨

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
[locomotive-scroll]: https://github.com/locomotivemtl/locomotive-scroll/tree/v5-beta
