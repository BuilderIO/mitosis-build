"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function RenderStyles(props) {
    return (<mitosis_1.Show when={props.foo === 'bar'} else={<div>Foo</div>}>
      <div>Bar</div>
    </mitosis_1.Show>);
}
exports.default = RenderStyles;
