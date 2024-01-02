import { watch, unref, unrefElement, toRef, tryOnMounted } from "#imports";
import { useGsap, type StrongTweenVars } from "../use-gsap";
import type { Simplify } from "../../types";
import {
  useConstructTransition,
  type TransitionOutput,
  type UseConstructTransitionOptions,
} from "./construct";
import type { AnimationOptions } from "../baked/types";
import { generateAnimationTweens } from "../baked/utils";

export type UseBakedTransitionOptions = Simplify<
  {
    /** Options for the baked transition */
    animationOptions: AnimationOptions;
  } & UseConstructTransitionOptions
>;

export function useBakedTransition(
  options: UseBakedTransitionOptions,
): TransitionOutput {
  const {
    animationOptions,
    direction = "bottom",
    parentContainer,
    ...constructOptions
  } = options;
  const container = toRef(parentContainer);
  const { set } = useGsap();
  const { enterTl, leaveTl, ...output } = useConstructTransition({
    parentContainer,
    direction,
    ...constructOptions,
  });
  const { from, to } = generateAnimationTweens(animationOptions);
  tryOnMounted(() => {
    set(container, from);
  });

  watch(
    () => [unrefElement(container), unref(enterTl), unref(leaveTl)] as const,
    ([parent, eTl, lTl]) => {
      if (!parent || !eTl || !lTl) return;
      const toModified: StrongTweenVars = {
        ...to,
        ease: "expo.out",
        scrollTrigger: undefined,
      };

      eTl.fromTo(parent, from, toModified);

      lTl.fromTo(parent, toModified, {
        ...from,
        duration: 0.4,
        ease: "power2",
      });
    },
    { immediate: true, flush: "post" },
  );

  return output;
}
