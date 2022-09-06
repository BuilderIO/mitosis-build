"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function OnUpdateWithDeps(props) {
    var state = (0, mitosis_1.useStore)({
        a: 'a',
        b: 'b',
    });
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs when a, b or size changes', state.a, state.b, props.size);
    }, [state.a, state.b, props.size]);
    return <div />;
}
exports.default = OnUpdateWithDeps;
