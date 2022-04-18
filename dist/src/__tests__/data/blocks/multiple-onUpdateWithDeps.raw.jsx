"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MultipleOnUpdateWithDeps() {
    var state = (0, mitosis_1.useState)({
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd',
    });
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs when a or b changes', state.a, state.b);
    }, [state.a, state.b]);
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs when c or d changes', state.c, state.d);
    }, [state.c, state.d]);
    return <div />;
}
exports.default = MultipleOnUpdateWithDeps;
