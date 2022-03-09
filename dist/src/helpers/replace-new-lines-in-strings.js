"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripNewlinesInStrings = void 0;
function stripNewlinesInStrings(string) {
    var inString = null;
    return string
        .split('')
        .map(function (char, index) {
        if (inString) {
            if (char === '\n') {
                return ' ';
            }
        }
        // Prior char is escape char and the char before that is not escaping it
        var isEscaped = string[index - 1] === '\\' && string[index - 2] !== '\\';
        if (!inString && (char === '"' || char === "'") && !isEscaped) {
            inString = char;
        }
        else if (inString && char === inString && !isEscaped) {
            inString = null;
        }
        return char;
    })
        .join('');
}
exports.stripNewlinesInStrings = stripNewlinesInStrings;
