const useLexicalScope = require("@builder.io/qwik").useLexicalScope;
exports.MyComponent_onClick_0 = (event) => {
  const state = useLexicalScope()[0];
  try {
    return (state.data = state.data + 1);
  } catch (err) {
    console.warn("Builder code error", err);
  }
};
