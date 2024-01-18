import type { Simplify } from "../types";
import {
  type TransitionOutput,
  type UseConstructTransitionOptions,
} from "./construct";
import type { AnimationOptions } from "../../utils/baked/types";
import { generateAnimationTweens } from "../../utils/baked";
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
    initial: from,
    enter: { ...to, duration: 0.6, ease: "expo.out" },
    exit: { ...from, duration: 0.3, ease: "power2.in" },
    direction,
    ...constructOptions,
  });

  return output;
}
