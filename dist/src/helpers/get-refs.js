"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRefs = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
var getRefs = function (json) {
    var refs = new Set();
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if (typeof ((_a = item.bindings.ref) === null || _a === void 0 ? void 0 : _a.code) === 'string') {
                refs.add(item.bindings.ref.code);
            }
        }
    });
    return refs;
};
exports.getRefs = getRefs;
