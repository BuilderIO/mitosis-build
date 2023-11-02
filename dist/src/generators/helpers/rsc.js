"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfIsClientComponent = void 0;
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var traverse_1 = __importDefault(require("traverse"));
var checkIsNodeAMitosisComponent = function (node) {
    return node.name[0] === node.name[0].toUpperCase();
};
var checkIfIsClientComponent = function (json) {
    var _a, _b;
    if (json.hooks.onMount.length)
        return true;
    if ((_a = json.hooks.onUnMount) === null || _a === void 0 ? void 0 : _a.code)
        return true;
    if ((_b = json.hooks.onUpdate) === null || _b === void 0 ? void 0 : _b.length)
        return true;
    if (Object.keys(json.refs).length)
        return true;
    if (Object.keys(json.context.set).length)
        return true;
    if (Object.keys(json.context.get).length)
        return true;
    if (Object.values(json.state).filter(function (s) { return (s === null || s === void 0 ? void 0 : s.type) === 'property'; }).length)
        return true;
    var foundEventListener = false;
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node) && !checkIsNodeAMitosisComponent(node)) {
            if (Object.keys(node.bindings).filter(function (item) { return item.startsWith('on'); }).length) {
                foundEventListener = true;
                this.stop();
            }
        }
    });
    return foundEventListener;
};
exports.checkIfIsClientComponent = checkIfIsClientComponent;
