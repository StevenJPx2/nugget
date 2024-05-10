import { type MaybeComputedElementRef, unrefElement } from "@vueuse/core";
import { unref, watch } from "#imports";
import {
  type TransitionOutput,
  type UseConstructTransitionOptions,
  useConstructTransition,
} from "../use-construct-transition";

export type BendyWendyOptions = {
  /** The SVG to animate */
  svg: MaybeComputedElementRef<SVGElement | null | undefined>;
  /** The path to animate */
  path: MaybeComputedElementRef<SVGPathElement | null | undefined>;
} & Omit<UseConstructTransitionOptions, "parentContainer">;

/**
 * Composable to create bendy wendy transitions
 * @remarks
 * This transition uses the `path` element to create a bendy wendy animation; it's a bit like a liquid animation.
 */
export function useBendyWendyTransition(
  options: BendyWendyOptions,
): TransitionOutput {
  const { svg, path, direction = "top", ...constructOptions } = options;
  const { enterTl, leaveTl, ...output } = useConstructTransition({
    parentContainer: svg,
    direction,
    ...constructOptions,
  });

  watch(
    () =>
      [
        unrefElement(svg),
        unrefElement(path),
        unref(enterTl),
        unref(leaveTl),
      ] as const,
    ([svg, path, eTl, lTl]) => {
      if (!svg || !path || !eTl || !lTl) return;
      eTl
        .set(svg, {
          width: "100%",
          height: "100%",
          position: "absolute",
          attr: { viewBox: "0 0 100 100", preserveAspectRatio: "none" },
        })
        .set(path, {
          attr: {
            d: "M 0 0 V 0 Q 50 0 100 0 V 0 z",
            "vector-effect": "non-scaling-stroke",
          },
        })
        .to(path, {
          duration: 0.8,
          ease: "power4.in",
          attr: { d: "M 0 0 V 70 Q 50 80 100 70 V 0 z" },
        })
        .to(path, {
          duration: 0.3,
          ease: "power2",
          attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
        });

      lTl
        .set(path, {
          attr: { d: "M 0 0 V 100 Q 50 100 100 100 V 0 z" },
        })
        .to(path, {
          duration: 0.2,
          ease: "power3.in",
          attr: { d: "M 0 0 V 70 Q 50 60 100 70 V 0 z" },
        })
        .to(path, {
          duration: 0.2,
          ease: "power2",
          attr: { d: "M 0 0 V 0 Q 50 0 100 0 V 0 z" },
        });
    },
    { immediate: true, flush: "post" },
  );

  return output;
}
