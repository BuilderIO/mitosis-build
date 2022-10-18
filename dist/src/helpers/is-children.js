"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isChildren(node) {
    var _a;
    var textValue = ((_a = node.bindings._text) === null || _a === void 0 ? void 0 : _a.code) || node.properties.__text || '';
    var trimmedTextValue = textValue.replace(/\s+/g, '');
    return ['props.children', 'children'].includes(trimmedTextValue);
}
exports.default = isChildren;
