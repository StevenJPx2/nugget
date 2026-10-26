# Changelog


## v1.2.0

[compare changes](https://github.com/StevenJPx2/nugget/compare/v1.1.0...v1.2.0)

### 🚀 Enhancements

- **devtools:** Inspect page elements and keep animation rows stable during replay ([c0365df](https://github.com/StevenJPx2/nugget/commit/c0365df))

### 🩹 Fixes

- **devtools:** Give Nugget its own dock button so Nuxt DevTools can't take its selection ([9d83e0c](https://github.com/StevenJPx2/nugget/commit/9d83e0c))
- **devtools:** Omit absent staggers from source hints ([12a2191](https://github.com/StevenJPx2/nugget/commit/12a2191))

### 📖 Documentation

- Plan the provider-neutral runtime and DevTools boundary ([f6f42eb](https://github.com/StevenJPx2/nugget/commit/f6f42eb))

### 📦 Build

- Generate Vue component declarations without skipping SFCs ([753e93b](https://github.com/StevenJPx2/nugget/commit/753e93b))

### 🏡 Chore

- Describe the project for stevenjohn.co's resume ([3c62bcf](https://github.com/StevenJPx2/nugget/commit/3c62bcf))

### ❤️ Contributors

- Steven John ([@StevenJPx2](https://github.com/StevenJPx2))

## v1.1.0

[compare changes](https://github.com/StevenJPx2/nugget/compare/v1.0.0...v1.1.0)

### 🚀 Enhancements

- Use native GSAP text splitting and smooth scrolling ([3529141](https://github.com/StevenJPx2/nugget/commit/3529141))
- **devtools:** Show Nugget animations in Nuxt DevTools v4 ([010010f](https://github.com/StevenJPx2/nugget/commit/010010f))
- **devtools:** Inspector with live GSAP edits, icon buttons and scrubbers ([de910a2](https://github.com/StevenJPx2/nugget/commit/de910a2))
- **devtools:** Ease editor with curve gallery, knobs and bezier handles ([477fd3e](https://github.com/StevenJPx2/nugget/commit/477fd3e))
- **devtools:** Copy a prompt that has a coding agent apply devtools edits in code ([dae95a2](https://github.com/StevenJPx2/nugget/commit/dae95a2))
- Build the devtools into @fdcn/nugget, dev only ([a35db85](https://github.com/StevenJPx2/nugget/commit/a35db85))

### 🩹 Fixes

- Prepare module types before building from a fresh clone ([537c7f3](https://github.com/StevenJPx2/nugget/commit/537c7f3))
- Render GSAP marquee safely during SSR ([441406b](https://github.com/StevenJPx2/nugget/commit/441406b))
- Import Vue APIs from the host app to avoid a duplicate runtime ([68a1a05](https://github.com/StevenJPx2/nugget/commit/68a1a05))
- Hide every split line before its staggered animation starts ([db35e43](https://github.com/StevenJPx2/nugget/commit/db35e43))
- Resolve lint errors that block the release build ([1879c9f](https://github.com/StevenJPx2/nugget/commit/1879c9f))
- Declare runtime dependencies the published module imports ([ef94d4f](https://github.com/StevenJPx2/nugget/commit/ef94d4f))
- **devtools:** Play timeline steps on their own and flag targets with no size ([78d168a](https://github.com/StevenJPx2/nugget/commit/78d168a))

### 📖 Documentation

- Plan providers, plugins and devtools ([94f56d7](https://github.com/StevenJPx2/nugget/commit/94f56d7))
- **plan:** Record the devtools mounting and page script decisions ([62bad9f](https://github.com/StevenJPx2/nugget/commit/62bad9f))
- **plan:** Provider plugins in nugget.config.ts and the core design ([2ac8d2e](https://github.com/StevenJPx2/nugget/commit/2ac8d2e))
- **plan:** Keep Effect out of shipped code ([4c5c2a1](https://github.com/StevenJPx2/nugget/commit/4c5c2a1))
- Devtools demo and README section ([81d2e00](https://github.com/StevenJPx2/nugget/commit/81d2e00))

### 🏡 Chore

- **playground:** Replace Tailwind with plain CSS ([073a797](https://github.com/StevenJPx2/nugget/commit/073a797))
- Convert to a Bun workspace monorepo ([c14c07c](https://github.com/StevenJPx2/nugget/commit/c14c07c))
- Update caniuse-lite browser data ([c05d8b2](https://github.com/StevenJPx2/nugget/commit/c05d8b2))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v1.0.0

[compare changes](https://github.com/stevenjpx2/nugget/compare/v1.0.0-beta.2...v1.0.0)

### 🩹 Fixes

- Incompatibility with nuxt build ([4a4ce0d](https://github.com/stevenjpx2/nugget/commit/4a4ce0d))
- **locomotive:** Type issues, depend on locomotive-scroll ([ba1554d](https://github.com/stevenjpx2/nugget/commit/ba1554d))

### 📦 Build

- Externalize tinyglobby ([96bcbb0](https://github.com/stevenjpx2/nugget/commit/96bcbb0))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v1.0.0-beta.2

[compare changes](https://github.com/stevenjpx2/nugget/compare/v1.0.0-beta.1...v1.0.0-beta.2)

### 🚀 Enhancements

- Add BakedPresetsArray to all baked functions, fix rotate crash ([2de8b20](https://github.com/stevenjpx2/nugget/commit/2de8b20))

### 🩹 Fixes

- **docs:** Correct configuration ([d53e11f](https://github.com/stevenjpx2/nugget/commit/d53e11f))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v1.0.0-beta.1

[compare changes](https://github.com/stevenjpx2/nugget/compare/v1.0.0-beta.0...v1.0.0-beta.1)

### 🩹 Fixes

- **docs:** Links ([c658ff4](https://github.com/stevenjpx2/nugget/commit/c658ff4))
- **baked:** Remove export for presets ([d210352](https://github.com/stevenjpx2/nugget/commit/d210352))

### 📖 Documentation

- Update README.md ([2854977](https://github.com/stevenjpx2/nugget/commit/2854977))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v1.0.0-beta.0

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.3.1...v1.0.0-beta.0)

### 🚀 Enhancements

- ⚠️  Revitalize baked format ([39b5220](https://github.com/stevenjpx2/nugget/commit/39b5220))
- Finish new baked format ([b65c469](https://github.com/stevenjpx2/nugget/commit/b65c469))
- Finish custom bakes in config ([#2](https://github.com/stevenjpx2/nugget/pull/2))
- **createInfiniteMarquee:** Create composable ([804411a](https://github.com/stevenjpx2/nugget/commit/804411a))
- **directives:** Add new directives ([#6](https://github.com/stevenjpx2/nugget/pull/6))

### 🩹 Fixes

- **useLocomotive:** Have locomotive scroll in wrapper than in window ([2d72538](https://github.com/stevenjpx2/nugget/commit/2d72538))
- **useLocomotive, useInfiniteMarquee:** Locomotive types, infinite marquee implies child ([52c7fdb](https://github.com/stevenjpx2/nugget/commit/52c7fdb))

### 💅 Refactors

- More typesafety, multiple build type fixes ([b290a91](https://github.com/stevenjpx2/nugget/commit/b290a91))

### 📖 Documentation

- Update path ([91fceb5](https://github.com/stevenjpx2/nugget/commit/91fceb5))
- **roadmap:** Update roadmap ([bdcf1f8](https://github.com/stevenjpx2/nugget/commit/bdcf1f8))
- **directives:** Reorganize directives and update docs ([8964563](https://github.com/stevenjpx2/nugget/commit/8964563))

### 🏡 Chore

- **release:** V0.3.1 ([7dd4a4b](https://github.com/stevenjpx2/nugget/commit/7dd4a4b))
- Create FUNDING.yml ([73d35c5](https://github.com/stevenjpx2/nugget/commit/73d35c5))
- Update issue templates ([4696542](https://github.com/stevenjpx2/nugget/commit/4696542))
- **baked:** Types ([e84a397](https://github.com/stevenjpx2/nugget/commit/e84a397))

#### ⚠️ Breaking Changes

- ⚠️  Revitalize baked format ([39b5220](https://github.com/stevenjpx2/nugget/commit/39b5220))

### ❤️ Contributors

- Steven John ([@StevenJPx2](http://github.com/StevenJPx2))

## v0.3.1

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.3.0...v0.3.1)

### 🩹 Fixes

- Move all working code to runtime/ fixes ([#4](https://github.com/stevenjpx2/nugget/pull/4))

### 📖 Documentation

- **useLocomotive:** Add component ([1044f7b](https://github.com/stevenjpx2/nugget/commit/1044f7b))
- **useBendyWendyTransition, useOffsetTransition:** Add component, composable ([f870c50](https://github.com/stevenjpx2/nugget/commit/f870c50))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.3.0

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.2.0...v0.3.0)

### 🚀 Enhancements

- ⚠️  Simplify runtime to single folder ([55244cc](https://github.com/stevenjpx2/nugget/commit/55244cc))
- ⚠️  Add separate components page, change naming scheme of custom transitions ([368f6a0](https://github.com/stevenjpx2/nugget/commit/368f6a0))

### 🩹 Fixes

- **directives:** Fix locations for baked ([ec3afcd](https://github.com/stevenjpx2/nugget/commit/ec3afcd))
- Generic types are pushed to src ([5fe16b5](https://github.com/stevenjpx2/nugget/commit/5fe16b5))
- Change directives location, move deps ([8bb8467](https://github.com/stevenjpx2/nugget/commit/8bb8467))

### 💅 Refactors

- **baked:** Move baked/ to utils ([1319f96](https://github.com/stevenjpx2/nugget/commit/1319f96))

### 📖 Documentation

- Add vitepress-extras ([e20fa6c](https://github.com/stevenjpx2/nugget/commit/e20fa6c))

#### ⚠️ Breaking Changes

- ⚠️  Simplify runtime to single folder ([55244cc](https://github.com/stevenjpx2/nugget/commit/55244cc))
- ⚠️  Add separate components page, change naming scheme of custom transitions ([368f6a0](https://github.com/stevenjpx2/nugget/commit/368f6a0))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.2.0

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.9...v0.2.0)

### 🚀 Enhancements

- **useGenericTransition:** Create 1-2-3 transitions ([b59ff97](https://github.com/stevenjpx2/nugget/commit/b59ff97))
- **useGenericTransition:** Simplify composable ([a7b9268](https://github.com/stevenjpx2/nugget/commit/a7b9268))
- **docs:** Add docs website ([e5d2984](https://github.com/stevenjpx2/nugget/commit/e5d2984))
- ⚠️  Change baked locations, add baked option to directive ([9920cc6](https://github.com/stevenjpx2/nugget/commit/9920cc6))

### 🩹 Fixes

- **README:** Image ([adad27e](https://github.com/stevenjpx2/nugget/commit/adad27e))

### 📖 Documentation

- **README:** Add docs link ([f9a4a7a](https://github.com/stevenjpx2/nugget/commit/f9a4a7a))
- **website:** Make README as the vitepress pages ([6685423](https://github.com/stevenjpx2/nugget/commit/6685423))
- **fix:** Dead link ([da55a42](https://github.com/stevenjpx2/nugget/commit/da55a42))
- **index:** Add link ([169032c](https://github.com/stevenjpx2/nugget/commit/169032c))
- **vitepress:** Complete auto-generate docs ([0801d64](https://github.com/stevenjpx2/nugget/commit/0801d64))
- **vitepress:** Simplify route rewrite ([ea6fd14](https://github.com/stevenjpx2/nugget/commit/ea6fd14))
- Add more ([520e295](https://github.com/stevenjpx2/nugget/commit/520e295))
- **vitepress:** GenerateSidebar function ([bf0cf5b](https://github.com/stevenjpx2/nugget/commit/bf0cf5b))
- **vitepress:** Add SEO ([ead0671](https://github.com/stevenjpx2/nugget/commit/ead0671))
- **index.md:** Fix get started ([4618634](https://github.com/stevenjpx2/nugget/commit/4618634))
- **README:** Remove redundant documentation ([bb5fc2b](https://github.com/stevenjpx2/nugget/commit/bb5fc2b))

### 🏡 Chore

- **README:** Add banner ([4728118](https://github.com/stevenjpx2/nugget/commit/4728118))

#### ⚠️ Breaking Changes

- ⚠️  Change baked locations, add baked option to directive ([9920cc6](https://github.com/stevenjpx2/nugget/commit/9920cc6))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.9

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.8...v0.1.9)

### 🚀 Enhancements

- **useBakedTransition:** Add new composable ([369cfe5](https://github.com/stevenjpx2/nugget/commit/369cfe5))
- **useGenericTransition:** Add composable for generic from-to transitions ([0dbe5a1](https://github.com/stevenjpx2/nugget/commit/0dbe5a1))

### 📖 Documentation

- **useBakedTransition, useGenericTransition:** Add tsdoc ([267df27](https://github.com/stevenjpx2/nugget/commit/267df27))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.8

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.7...v0.1.8)

### 🚀 Enhancements

- **InfiniteMarquee:** Add pauseOnHover and acceleration ([bbb6309](https://github.com/stevenjpx2/nugget/commit/bbb6309))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.7

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.6...v0.1.7)

### 🚀 Enhancements

- Add transition helpers, improve transition testing ([6b7fa65](https://github.com/stevenjpx2/nugget/commit/6b7fa65))
- Do not reinvoke gsap functions on window resize ([384a603](https://github.com/stevenjpx2/nugget/commit/384a603))

### 🩹 Fixes

- **docs:** Fix structure ([94ac318](https://github.com/stevenjpx2/nugget/commit/94ac318))

### 💅 Refactors

- Change location of composables, update docs ([704a273](https://github.com/stevenjpx2/nugget/commit/704a273))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.6

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.5...v0.1.6)

### 🩹 Fixes

- **useGsap:** Fix types for timeline ([140d184](https://github.com/stevenjpx2/nugget/commit/140d184))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.5

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.4...v0.1.5)

## v0.1.4

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.3...v0.1.4)

### 🩹 Fixes

- Import gsap alone for side-effects ([ed1476a](https://github.com/stevenjpx2/nugget/commit/ed1476a))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.3

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.2...v0.1.3)

### 🩹 Fixes

- Proper global typing of gsap ([9752d51](https://github.com/stevenjpx2/nugget/commit/9752d51))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.2

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.1...v0.1.2)

### 🩹 Fixes

- Add better type safety ([b498caa](https://github.com/stevenjpx2/nugget/commit/b498caa))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.1

[compare changes](https://github.com/stevenjpx2/nugget/compare/v0.1.0...v0.1.1)

### 🚀 Enhancements

- Add transitions, fix types ([a033d2a](https://github.com/stevenjpx2/nugget/commit/a033d2a))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

## v0.1.0


### 🚀 Enhancements

- First commit ([702f6a5](https://github.com/stevenjpx2/nugget/commit/702f6a5))
- InfiniteMarquee component ([b9e5125](https://github.com/stevenjpx2/nugget/commit/b9e5125))
- Add useSplitTextAnimation composable and directive ([ece3e8b](https://github.com/stevenjpx2/nugget/commit/ece3e8b))
- ⚠️  Change word-split to split-animate, full functionality ([e6b59ef](https://github.com/stevenjpx2/nugget/commit/e6b59ef))
- Add animate ([82c2dfa](https://github.com/stevenjpx2/nugget/commit/82c2dfa))
- ⚠️  Add useGsap ([c28266c](https://github.com/stevenjpx2/nugget/commit/c28266c))
- Make smoothscroll fully functional ([573e533](https://github.com/stevenjpx2/nugget/commit/573e533))
- Add scrolltrigger for translate ([98cc636](https://github.com/stevenjpx2/nugget/commit/98cc636))
- Separate baked and generic animation composables ([f594377](https://github.com/stevenjpx2/nugget/commit/f594377))
- **composables/useGsap:** Create workable version of timeline ([4e51a09](https://github.com/stevenjpx2/nugget/commit/4e51a09))
- **transitions:** Add transitions, stabilise infinite marquee ([6e6d739](https://github.com/stevenjpx2/nugget/commit/6e6d739))

### 💅 Refactors

- Add defineTween for creating types ([635bc07](https://github.com/stevenjpx2/nugget/commit/635bc07))

#### ⚠️ Breaking Changes

- ⚠️  Change word-split to split-animate, full functionality ([e6b59ef](https://github.com/stevenjpx2/nugget/commit/e6b59ef))
- ⚠️  Add useGsap ([c28266c](https://github.com/stevenjpx2/nugget/commit/c28266c))

### ❤️ Contributors

- Steven John <stevenjpx2@gmail.com>

