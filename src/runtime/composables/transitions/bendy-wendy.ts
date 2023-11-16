import { unrefElement, type MaybeComputedElementRef } from "@vueuse/core";
import { watch } from "#imports";
import useConstructTransition, {
  type UseConstructTransitionOptions,
} from "./transition";
import type { Simplify } from "../../types";

export type BendyWendyOptions = Simplify<
  {
    /** The SVG to animate */
    svg: MaybeComputedElementRef<SVGElement>;
    /** The path to animate */
    path: MaybeComputedElementRef<SVGPathElement>;
  } & UseConstructTransitionOptions
>;

export default function useBendyWendyTransition(options: BendyWendyOptions) {
  const { svg, path, ...constructOptions } = options;
  const { enterTl, leaveTl, ...output } =
    useConstructTransition(constructOptions);

  watch(
    () => [unrefElement(svg), unrefElement(path)] as const,
    ([svg, path]) => {
      if (!svg || !path) return;
      enterTl
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

      leaveTl
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
