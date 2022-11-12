"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseText = void 0;
var mitosis_node_1 = require("../helpers/mitosis-node");
function parseText(node) {
    return __assign(__assign({}, (0, mitosis_node_1.createMitosisNode)()), { name: 'div', properties: {
            _text: node.data,
        } });
}
exports.parseText = parseText;
