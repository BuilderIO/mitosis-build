const Fragment = require("@builder.io/qwik").Fragment;
const componentQrl = require("@builder.io/qwik").componentQrl;
const h = require("@builder.io/qwik").h;
const qrl = require("@builder.io/qwik").qrl;
const withScopedStylesQrl = require("@builder.io/qwik").withScopedStylesQrl;
exports.MyComponent_styles = `.cjrqfb1{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;line-height:normal;height:auto;text-align:center}.c9nzze9{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;appearance:none;padding-top:15px;padding-bottom:15px;padding-left:25px;padding-right:25px;background-color:#3898EC;color:white;border-radius:4px;text-align:center;cursor:pointer}`;
exports.MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    if (!state.hasOwnProperty("data")) state.data = 0;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  withScopedStylesQrl(qrl("./med.js", "MyComponent_styles", []));
  return (
    <>
      <div class="cjrqfb1">
        <div
          class="builder-text"
          innerHTML={(() => {
            try {
              var _virtual_index = state.data;
              return _virtual_index;
            } catch (err) {
              console.warn("Builder code error", err);
            }
          })()}
        ></div>
      </div>
      <CoreButton
        builder-id="builder-6f8fe6a1d2284f2890ae97657eed084a"
        text="Something else"
        class="c9nzze9"
        onClickQrl={qrl("./high.js", "MyComponent_onClick_0", [state])}
      ></CoreButton>
    </>
  );
};
exports.MyComponent = componentQrl(qrl("./med.js", "MyComponent_onMount", []));
const CoreButton = (exports.CoreButton = function CoreButton(props) {
  var hasLink = !!props.link;
  var hProps = {
    innerHTML: props.text || "",
    href: props.link,
    target: props.openInNewTab ? "_blank" : "_self",
    class: props.class,
  };
  return h(
    hasLink ? "a" : props.tagName$ || "span",
    __passThroughProps__(hProps, props)
  );
});
const __passThroughProps__ = (exports.__passThroughProps__ =
  function __passThroughProps__(dstProps, srcProps) {
    for (var key in srcProps) {
      if (
        Object.prototype.hasOwnProperty.call(srcProps, key) &&
        ((key.startsWith("on") && key.endsWith("Qrl")) || key == "style")
      ) {
        dstProps[key] = srcProps[key];
      }
    }
    return dstProps;
  });
