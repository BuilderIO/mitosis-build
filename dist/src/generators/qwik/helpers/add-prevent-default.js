"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPreventDefault = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("../../../helpers/is-mitosis-node");
/**
 * Find event handlers that explicitly call .preventDefault() and
 * add preventdefault:event
 * https://qwik.builder.io/tutorial/events/preventdefault
 */
function addPreventDefault(json) {
    (0, traverse_1.default)(json).forEach(function (node) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.bindings) {
                for (var _i = 0, _b = Object.keys(node.bindings); _i < _b.length; _i++) {
                    var key = _b[_i];
                    if (key.startsWith('on')) {
                        if ((_a = node.bindings[key]) === null || _a === void 0 ? void 0 : _a.code.includes('.preventDefault()')) {
                            var event_1 = key.slice(2).toLowerCase();
                            node.properties['preventdefault:' + event_1] = '';
                        }
                    }
                }
            }
        }
    });
}
exports.addPreventDefault = addPreventDefault;
