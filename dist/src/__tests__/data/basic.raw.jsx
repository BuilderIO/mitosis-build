"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_VALUES = void 0;
var mitosis_1 = require("@builder.io/mitosis");
exports.DEFAULT_VALUES = {
    name: 'Steve',
};
function MyBasicComponent() {
    var state = (0, mitosis_1.useState)({
        name: 'Steve',
        underscore_fn_name: function () {
            return 'bar';
        },
    });
    return (<div class="test" css={{
            padding: '10px',
        }}>
      <input value={exports.DEFAULT_VALUES.name || state.name} onChange={function (myEvent) { return (state.name = myEvent.target.value); }}/>
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>);
}
exports.default = MyBasicComponent;
