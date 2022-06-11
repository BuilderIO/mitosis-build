"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
// @ts-ignore
function MyBasicComponent(props) {
    var state = (0, mitosis_1.useState)({
        name: 'Decadef20',
    });
    return (<div>
      {props.children} {props.type}
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>);
}
exports.default = MyBasicComponent;
