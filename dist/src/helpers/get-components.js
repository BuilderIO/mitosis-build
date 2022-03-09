"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponents = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
var is_upper_case_1 = require("./is-upper-case");
function getComponents(json) {
    var components = new Set();
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, is_upper_case_1.isUpperCase)(item.name[0])) {
                components.add(item.name);
            }
        }
    });
    return components;
}
exports.getComponents = getComponents;
