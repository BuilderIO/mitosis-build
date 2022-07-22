"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function NestedShow(props) {
    return (<mitosis_1.Show when={props.conditionA} else={<div>else-condition-A</div>}>
      <mitosis_1.Show when={!props.conditionB} else={<div>else-condition-B</div>}>
        <div>if condition A and condition B</div>
      </mitosis_1.Show>
    </mitosis_1.Show>);
}
exports.default = NestedShow;
