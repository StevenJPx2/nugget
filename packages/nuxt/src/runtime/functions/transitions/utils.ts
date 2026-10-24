import type { Direction } from "../../types";
import type { UseConstructTransitionCallbackOptions } from "./use-construct-transition";

export type TransitionProps = {
  run: boolean;
  direction?: Direction;
};
export type TransitionEmits = {
  enter: [];
  leave: [];
  afterEnter: [];
  afterLeave: [];
  beforeEnter: [];
  beforeLeave: [];
};

type EmitFunctions = {
  [P in keyof TransitionEmits]: (event: P, ...args: TransitionEmits[P]) => void;
};

type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => 0 : never
) extends (arg: infer I) => 0
  ? I
  : never;

export const callbackFactory = (
  emit: UnionToIntersection<EmitFunctions[keyof EmitFunctions]>,
): UseConstructTransitionCallbackOptions => ({
  onEnter() {
    emit("enter");
  },
  onLeave() {
    emit("leave");
  },
  onAfterEnter() {
    emit("afterEnter");
  },
  onAfterLeave() {
    emit("afterLeave");
  },
  onBeforeEnter() {
    emit("beforeEnter");
  },
  onBeforeLeave() {
    emit("beforeLeave");
  },
});
