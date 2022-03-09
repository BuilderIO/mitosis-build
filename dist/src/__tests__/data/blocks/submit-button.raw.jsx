"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@builder.io/mitosis");
function SubmitButton(props) {
    return (<button {...props.attributes} type="submit">
      {props.text}
    </button>);
}
exports.default = SubmitButton;
