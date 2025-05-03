import { defaultWindow } from "@vueuse/core";
import { type Ref, ref, tryOnMounted, tryOnScopeDispose } from "#imports";
import type * as types from "locomotive-scroll";

/** Internal Composable to use `LocomotiveScroll`
 * @param options - The options to pass to `LocomotiveScroll`
 * @remarks
 * - This is a composable that makes `LocomotiveScroll` SSR friendly
 * - This is used in the `SmoothScroll` component
 * - It is not recommended to use this composable directly because the component injects necessary CSS.
 */
export function useLocomotive(
  options: types.ILocomotiveScrollOptions = {},
): Ref<types.default | undefined> {
  const window = defaultWindow;

  if (!window) return ref(undefined);

  const ls = ref<types.default>();

  const update = async () => {
    if (!window) return;
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
