import type { Direction } from "../types";
import type { UseConstructTransitionCallbackOptions } from "./construct";

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

export const callbackFactory = (
  emit: (evt: any) => void,
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
