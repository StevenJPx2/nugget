# 'Baked' animations

This is a suite of utilities to use **opinionated**, **premium** animations with just adding keys to them.

These presets are globally available in most animating composables.

Each of the keys is `true | string`.

If set to `true`, it will enable its default state, or you can set to animate a different way.

## Preset animations

- Opacity: `in | out | true`, default is `in`.
- Translate: `bottom | top | left | right | true`, default is `bottom`.
- Skew: `bottom | top | left | right | true`, default is `bottom`.
- Scale: `in | out | true`, default is `in`.
- Rotate: `left | right | true`, default is `left`.
- Blur: `in | out | true`, default is `in`.

## Composables

- [useBakedFromTo](/ref/functions/use-gsap/#baked)
- [useBakedAnimateOnScroll](/ref/functions/use-animate-on-scroll/#baked)
- [useBakedSplitTextAnimation](/ref/functions/use-split-text-animation/#baked)
- [useBakedTransition](/ref/functions/transitions/#baked)

## Example

![Video](/nugget-preview.gif)
