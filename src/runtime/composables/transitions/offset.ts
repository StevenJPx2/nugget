import type { MaybeComputedElementRef } from "@vueuse/core";
import type { Simplify } from "../../types";
import useConstructTransition, {
  type UseConstructTransitionOptions,
} from "./transition";
import { watch, unrefElement } from "#imports";

export type OffsetOptions = Simplify<
  {
    mainContainer: MaybeComputedElementRef<HTMLElement | null | undefined>;
    offsetContainer: MaybeComputedElementRef<HTMLElement | null | undefined>;
  } & UseConstructTransitionOptions
>;

export default function useOffsetTransition(options: OffsetOptions) {
  const { mainContainer, offsetContainer, ...constructOptions } = options;
  const { enterTl, leaveTl, ...output } =
    useConstructTransition(constructOptions);

  watch(
    () =>
      [
        unrefElement(mainContainer),
        unrefElement(offsetContainer),
        unrefElement(constructOptions.parentContainer),
      ] as const,
    ([main, offset, parent]) => {
      if (!main || !offset || !parent) return;
      enterTl
        .set(parent, { overflow: "hidden", position: "relative" })
        .set(main, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          scaleX: 0,
          transformOrigin: "left",
        })
        .set(offset, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          scaleX: 0,
          transformOrigin: "left",
        })
        .to(main, { duration: 0.8, ease: "power4.inOut", scaleX: 1 })
        .to(offset, { duration: 0.8, ease: "power4.inOut", scaleX: 1 }, 0.1);
      leaveTl
        .set(main, { transformOrigin: "right" })
        .set(offset, { transformOrigin: "right" })
        .to(offset, { duration: 0.8, ease: "power4.out", scaleX: 0 })
        .to(main, { duration: 0.8, ease: "power4.out", scaleX: 0 }, 0.1);
    },
    { immediate: true, flush: "post" },
  );

  return output;
}
