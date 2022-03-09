import { __merge } from "./med.js";

import { h, qrl, useLexicalScope } from "@builder.io/qwik";


export const MyComponent_styles = `
  .crt27f8{
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    margin-top: 123px;
    line-height: normal;
    height: auto;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const MyComponent_onRender = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  return (
    <div class="crt27f8">
      <p>Hello <span class="names">World</span></p>
</div>
  );
};
