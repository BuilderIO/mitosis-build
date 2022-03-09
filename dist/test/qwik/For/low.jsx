import { __merge } from "./med.js";

import { h, qrl, useLexicalScope } from "@builder.io/qwik";


export const MyComponent_styles = `
  .cvdfnp5{
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    margin-top: 0px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 50px;
    padding-bottom: 50px;
    width: 100vw;
    margin-left: calc(50% - 50vw);
  }
  .cz5wnof{
    width: 100%;
    align-self: stretch;
    flex-grow: 1;
    box-sizing: border-box;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-left: auto;
    margin-right: auto;
  }
  .cdrk993{
    text-align: center;
  }
`;

export const MyComponent_onRender = () => {
  const __scope__ = useLexicalScope();
  const __props__ = __scope__[0];
  const __state__ = __scope__[1];
  const state = __merge(__state__, __props__);
  ;
  return (
    <div class="cvdfnp5"
        maxWidth={1200}>
      <section class="cz5wnof">
        { (state.simpleList.results || []).map((function(__value__) {
          var state = Object.assign({}, this, {resultsItem: __value__ == null ? {} : __value__});
          return (<div class="cdrk993">
            <div class="builder-text"
                innerHTML={(() => {
    try { var _virtual_index=state.resultsItem.data.title;return _virtual_index }
    catch (err) {
      console.warn('Builder code error', err);
    }
  })()}>
            </div>
          </div>
          );
        }).bind(state))
        }
      </section>
    </div>
  );
};
