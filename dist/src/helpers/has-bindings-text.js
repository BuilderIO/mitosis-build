"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBindingsText = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_children_1 = __importDefault(require("./is-children"));
var is_mitosis_node_1 = require("./is-mitosis-node");
var hasBindingsText = function (json) {
    var has = false;
    (0, traverse_1.default)(json).forEach(function (node) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(node) && !(0, is_children_1.default)({ node: node }) && ((_a = node.bindings._text) === null || _a === void 0 ? void 0 : _a.code)) {
            has = true;
            this.stop();
        }
    });
    return has;
};
exports.hasBindingsText = hasBindingsText;
