"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripQuotes = exports.insertAt = exports.uniqueName = void 0;
// helper functions for strings
var lodash_1 = require("lodash");
function uniqueName(existingItems, reference) {
    var index = 0;
    var match = false;
    while (false === match) {
        if (!existingItems.includes(reference)) {
            match = true;
            break;
        }
        index++;
    }
    return (0, lodash_1.camelCase)("".concat(reference).concat(index));
}
exports.uniqueName = uniqueName;
function insertAt(string_, sub, pos) {
    return "".concat(string_.slice(0, pos)).concat(sub).concat(string_.slice(pos));
}
exports.insertAt = insertAt;
function stripQuotes(string_) {
    return string_.replace(/["']+/g, '');
}
exports.stripQuotes = stripQuotes;
