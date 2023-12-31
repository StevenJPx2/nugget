import { ref, tryOnMounted, tryOnScopeDispose, type Ref } from "#imports";
import { defaultWindow } from "@vueuse/core";
import type LocomotiveScroll from "locomotive-scroll";
import type { ILocomotiveScrollOptions } from "locomotive-scroll/dist/types/types";

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
    const LocomotiveScroll = await import("locomotive-scroll");
    ls.value = new LocomotiveScroll.default({
      ...options,
      lenisOptions: { wrapper: window, ...options.lenisOptions },
    });
  };

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
