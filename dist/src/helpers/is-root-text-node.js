"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTextNode = exports.isRootTextNode = void 0;
function isRootTextNode(json) {
    var firstChild = json.children[0];
    return Boolean(firstChild && isTextNode(firstChild));
}
exports.isRootTextNode = isRootTextNode;
function isTextNode(node) {
    return Boolean(node.properties._text || node.bindings._text);
}
exports.isTextNode = isTextNode;
