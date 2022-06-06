"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBindingsCode = void 0;
function getBindingsCode(children) {
    var bindings = [];
    children.forEach(function (child) {
        if (child.bindings) {
            Object.keys(child.bindings).forEach(function (key) {
                bindings.push(child.bindings[key].code);
            });
        }
        if (child.children) {
            bindings.push.apply(bindings, getBindingsCode(child.children));
        }
    });
    return bindings;
}
exports.getBindingsCode = getBindingsCode;
