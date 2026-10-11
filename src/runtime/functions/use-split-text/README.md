# `useSplitText`

Splits text with GSAP's [SplitText][split-href] once the element is available, and reverts it when the component unmounts.

## Usage

```ts
const title = ref<HTMLElement>();
const { chars, words, lines } = useSplitText(title, {
  type: "words, chars",
  mask: "chars",
});
```

The options are `SplitText` vars. When `autoSplit` is on, create animations in `onSplit` and return them, so SplitText reverts and time-syncs them on every re-split:

```ts
useSplitText(paragraph, {
  type: "lines",
  mask: "lines",
  autoSplit: true,
  onSplit: (self) => gsap.from(self.lines, { yPercent: 100, stagger: 0.1 }),
});
```

[split-href]: https://gsap.com/docs/v3/Plugins/SplitText/
