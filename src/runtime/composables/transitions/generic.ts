import { toRef, tryOnMounted, unref, unrefElement, watch } from "#imports";
import type { Simplify } from "../../types";
import { type StrongTweenVars, useGsap } from "../use-gsap";
import {
  useConstructTransition,
  type TransitionOutput,
  type UseConstructTransitionOptions,
} from "./construct";

export type UseGenericTransitionOptions = Simplify<
  { from: StrongTweenVars; to: StrongTweenVars } & UseConstructTransitionOptions
>;
/**
 * Composable to create generic transitions
 */
export function useGenericTransition(
  options: UseGenericTransitionOptions,
): TransitionOutput {
  const { from, to, ...constructOptions } = options;
  const container = toRef(constructOptions.parentContainer);

  const { set } = useGsap();

  const { enterTl, leaveTl, ...output } =
    useConstructTransition(constructOptions);

  tryOnMounted(() => {
    set(container, from);
  });

  watch(
    () => [unrefElement(container), unref(enterTl), unref(leaveTl)] as const,
    ([parent, eTl, lTl]) => {
      if (!parent || !eTl || !lTl) return;

      eTl.fromTo(parent, from, to);

      lTl.fromTo(parent, to, from);
    },
    { immediate: true, flush: "post" },
  );

  return output;
}
