"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function ContentSlotCode(props) {
    return (<div>
      <mitosis_1.Slot name={props.slotTesting}/>
      <div>
        <hr />
      </div>
      <div>{props.children}</div>
    </div>);
}
exports.default = ContentSlotCode;
