import { CoreButton, __merge } from "./med.js";

import { h, qrl, useLexicalScope } from "@builder.io/qwik";


export const MyComponent_styles = `
  .c9nzze9{
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    margin-top: 20px;
    appearance: none;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 25px;
    padding-right: 25px;
    background-color: #3898EC;
    color: white;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
`;

export const MyComponent_onRender = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  return (
    h(
      CoreButton,
      {
        text: "Click me!",
        class: "c9nzze9",
        "on:click": qrl("./high.js", "MyComponent_onClick_0", [__props__, __state__])
      }
    )
  );
};
