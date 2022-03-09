"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isChildren(node) {
    return ("".concat(node.bindings._text || '').replace(/\s+/g, '') === 'props.children');
}
exports.default = isChildren;
