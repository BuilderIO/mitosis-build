"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function Comp() {
    (0, mitosis_1.onMount)(function () {
        console.log('Runs on mount');
    });
    (0, mitosis_1.onUnMount)(function () {
        console.log('Runs on unMount');
    });
    return <div />;
}
exports.default = Comp;
