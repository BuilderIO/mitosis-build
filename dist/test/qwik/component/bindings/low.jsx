import { ComponentD187055AF171488FAD843ACF045D6BF7 } from "./med.js";
import { Fragment, h, qrl, withScopedStylesQrl } from "@builder.io/qwik";
export const ComponentD187055AF171488FAD843ACF045D6BF7_styles = `.cj49hqu{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;height:auto;background-color:rgba(227, 227, 227, 1);border-radius:5px;border-style:solid;border-color:rgb(0, 0, 0);border-width:1px;padding-bottom:30px}.cjrqfb1{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px;line-height:normal;height:auto;text-align:center}`;
export const ComponentD187055AF171488FAD843ACF045D6BF7_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    if (!state.hasOwnProperty("title")) state.title = "default-title";
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
  }
  withScopedStylesQrl(
    qrl("./low.js", "ComponentD187055AF171488FAD843ACF045D6BF7_styles", [])
  );
  return (
    <div builder-id="builder-139a8479536b4c4f9c2738e724ed0952" class="cj49hqu">
      <div class="cjrqfb1">
        <div
          class="builder-text"
          innerHTML={(() => {
            try {
              var _virtual_index = state.title;
              return _virtual_index;
            } catch (err) {
              console.warn("Builder code error", err);
            }
          })()}
        ></div>
      </div>
    </div>
  );
};
export const MyComponent_styles = `.c713ty2{display:flex;flex-direction:column;position:relative;flex-shrink:0;box-sizing:border-box;margin-top:20px}`;
export const MyComponent_onMount = (state) => {
  if (!state.__INIT__) {
    state.__INIT__ = true;
    typeof __STATE__ === "object" &&
      Object.assign(state, __STATE__[state.serverStateId]);
    (() => {
      /*
       * Global objects available:
       *
       * state - builder state object - learn about state https://www.builder.io/c/docs/guides/state-and-actions
       * context - builder context object - learn about state https://github.com/BuilderIO/builder/tree/main/packages/react#passing-data-and-functions-down
       * fetch - Fetch API - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API'
       * Builder - Builder object - useful values include: Builder.isServer, Builder.isBrowser, Builder.isPreviewing, Builder.isEditing
       *
       * visit https://www.builder.io/c/docs/guides/custom-code
       * for more information on writing custom code
       */
      async function main() {
        if (Builder.isServer) {
          // Place any code here you want to only run on the server. Any
          // data fetched on the server will be available to re-hydrate on the client
          // if added to the state object
        }

        if (Builder.isBrowser) {
          // Place code that you only want to run in the browser (client side only) here
          // For example, anything that uses document/window access or DOM manipulation
        }

        state.something = "works!";
      }

      return main();
    })();
  }
  withScopedStylesQrl(qrl("./low.js", "MyComponent_styles", []));
  return (
    <>
      <div
        builder-id="builder-50b2438beaa4498b985eb9d8a7659afa"
        class="c713ty2"
      >
        <ComponentD187055AF171488FAD843ACF045D6BF7
          builder-id="builder-h3uut6"
          title="First title from parent"
          serverStateId="w8x6w6"
        ></ComponentD187055AF171488FAD843ACF045D6BF7>
      </div>
      <div
        builder-id="builder-33f427415bef4725b0c9fcd4fed325f2"
        class="c713ty2"
      >
        <ComponentD187055AF171488FAD843ACF045D6BF7
          builder-id="builder-bfxc0y"
          title="Second title from parent"
          serverStateId="w8x6w6"
        ></ComponentD187055AF171488FAD843ACF045D6BF7>
      </div>
    </>
  );
};
