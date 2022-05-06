"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicForComponent() {
    var state = (0, mitosis_1.useState)({
        name: 'PatrickJS',
        names: ['Steve', 'PatrickJS'],
    });
    return (<div>
      <mitosis_1.For each={state.names}>
        {function (person) { return (<>
            <input value={state.name} onChange={function (event) {
                state.name = event.target.value + ' and ' + person;
            }}/>
            Hello {person}! I can run in Qwik, Web Component, React, Vue, Solid,
            or Liquid!
          </>); }}
      </mitosis_1.For>
    </div>);
}
exports.default = MyBasicForComponent;
