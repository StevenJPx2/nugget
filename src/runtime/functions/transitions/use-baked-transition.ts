import { nuggetBakedPresets } from "#imports";
import { generateAnimationTweens } from "../../baked";
import type { AnimationOptions } from "../../baked/types";
import { transformFromToTweens } from "../../utils";
import type {
  TransitionOutput,
  UseConstructTransitionOptions,
} from "./use-construct-transition";
import { useGenericTransition } from "./use-generic-transition";

export type UseBakedTransitionOptions = {
  /** Options for the baked transition */
  animationOptions: AnimationOptions;
} & UseConstructTransitionOptions;

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
  const { from, to } = transformFromToTweens(
    generateAnimationTweens(animationOptions, nuggetBakedPresets),
  );
  const output = useGenericTransition({
    initial: from,
    enter: { ...to, duration: 0.6, ease: "expo.out" },
    exit: { ...from, duration: 0.3, ease: "power2.in" },
    direction,
    ...constructOptions,
  });

  return output;
}
