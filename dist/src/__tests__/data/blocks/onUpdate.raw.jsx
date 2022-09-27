"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function OnUpdate() {
    (0, mitosis_1.onUpdate)(function () {
        console.log('Runs on every update/rerender');
    });
    return <div />;
}
exports.default = OnUpdate;
