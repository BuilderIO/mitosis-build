"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterEmptyTextNodes = void 0;
var filterEmptyTextNodes = function (node) {
    return !(typeof node.properties._text === 'string' && !node.properties._text.trim().length);
};
exports.filterEmptyTextNodes = filterEmptyTextNodes;
