"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropsRef = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
function getPropsRef(json, shouldRemove) {
    var has = false;
    var prop = '';
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            var binding = item.bindings.ref;
            var regexp = /(.+)?props\.(.+)( |\)|;|\()?$/;
            if (binding && regexp.test(binding.code)) {
                var match = regexp.exec(binding.code);
                var _prop = match === null || match === void 0 ? void 0 : match[2];
                if (_prop) {
                    prop = _prop;
                }
                if (shouldRemove) {
                    delete item.bindings.ref;
                }
                has = true;
                this.stop();
            }
        }
    });
    return [prop, has];
}
exports.getPropsRef = getPropsRef;
