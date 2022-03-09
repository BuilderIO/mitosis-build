import { component, createStore, qrl } from "@builder.io/qwik";


export const __merge = function __merge(state,props,create){if(create === void 0){create = false;}for(var key in props){if(key.indexOf(':')==-1 && !key.startsWith('__')&& Object.prototype.hasOwnProperty.call(props,key)){state[key] = props[key];}}if(create && typeof __STATE__ == 'object' && props.serverStateId){Object.assign(state,__STATE__[props.serverStateId]);}return state;};
export const Todos_onMount = (__props__) => {
  const __state__ = createStore({});
  const state = __merge(__state__, __props__,true);
  ;
  return qrl("./low.js", "Todos_onRender", [__props__,__state__]);
};
export const Todos = component<any, any>(qrl("./med.js", "Todos_onMount", []));
