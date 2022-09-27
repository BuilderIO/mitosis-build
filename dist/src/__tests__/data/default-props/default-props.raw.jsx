"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function Button(props) {
    (0, mitosis_1.useDefaultProps)({
        text: 'default text',
        link: 'https://builder.io/',
        openLinkInNewTab: false,
    });
    return (<>
      <mitosis_1.Show when={props.link}>
        <a {...props.attributes} href={props.link} target={props.openLinkInNewTab ? '_blank' : undefined}>
          {props.text}
        </a>
      </mitosis_1.Show>
      <mitosis_1.Show when={!props.link}>
        <button {...props.attributes} type="button">
          {props.text}
        </button>
      </mitosis_1.Show>
    </>);
}
exports.default = Button;
