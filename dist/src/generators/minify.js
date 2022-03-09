"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minify = void 0;
function minify(messageParts) {
    var expressions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        expressions[_i - 1] = arguments[_i];
    }
    var text = '';
    for (var i = 0; i < messageParts.length; i++) {
        var part = messageParts[i];
        text += part;
        if (i < expressions.length) {
            text += expressions[i];
        }
    }
    return text
        .replace('\n', ' ')
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
        .replace(/\s+/g, ' ')
        .replace(/\s?([,;\:\-\{\}\(\)\<\>])\s?/g, function (_, match) { return match; });
}
exports.minify = minify;
