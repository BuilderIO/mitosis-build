import { Symbol1 } from "./med.js";
import { Fragment, h, qrl, withScopedStylesQrl } from "@builder.io/qwik";
export const MyComponent_styles = `.c713ty2{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px}.cxvcn5v{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;line-height:normal;height:auto;text-align:center;padding-top:1em;padding-bottom:1em;font-weight:700;font-size:24px}`;
export const MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  withScopedStylesQrl(qrl("./low.js", "MyComponent_styles", []));
  return h(
    Fragment,
    null,
    h(Symbol1, {
      class: "c713ty2",
      symbol: {
        model: "page",
        entry: "36da1052e57e47f084ea8b1fbde248e4",
        data: {},
      },
    }),
    h("div", { class: "cxvcn5v" }, "<p>Main Text</p>")
  );
};
