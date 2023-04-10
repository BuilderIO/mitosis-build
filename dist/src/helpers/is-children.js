"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextValue = void 0;
var getTextValue = function (node) {
    var _a;
    var textValue = ((_a = node.bindings._text) === null || _a === void 0 ? void 0 : _a.code) || node.properties.__text || '';
    return textValue.replace(/\s+/g, '');
};
exports.getTextValue = getTextValue;
function isChildren(_a) {
    var node = _a.node, _b = _a.extraMatches, extraMatches = _b === void 0 ? [] : _b;
    var textValue = (0, exports.getTextValue)(node);
    return ['props.children', 'children'].concat(extraMatches).includes(textValue);
}
exports.default = isChildren;
