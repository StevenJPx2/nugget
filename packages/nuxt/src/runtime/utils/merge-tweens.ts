import type { FromToTweens } from "../types";

export function mergeTweens(...tweens: FromToTweens[]) {
  const mergedTweens: FromToTweens = {};

  for (const tweensObj of tweens) {
    for (const tween in tweensObj) {
      mergedTweens[tween] = tweensObj[tween];
    }
  }

  return mergedTweens;
}
