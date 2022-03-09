"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlAttributeEscape = void 0;
function htmlAttributeEscape(value) {
    return value.replace(/"/g, '&quot;').replace(/\n/g, '\\n');
}
exports.htmlAttributeEscape = htmlAttributeEscape;
