"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
var preSpaceRegex = /^\s*/g;
var DEFAULT_INDENT_SPACES = 2;
/**
 * Generic formatter for languages prettier doesn't support, like Swift
 *
 * Not super sophisticated, but much better than nothing
 */
var format = function (str, indentSpaces) {
    if (indentSpaces === void 0) { indentSpaces = DEFAULT_INDENT_SPACES; }
    var currentIndent = 0;
    var lines = str.split('\n');
    lines.forEach(function (item, index) {
        item = item.trimEnd();
        if (!item) {
            lines[index] = '';
            return;
        }
        lines[index] = item.replace(preSpaceRegex, ' '.repeat(currentIndent * indentSpaces));
        var nextLine = lines[index + 1];
        if (!nextLine) {
            return;
        }
        if (nextLine.match(/^\s*[})][,;]?\s*$/)) {
            currentIndent--;
        }
        else if (item.match(/([({]| in)$/)) {
            currentIndent++;
        }
        currentIndent = Math.max(currentIndent, 0);
    });
    return lines.join('\n').replace(/\n{3,}/g, '\n\n');
};
exports.format = format;
