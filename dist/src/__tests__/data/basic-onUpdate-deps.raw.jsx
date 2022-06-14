"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicComponent(props) {
    var state = (0, mitosis_1.useStore)({
        name: 'Steve',
    });
    (0, mitosis_1.onUpdate)(function () {
        console.log('name 1');
        if (state.name === 'Steve') {
            state.name = 'PatrickJS';
        }
    }, [state.name]);
    (0, mitosis_1.onUpdate)(function () {
        console.log('name 2');
        if (state.name === 'PatrickJS') {
            state.name = 'Hi';
        }
    }, [props.name]);
    return (<div>
      <input value={state.name} onChange={function (myEvent) { return (state.name = myEvent.target.value); }}/>
      Hello! I can run in React, Vue, Solid, or Liquid!
    </div>);
}
exports.default = MyBasicComponent;
