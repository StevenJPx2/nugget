import type { Simplify } from "../../types";
import {
  type TransitionOutput,
  type UseConstructTransitionOptions,
} from "./construct";
import type { AnimationOptions } from "../baked/types";
import { generateAnimationTweens } from "../baked/utils";
import { useGenericTransition } from "./generic";

export type UseBakedTransitionOptions = Simplify<
  {
    /** Options for the baked transition */
    animationOptions: AnimationOptions;
  } & UseConstructTransitionOptions
>;

/**
 * Composable to create baked transitions
 */
export function useBakedTransition(
  options: UseBakedTransitionOptions,
): TransitionOutput {
  const {
    animationOptions,
    direction = "bottom",
    ...constructOptions
  } = options;
  const { from, to } = generateAnimationTweens(animationOptions);
  const output = useGenericTransition({
    strategy: "from-to",
    from: { ...from, duration: 0.4, ease: "power2" },
    to: { ...to, duration: 0.6, ease: "expo.out" },
    direction,
    ...constructOptions,
  });

  return output;
}
