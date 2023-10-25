import { useNuxtApp, computed, toReactive } from "#imports";

export default function () {
  const { $gsap } = useNuxtApp();
  const gsapInstance = computed(() => $gsap);
  return toReactive(gsapInstance);
}
