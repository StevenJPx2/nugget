# Nugget

Democratise premium animations using nugget. See the [module README](./packages/nuxt/README.md) for usage and the [documentation](https://nugget.stevenjohn.co).

## Repository structure

| Path | Contents |
|---|---|
| `packages/nuxt` | `@fdcn/nugget`, the Nuxt module, with its tests and docs site |
| `playground` | A Nuxt app for trying the module locally |

## Development

```bash
bun install
bun run dev:prepare
bun run dev
```

The other scripts (`dev:build`, `lint`, `test`, `test:watch`, `release`, `docs:dev`) also run from the repository root. Releases are published from `packages/nuxt`.
