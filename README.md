# Nugget

Democratise premium animations using nugget. See the [module README](./packages/nuxt/README.md) for usage and the [documentation](https://nugget.stevenjohn.co).

In development, Nugget adds a tab to Nuxt DevTools where you can watch, scrub and edit every animation, then copy a prompt that has your coding agent make the edits in code. See [Devtools](./packages/nuxt/README.md#devtools).

![Nugget devtools: hovering a button plays a transition, which appears in the waterfall; editing its ease in the inspector replays it, and the app uses the edit](./packages/nuxt/src/public/devtools-demo.gif)

## Repository structure

| Path | Contents |
|---|---|
| `packages/nuxt` | `@fdcn/nugget`, the Nuxt module, with its tests and docs site |
| `packages/nuxt/devtools-panel` | The Nugget tab for Nuxt DevTools, built into the module's `dist` |
| `playground` | A Nuxt app for trying the module locally |

## Development

```bash
bun install
bun run dev:prepare
bun run dev
```

The other scripts (`dev:build`, `lint`, `test`, `test:watch`, `release`, `docs:dev`) also run from the repository root. Releases are published from `packages/nuxt`.
