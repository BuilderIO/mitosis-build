"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isChildren(_a) {
    var _b;
    var node = _a.node, _c = _a.extraMatches, extraMatches = _c === void 0 ? [] : _c;
    var textValue = ((_b = node.bindings._text) === null || _b === void 0 ? void 0 : _b.code) || node.properties.__text || '';
    var trimmedTextValue = textValue.replace(/\s+/g, '');
    return ['props.children', 'children'].concat(extraMatches).includes(trimmedTextValue);
}
exports.default = isChildren;
