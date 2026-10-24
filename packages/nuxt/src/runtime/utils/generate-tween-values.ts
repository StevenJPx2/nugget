import type { FromToTweens, StrongTweenVars } from "../types";

export function generateTweenValues(
  values: StrongTweenVars | undefined,
): FromToTweens {
  const tweens: FromToTweens = {};
  for (const key in values) {
    tweens[key] = [undefined, values[key]];
  }
  return tweens;
}
