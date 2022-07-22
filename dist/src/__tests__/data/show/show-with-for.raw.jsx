"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function NestedShow(props) {
    return (<mitosis_1.Show when={props.conditionA} else={<div>else-condition-A</div>}>
      <mitosis_1.For each={props.items}>{function (item, idx) { return <div key={idx}>{item}</div>; }}</mitosis_1.For>
    </mitosis_1.Show>);
}
exports.default = NestedShow;
