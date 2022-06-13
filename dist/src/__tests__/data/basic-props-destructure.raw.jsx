"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
// @ts-ignore
function MyBasicComponent(_a) {
    var c = _a.children, type = _a.type;
    var state = (0, mitosis_1.useState)({
        name: 'Decadef20',
    });
    return (<div>
      {c} {type}
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>);
}
exports.default = MyBasicComponent;
