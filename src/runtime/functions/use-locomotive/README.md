# `useLocomotive`

This composable adds [Locomotive Scroll][loco-href] to Vue while keeping it SSR friendly.

::: warning
This will not inject the basic styles that [lenis][lenis-href] (which is used in Locomotive Scroll).
If you want to use it, wrap the root of your app in [`<Locomotive />`](#component).
:::

## Usage

First install `locomotive-scroll`:

:::code-group

```bash [npm]
npm i -D locomotive-scroll@beta
```

```bash [yarn]
yarn add -D locomotive-scroll@beta
```

```bash [pnpm]
pnpm i -D locomotive-scroll@beta
```

```bash [bun]
bun i -D locomotive-scroll@beta
```

:::

Now you can use it by calling `useLocomotive`!

## Example

```ts
useLocomotive();
// running it like this will register it globally
```

## Component

You have lenis styles added in this as well.

### Example

```vue
<locomotive>
  <!-- where you want smooth scroll -->
</locomotive>
```

[loco-href]: https://github.com/locomotivemtl/locomotive-scroll/tree/v5-beta
[lenis-href]: https://github.com/studio-freight/lenis
