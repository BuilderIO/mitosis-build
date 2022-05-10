"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function OnInit() {
    (0, mitosis_1.onInit)(function () {
        console.log('Runs once every update/rerender');
    });
    return <div />;
}
exports.default = OnInit;
