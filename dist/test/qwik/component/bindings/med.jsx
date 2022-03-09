import { component, createStore, qrl, withScopedStyles } from "@builder.io/qwik";


export const __merge = function __merge(state,props,create){if(create === void 0){create = false;}for(var key in props){if(key.indexOf(':')==-1 && !key.startsWith('__')&& Object.prototype.hasOwnProperty.call(props,key)){state[key] = props[key];}}if(create && typeof __STATE__ == 'object' && props.serverStateId){Object.assign(state,__STATE__[props.serverStateId]);}return state;};
export const ComponentD187055AF171488FAD843ACF045D6BF7_onMount = (__props__) => {
  const __state__ = createStore({});
  const state = __merge(__state__, __props__,true);
  ;withScopedStyles(qrl("./low.js", "ComponentD187055AF171488FAD843ACF045D6BF7_styles", []))
  return qrl("./low.js", "ComponentD187055AF171488FAD843ACF045D6BF7_onRender", [__props__,__state__]);
};
export const ComponentD187055AF171488FAD843ACF045D6BF7 = component(qrl("./med.js", "ComponentD187055AF171488FAD843ACF045D6BF7_onMount", []));
export const MyComponent_onMount = (__props__) => {
  const __state__ = createStore({});
  const state = __merge(__state__, __props__,true);
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
  if (Builder.isServer) {// Place any code here you want to only run on the server. Any  
    // data fetched on the server will be available to re-hydrate on the client
    // if added to the state object
  }

  if (Builder.isBrowser) {// Place code that you only want to run in the browser (client side only) here
    // For example, anything that uses document/window access or DOM manipulation
  }

  state.something = "works!";
}

return main();
  })();withScopedStyles(qrl("./low.js", "MyComponent_styles", []))
  return qrl("./low.js", "MyComponent_onRender", [__props__,__state__]);
};
export const MyComponent = component(qrl("./med.js", "MyComponent_onMount", []));
