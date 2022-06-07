"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicComponent() {
    var state = (0, mitosis_1.useState)({
        name: 'Steve',
    });
    return (<div class="test" css={{
            padding: '10px',
        }}>
      <input value={state.name} onChange={function (myEvent) {
            state.name = myEvent.target.value;
        }}/>
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>);
}
exports.default = MyBasicComponent;
