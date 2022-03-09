import { Image, __merge } from "./med.js";

import { h, qrl, useLexicalScope } from "@builder.io/qwik";


export const MyComponent_styles = `
  .cvk52jt{
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    margin-top: 20px;
    min-height: 20px;
    min-width: 20px;
    overflow: hidden;
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
      Image,
      {
        image: "https://cdn.builder.io/api/v1/image/assets%2F23dfd7cef1104af59f281d58ec525923%2F4ecf7b7554464b0183ab8250f67e797b",
        backgroundSize: "cover",
        backgroundPosition: "center",
        class: "cvk52jt",
        lazy: true,
        fitContent: true,
        aspectRatio: 1,
        height: 1300,
        width: 1300
      }
    )
  );
};
