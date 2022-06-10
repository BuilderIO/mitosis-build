import { useLexicalScope } from "@builder.io/qwik";
export const MyComponent_onClick_0 = (event) => {
  const state = useLexicalScope()[0];
  try {
    return (state.visible = !state.visible);
  } catch (err) {
    console.warn("Builder code error", err);
  }
};
