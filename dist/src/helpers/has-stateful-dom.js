"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasStatefulDom = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
var hasStatefulDom = function (json) {
    var has = false;
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if (/input|textarea|select/.test(item.name)) {
                has = true;
                this.stop();
            }
        }
    });
    return has;
};
exports.hasStatefulDom = hasStatefulDom;
