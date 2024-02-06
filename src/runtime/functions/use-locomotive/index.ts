import { ref, tryOnMounted, tryOnScopeDispose, type Ref } from "#imports";
import { defaultWindow } from "@vueuse/core";
import type {
  ILocomotiveScrollOptions,
  default as LocomotiveScroll,
} from "./types";

/** Internal Composable to use `LocomotiveScroll`
 * @param options - The options to pass to `LocomotiveScroll`
 * @remarks
 * - This is a composable that makes `LocomotiveScroll` SSR friendly
 * - This is used in the `SmoothScroll` component
 * - It is not recommended to use this composable directly because the component injects necessary CSS.
 */
export function useLocomotive(
  options: ILocomotiveScrollOptions = {},
): Ref<LocomotiveScroll | undefined> {
  const window = defaultWindow;

  if (!window) return ref(undefined);

  const ls = ref<LocomotiveScroll>();

  const update = async () => {
    if (!window) return;
    // @ts-expect-error typing from the package is incorrect
    const LocomotiveScroll = await import("locomotive-scroll");
    ls.value = new LocomotiveScroll.default({
      ...options,
      lenisOptions: { wrapper: window, ...options.lenisOptions },
    });
  };

  update();
  tryOnMounted(update);

  tryOnScopeDispose(() => {
    try {
      ls.value?.destroy();
    } catch (e) {
      console.error("Failed to destroy LocomotiveScroll", e);
    }
  });

  return ls;
}
