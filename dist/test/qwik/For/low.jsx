import { h, qrl, withScopedStylesQrl } from "@builder.io/qwik";
export const MyComponent_styles = `.cvdfnp5{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:0px;padding-left:20px;padding-right:20px;padding-top:50px;padding-bottom:50px;width:100vw;margin-left:calc(50% - 50vw)}.cz5wnof{width:100%;align-self:stretch;flex-grow:1;box-sizing:border-box;max-width:1200px;display:flex;flex-direction:column;align-items:stretch;margin-left:auto;margin-right:auto}.cdrk993{text-align:center}`;
export const MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
    undefined;
  }
  withScopedStylesQrl(qrl("./low.js", "MyComponent_styles", []));
  return (
    <div class="cvdfnp5" maxWidth={1200}>
      <section class="cz5wnof">
        {(state.simpleList.results || []).map(
          function (__value__) {
            var state = Object.assign({}, this, {
              resultsItem: __value__ == null ? {} : __value__,
            });
            return (
              <div class="cdrk993">
                <div
                  class="builder-text"
                  innerHTML={(() => {
                    try {
                      var _virtual_index = state.resultsItem.data.title;
                      return _virtual_index;
                    } catch (err) {
                      console.warn("Builder code error", err);
                    }
                  })()}
                ></div>
              </div>
            );
          }.bind(state)
        )}
      </section>
    </div>
  );
};
