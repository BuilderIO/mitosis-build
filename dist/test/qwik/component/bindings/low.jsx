import { ComponentD187055AF171488FAD843ACF045D6BF7, __merge } from "./med.js";

import { Fragment, h, qrl, useLexicalScope } from "@builder.io/qwik";


export const ComponentD187055AF171488FAD843ACF045D6BF7_styles = `
  .cj49hqu{
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    margin-top: 20px;
    height: auto;
    background-color: rgba(227, 227, 227, 1);
    border-radius: 5px;
    border-style: solid;
    border-color: rgb(0, 0, 0);
    border-width: 1px;
    padding-bottom: 30px;
  }
  .cjrqfb1{
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    margin-top: 20px;
    line-height: normal;
    height: auto;
    text-align: center;
  }
`;

export const ComponentD187055AF171488FAD843ACF045D6BF7_onRender = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  return (
    <div class="cj49hqu">
      <div class="cjrqfb1">
        <div class="builder-text"
            innerHTML={(() => {
    try { var _virtual_index=state.title;return _virtual_index }
    catch (err) {
      console.warn('Builder code error', err);
    }
  })()}>
        </div>
      </div>
    </div>
  );
};

export const MyComponent_styles = `
  .c713ty2{
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    margin-top: 20px;
  }
`;

export const MyComponent_onRender = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  return (
    <>
      <div class="c713ty2">
        <ComponentD187055AF171488FAD843ACF045D6BF7 title="First title from parent"
            serverStateId="woo8b6">
        </ComponentD187055AF171488FAD843ACF045D6BF7>
      </div>
      <div class="c713ty2">
        <ComponentD187055AF171488FAD843ACF045D6BF7 title="Second title from parent"
            serverStateId="woo8b6">
        </ComponentD187055AF171488FAD843ACF045D6BF7>
      </div>
    
    </>);
};
