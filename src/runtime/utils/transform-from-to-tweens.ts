import type { FromToTweens, StrongTweenVars } from "../types";

export function transformFromToTweens(tweens: FromToTweens) {
  const from: StrongTweenVars = {};
  const to: StrongTweenVars = {};

  for (const tweenName in tweens) {
    const [fromVal, toVal] = tweens[tweenName];

    from[tweenName] = fromVal;
    to[tweenName] = toVal;
  }

  return { from, to };
}
