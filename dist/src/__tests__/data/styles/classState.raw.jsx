"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicComponent() {
    var _a = (0, mitosis_1.useState)('testClassName'), classState = _a[0], setClassState = _a[1];
    return (<div class={classState} css={{
            padding: '10px',
        }}>
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>);
}
exports.default = MyBasicComponent;
