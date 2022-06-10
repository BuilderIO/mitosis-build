import { CoreButton } from "./med.js";
import { h, qrl, withScopedStylesQrl } from "@builder.io/qwik";
export const MyComponent_styles = `.c9nzze9{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;appearance:none;padding-top:15px;padding-bottom:15px;padding-left:25px;padding-right:25px;background-color:#3898EC;color:white;border-radius:4px;text-align:center;cursor:pointer}`;
export const MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
    undefined;
  }
  withScopedStylesQrl(qrl("./low.js", "MyComponent_styles", []));
  return h(CoreButton, {
    text: "Click me!",
    class: "c9nzze9",
    onClickQrl: qrl("./high.js", "MyComponent_onClick_0", [state]),
  });
};
