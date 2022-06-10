import { componentQrl, qrl } from "@builder.io/qwik";
export const MyComponent = componentQrl(
  qrl("./low.js", "MyComponent_onMount", [])
);
