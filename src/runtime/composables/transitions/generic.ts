import { toRef, unref, unrefElement, watch } from "#imports";
import type { Simplify } from "../../types";
import { type StrongTweenVars, useGsap } from "../use-gsap";
import {
  useConstructTransition,
  type TransitionOutput,
  type UseConstructTransitionOptions,
} from "./construct";

export type UseGenericTransitionOptions = Simplify<
  (
    | {
        strategy: "from-to";
        /** The initial state of the element */
        from: StrongTweenVars;
        /** The entered state of the element */
        to: StrongTweenVars;
      }
    | {
        strategy: "enter-set-exit";
        /** The initial state of the element */
        enter: StrongTweenVars;
        /** The entered state of the element */
        set: StrongTweenVars;
        /** The exiting state of the element */
        exit: StrongTweenVars;
      }
  ) &
    UseConstructTransitionOptions
>;
/**
 * Composable to create generic transitions
 * @remarks
 * - This transition uses the `from` and `to` variables to animate
 * - The enter and leave will be the same, just in reverse
 * - The `from` is the initial and end, `to` is the entered state
 * - to have separate durations and ease for enter and exit, adjust `to` for entry, and `from` for exit
 *   @see {@link useBakedTransition}for a transition that uses this composable
 */
export function useGenericTransition(
  options: UseGenericTransitionOptions,
): TransitionOutput {
  const container = toRef(options.parentContainer);

  const { set: setGsap } = useGsap();

  if (options.strategy === "from-to") {
    const { from, to, ...constructOptions } = options;

    const { enterTl, leaveTl, ...output } =
      useConstructTransition(constructOptions);

    setGsap(container, from);

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
  } else {
    const { enter, set, exit, ...constructOptions } = options;

    const { enterTl, leaveTl, ...output } =
      useConstructTransition(constructOptions);

    setGsap(container, enter);

    watch(
      () => [unrefElement(container), unref(enterTl), unref(leaveTl)] as const,
      ([parent, eTl, lTl]) => {
        if (!parent || !eTl || !lTl) return;

        eTl.fromTo(parent, enter, set);

        lTl.fromTo(parent, set, exit);
      },
      { immediate: true, flush: "post" },
    );

    return output;
  }
}
