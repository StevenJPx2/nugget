import type { BakedPresetsArray } from "../types";

export const transformBakedArrayToObject = <const T extends BakedPresetsArray>(
  v: T,
) =>
  Object.fromEntries(
    v.map((val) => {
      const [key, value] = val.split(":");
      return [key, value === undefined ? true : value];
    }),
  ) as {
    [P in T[number] as P extends `${infer K}:${string}`
      ? K
      : P]: P extends `${string}:${infer V}` ? V : true;
  };
