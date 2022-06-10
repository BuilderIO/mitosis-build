import { useLexicalScope } from "@builder.io/qwik";
export const MyComponent_onClick_0 = (event) => {
  const state = useLexicalScope()[0];
  try {
    return (state.myState = "changed value");
  } catch (err) {
    console.warn("Builder code error", err);
  }
};
