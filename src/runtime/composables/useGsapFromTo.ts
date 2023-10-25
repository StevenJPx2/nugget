import type { MaybeElementOrElementListRefOrGetter } from "../types";
import { toValue, watch, shallowRef, tryOnMounted } from "#imports";
import useGsap from "./useGsap";

type UseGsapFromToOptions = { from: gsap.TweenVars; to: gsap.TweenVars };

export default function (
  el: MaybeElementOrElementListRefOrGetter,
  options: UseGsapFromToOptions,
) {
  const gsap = useGsap();
  const tween = shallowRef<gsap.core.Tween>();

  const update = () => {
    const unrefEl = toValue(el);
    if (!unrefEl) return;
    tween.value = gsap.fromTo(unrefEl, options.from, options.to);
  };

  tryOnMounted(update);
  watch(() => toValue(el), update, { immediate: true, flush: "post" });
  return tween;
}
