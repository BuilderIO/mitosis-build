"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToAttributes = void 0;
var lodash_1 = require("lodash");
// This list is not exhaustive of all HTML boolean attributes, but we can add more in the future if needed.
var booleanHTMLAttributes = new Set(['checked', 'disabled', 'selected']);
function mapToAttributes(map) {
    if (!(0, lodash_1.size)(map)) {
        return '';
    }
    return (0, lodash_1.reduce)(map, function (memo, value, key) {
        var attributeValue = " ".concat(key, "=\"").concat(value, "\"");
        if (booleanHTMLAttributes.has(key) && value) {
            attributeValue = " ".concat(value);
        }
        return memo + attributeValue;
    }, '');
}
exports.mapToAttributes = mapToAttributes;
