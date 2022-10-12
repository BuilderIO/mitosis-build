"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.has = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
/**
 * Test if the component has something
 *
 * e.g.
 *    const hasSpread = has(component, node => some(node.bindings, { type: 'spread' }));
 */
function has(json, test) {
    var found = false;
    (0, traverse_1.default)(json).forEach(function (thing) {
        if ((0, is_mitosis_node_1.isMitosisNode)(thing)) {
            if (test(thing)) {
                found = true;
                this.stop();
            }
        }
    });
    return found;
}
exports.has = has;
