"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCase = void 0;
var capitalize_1 = require("./capitalize");
/**
 * This is a function similar to loadash `camelCase`, but it does not mess with capitalization.
 *
 * loadash: `camelCase('A-BC')` => "ABc"
 * this fn: `camelCase('A-BC')` => "ABC"
 *
 */
function camelCase(text) {
    if (text === void 0) { text = ''; }
    var parts = text.split('-');
    var first = parts.shift();
    return first + parts.map(capitalize_1.capitalize).join('');
}
exports.camelCase = camelCase;
