"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MultipleOnUpdate() {
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs on every update/rerender');
    });
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs on every update/rerender as well');
    });
    return <div />;
}
exports.default = MultipleOnUpdate;
