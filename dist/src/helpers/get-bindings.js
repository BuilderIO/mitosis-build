"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBindingsCode = void 0;
function getBindingsCode(children) {
    var bindings = [];
    children.forEach(function (child) {
        Object.values(child.bindings || []).forEach(function (binding) {
            bindings.push(binding.code);
        });
        if (child.children) {
            bindings.push.apply(bindings, getBindingsCode(child.children));
        }
    });
    return bindings;
}
exports.getBindingsCode = getBindingsCode;
