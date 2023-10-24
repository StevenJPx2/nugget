export type Direction = "bottom" | "top" | "left" | "right";
type EaseFunction =
  | "power1"
  | "power2"
  | "power3"
  | "power4"
  | "back"
  | "circ"
  | "expo"
  | "sine";

type ExpressiveEaseFunctions =
  | "linear"
  | "none"
  | "elastic"
  | "bounce"
  | "rough"
  | "slow"
  | `steps(${number})`;

type EaseType = "in" | "out" | "inOut";

export type Ease =
  | `${EaseFunction}.${EaseType}`
  | EaseFunction
  | ExpressiveEaseFunctions;
