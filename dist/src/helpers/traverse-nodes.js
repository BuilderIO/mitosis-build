"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseNodes = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
function traverseNodes(component, cb) {
    (0, traverse_1.default)(component).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            cb(item, this);
        }
    });
}
exports.traverseNodes = traverseNodes;
