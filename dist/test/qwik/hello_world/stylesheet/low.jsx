import { h, qrl, withScopedStylesQrl } from "@builder.io/qwik";
export const MyComponent_styles = `.crt27f8{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:123px;line-height:normal;height:auto;text-align:center;margin-left:auto;margin-right:auto}`;
export const MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  withScopedStylesQrl(qrl("./low.js", "MyComponent_styles", []));
  return (
    <div class="crt27f8">
      <p>
        Hello <span class="names">World</span>
      </p>
    </div>
  );
};
