"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ContentSlotJsxCode(props) {
    return (<div>
      {props.slotTesting}
      <div>
        <hr />
      </div>
      <div>{props.children}</div>
    </div>);
}
exports.default = ContentSlotJsxCode;
