import gsap from "gsap";
import { defineNuxtPlugin } from "#app";
import { startNuggetPageScript } from "../page-script";

export default defineNuxtPlugin({
  name: "nugget:devtools-page-script",
  // Runs before other plugins so it sees every animation the app creates
  enforce: "pre",
  setup() {
    startNuggetPageScript(gsap);
  },
});
