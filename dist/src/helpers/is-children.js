"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isChildren(node) {
    var _a;
    return ("".concat(((_a = node.bindings._text) === null || _a === void 0 ? void 0 : _a.code) || node.properties.__text || '').replace(/\s+/g, '') ===
        'props.children');
}
exports.default = isChildren;
