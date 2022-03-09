import { component, createStore, h, qrl, withScopedStyles } from "@builder.io/qwik";


export const __merge = function __merge(state,props,create){if(create === void 0){create = false;}for(var key in props){if(key.indexOf(':')==-1 && !key.startsWith('__')&& Object.prototype.hasOwnProperty.call(props,key)){state[key] = props[key];}}if(create && typeof __STATE__ == 'object' && props.serverStateId){Object.assign(state,__STATE__[props.serverStateId]);}return state;};
export const MyComponent_onMount = (__props__) => {
  const __state__ = createStore({});
  const state = __merge(__state__, __props__,true);
  ;withScopedStyles(qrl("./low.js", "MyComponent_styles", []))
  return qrl("./low.js", "MyComponent_onRender", [__props__,__state__]);
};
export const MyComponent = component(qrl("./med.js", "MyComponent_onMount", []));
export const CoreButton = function CoreButton(props){var hasLink = !!props.link;var hProps ={innerHTML:props.text || '',href:props.link,target:props.openInNewTab ? '_blank':'_self',class:props.class,};return h(hasLink ? 'a':props.tagName$ || 'span',hProps);};
