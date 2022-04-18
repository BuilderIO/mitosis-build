"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = void 0;
function indent(str, spaces) {
    if (spaces === void 0) { spaces = 4; }
    return str.replace(/\n([^\n])/g, "\n".concat(' '.repeat(spaces), "$1"));
}
exports.indent = indent;
