import {
  tryOnMounted,
  tryOnScopeDispose,
  onMounted,
  ref,
  nextTick,
  watch,
  toValue,
  toRef,
} from "#imports";
import { defaultWindow, type MaybeComputedElementRef } from "@vueuse/core";
import LocomotiveScroll from "locomotive-scroll";
import type { ILocomotiveScrollOptions } from "locomotive-scroll/dist/types/types";

export default function (options: ILocomotiveScrollOptions = {}) {
  const ls = ref<LocomotiveScroll>();

  tryOnMounted(() => {
    nextTick(() => {
      if (!defaultWindow) return;
      ls.value = new LocomotiveScroll(options);
    });
  });

  watch(
    toRef(defaultWindow),
    (val) => {
      if (!val) return;
      ls.value = new LocomotiveScroll(options);
    },
    { flush: "post", immediate: true },
  );

  watch(ls, (val) => {
    console.log(val);
  });

  tryOnScopeDispose(() => ls.value?.destroy());

  return ls;
}
