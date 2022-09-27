"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function OnInit() {
    (0, mitosis_1.onInit)(function () {
        console.log('onInit');
    });
    (0, mitosis_1.onMount)(function () {
        console.log('onMount');
    });
    return <div />;
}
exports.default = OnInit;
