import { componentQrl, qrl } from "@builder.io/qwik";
export const Todos = componentQrl<any, any>(
  qrl("./low.js", "Todos_onMount", [])
);
