"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCss = void 0;
var lodash_1 = require("lodash");
function mapToCss(map, spaces, important, uewNewLine) {
    if (spaces === void 0) { spaces = 2; }
    if (important === void 0) { important = false; }
    if (uewNewLine === void 0) { uewNewLine = spaces > 1; }
    return (0, lodash_1.reduce)(map, function (memo, value, key) {
        return (memo +
            (value && value.trim()
                ? "".concat(uewNewLine ? '\n' : '').concat(' '.repeat(spaces)).concat((0, lodash_1.kebabCase)(key), ": ").concat(value + (important ? ' !important' : ''), ";")
                : ''));
    }, '');
}
exports.mapToCss = mapToCss;
