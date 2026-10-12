import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import type { ShallowRef } from "vue";
import {
  shallowRef,
  tryOnScopeDispose,
  whenever,
} from "#imports";

type SplitTextTarget = HTMLElement | SVGElement;
type ElementLike = { readonly nodeType: number };
type RefLike = { readonly value: unknown };

/** Vue refs are structural so host apps and local modules can use different Vue installs. */
export type MaybeSplitTextTarget =
  | ElementLike
  | null
  | undefined
  | RefLike
  | (() => unknown);

type MaybeBoolean = boolean | RefLike | (() => unknown);

function resolveValue(value: unknown): unknown {
  if (typeof value === "function") return (value as () => unknown)();
  if (value && typeof value === "object" && "nodeType" in value) return value;
  if (value && typeof value === "object" && "value" in value) return value.value;
  return value;
}

/** Resolve an element source without relying on the host's copy of Vue. */
export function resolveSplitTextTarget(el: MaybeSplitTextTarget): SplitTextTarget | undefined {
  const target = resolveValue(el);
  return target && typeof target === "object" && "nodeType" in target
    ? (target as SplitTextTarget)
    : undefined;
}

/** Options for `useSplitText`, passed straight to `SplitText.create` */
export type UseSplitTextOptions = Omit<SplitText.Vars, "onSplit" | "type"> & {
  /** What to split into, such as `"words, chars"` (SplitText's own default applies when omitted) */
  type?: string;
  /** Wait to split until this is true (useful when loading a specific font first) */
  when?: MaybeBoolean;
  /**
   * Runs every time the text is split, including re-splits from `autoSplit`
   * @remarks Return a tween or timeline so SplitText reverts and time-syncs it on re-split
   */
  onSplit?: (self: SplitText) => gsap.core.Animation | void;
};

export type UseSplitTextReturn = {
  split: ShallowRef<SplitText | undefined>;
  chars: ShallowRef<Element[] | undefined>;
  words: ShallowRef<Element[] | undefined>;
  lines: ShallowRef<Element[] | undefined>;
  masks: ShallowRef<Element[] | undefined>;
};

/**
 * Splits text with GSAP's `SplitText`
 * @param el - The element or ref to split
 * @param options - `SplitText` vars
 * @remarks
 * - Splits once the element is available, and reverts when the scope is disposed
 * - The refs follow re-splits, so prefer `onSplit` for animations when `autoSplit` is on
 * @example
 * ```ts
 * const title = ref<HTMLElement>();
 * const { chars } = useSplitText(title, { type: "words, chars", mask: "chars" });
 * ```
 */
export function useSplitText(
  el: MaybeSplitTextTarget,
  options: UseSplitTextOptions = {},
): UseSplitTextReturn {
  const split = shallowRef<SplitText>();
  const chars = shallowRef<Element[]>();
  const words = shallowRef<Element[]>();
  const lines = shallowRef<Element[]>();
  const masks = shallowRef<Element[]>();

  let animation: gsap.core.Animation | void;

  whenever(
    () =>
      resolveValue(options.when ?? true)
        ? resolveSplitTextTarget(el)
        : undefined,
    (target) => {
      gsap.registerPlugin(SplitText);

      // SplitText accepts a returned animation from onSplit, though its types say void
      split.value = SplitText.create(target, {
        ...options,
        onSplit: (self: SplitText) => {
          chars.value = self.chars;
          words.value = self.words;
          lines.value = self.lines;
          masks.value = self.masks;
          animation = options.onSplit?.(self);

          return animation;
        },
      } as SplitText.Vars);
    },
    { immediate: true, once: true, flush: "post" },
  );

  tryOnScopeDispose(() => {
    animation?.revert();
    split.value?.revert();
  });

  return { split, chars, words, lines, masks };
}
