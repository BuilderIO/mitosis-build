"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicComponent() {
    var _a = (0, mitosis_1.useState)('testClassName'), classState = _a[0], setClassState = _a[1];
    var _b = (0, mitosis_1.useState)({ color: 'red' }), styleState = _b[0], setStyleState = _b[1];
    return (<div class={classState} css={{
            padding: '10px',
        }} style={styleState}>
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>);
}
exports.default = MyBasicComponent;
