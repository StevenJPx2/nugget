# `transitions/`

These are composables for kick-ass transitions. This could be used to transition between pages, hover effects, components, etc.

## Motivation
This emulates the way Vuejs handles transitions but completely in Javascript.

The `useConstructTransition` composable takes care of this entirely with callbacks for all the states that the transition can be in. This is used in all the other transition composables.

### Why not use native Vue.js transitions?
Well, I came across this issue myself, where I found that I needed to transition **content** but not any components themselves. `<Transition />` albeit being inheritly powerful and one of my favorite features of Vue, does not give any control on **when** the transition should start. It only performs a transition when a `v-if` or any kind of directive that deals with **replacing the DOM via reactivity** is run.

Because of this, this composable will be most useful for:
- Button effects
- Changing content *inside* a component

## Composables

### Low-level
`useConstructTransition` - As explained above, composable used in all the composables below. It gives the most control over every part of the transition.

### Mid-level
`useGenericTransition` - used for constructing simpler transitions. It gives animation control but abstracts away the nitty-gritty of the enter-exit strategy. Useful if you're making a transition with a 1-2-1 or 1-2-3 pattern. See [`useBakedTransition`](../baked.ts) for usage of this composable.

### High-level
- `useBakedTransition` - implements [**baked**](../baked/README.md) animations in transitions. Allows you to easily stack premium animations with no effort.
- `useBendyWendyTransition` - implements a very opinionated transition that looks bendy-wendy.
- `useOffsetTransition` - implements an opinionated offset transition.
