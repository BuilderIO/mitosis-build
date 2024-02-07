"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEmptyTextNodes = exports.isEmptyTextNode = void 0;
var isEmptyTextNode = function (node) {
    return typeof node.properties._text === 'string' && node.properties._text.trim().length === 0;
};
exports.isEmptyTextNode = isEmptyTextNode;
var filterEmptyTextNodes = function (node) { return !(0, exports.isEmptyTextNode)(node); };
exports.filterEmptyTextNodes = filterEmptyTextNodes;
