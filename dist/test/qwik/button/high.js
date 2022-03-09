import { __merge } from "./med.js";

import { useLexicalScope } from "@builder.io/qwik";


export const MyComponent_onClick_0 = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
   alert("WORKS!");

};

