"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function ClassNameCode(props) {
    var state = (0, mitosis_1.useState)({
        bindings: 'a binding',
    });
    return (<div>
      {/*// @ts-ignore */}
      <div className="no binding">Without Binding</div>
      {/*// @ts-ignore */}
      <div className={state.bindings}>With binding</div>
    </div>);
}
exports.default = ClassNameCode;
