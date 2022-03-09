"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function OnUpdateWithDeps() {
    var a, b;
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs when a or b changes');
    }, [a, b]);
    return <div />;
}
exports.default = OnUpdateWithDeps;
