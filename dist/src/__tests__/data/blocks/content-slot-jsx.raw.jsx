"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function ContentSlotJsxCode(props) {
    return (<div>
      <mitosis_1.Show when={props.slotTesting}>
        <div>{props.slotTesting}</div>
      </mitosis_1.Show>
      <div>
        <hr />
      </div>
      <div>{props.children}</div>
    </div>);
}
exports.default = ContentSlotJsxCode;
