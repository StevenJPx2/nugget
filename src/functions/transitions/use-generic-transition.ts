import { toRef, unref, unrefElement, watch } from "#imports";
import type { Simplify, StrongTweenVars } from "../../types";
import { useGsap } from "../use-gsap";
import {
  useConstructTransition,
  type TransitionOutput,
  type UseConstructTransitionOptions,
} from "./use-construct-transition";

export type UseGenericTransitionOptions = Simplify<
  {
    /** The initial state of the element */
    initial: StrongTweenVars;
    /** The entered state of the element */
    enter: StrongTweenVars;
    /** The exiting state of the element */
    exit: StrongTweenVars;
  } & UseConstructTransitionOptions
>;
/**
 * Composable to create generic transitions
 * @remarks
 * - This transition uses the `initial`, `enter`, and `exit` states to create a transition
 * - This allows you to create a transition reasonably easily, but does not give you as much control as {@link useConstructTransition}
 * @see {@link useBakedTransition}for a transition that uses this composable
 */
export function useGenericTransition(
  options: UseGenericTransitionOptions,
): TransitionOutput {
  const container = toRef(options.parentContainer);

  const { set: setGsap } = useGsap();

  const { initial, enter, exit, ...constructOptions } = options;

  const { enterTl, leaveTl, ...output } =
    useConstructTransition(constructOptions);

  setGsap(container, enter);

  watch(
    () => [unrefElement(container), unref(enterTl), unref(leaveTl)] as const,
    ([parent, eTl, lTl]) => {
      if (!parent || !eTl || !lTl) return;

      eTl.fromTo(parent, initial, enter);

      lTl.fromTo(parent, enter, exit);
    },
    { immediate: true, flush: "post" },
  );

  return output;
}
