"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function OnUpdateWithDeps() {
    var state = (0, mitosis_1.useState)({
        a: 'a',
        b: 'b',
    });
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs when a or b changes', state.a, state.b);
    }, [state.a, state.b]);
    return <div />;
}
exports.default = OnUpdateWithDeps;
