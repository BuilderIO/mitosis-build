const h = require("@builder.io/qwik").h;
const qrl = require("@builder.io/qwik").qrl;
const withScopedStylesQrl = require("@builder.io/qwik").withScopedStylesQrl;
exports.MyComponent_styles = `.cjrqfb1{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;line-height:normal;height:auto;text-align:center}`;
exports.MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    if (!state.hasOwnProperty("title")) state.title = '"Default title value"';
    if (!state.hasOwnProperty("hiliteTitle")) state.hiliteTitle = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
    undefined;
  }
  withScopedStylesQrl(qrl("./low.js", "MyComponent_styles", []));
  return h(
    "div",
    {
      class: "cjrqfb1",
      style: {
        backgroundColor: (() => {
          try {
            return state.hilitTitle ? "red" : "gray";
          } catch (err) {
            console.warn("Builder code error", err);
          }
        })(),
      },
    },
    h("div", {
      class: "builder-text",
      innerHTML: (() => {
        try {
          var _virtual_index = state.title;
          return _virtual_index;
        } catch (err) {
          console.warn("Builder code error", err);
        }
      })(),
    })
  );
};
