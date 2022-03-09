"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
var capitalize = function (str) {
    if (!str) {
        return str;
    }
    return str[0].toUpperCase() + str.slice(1);
};
exports.capitalize = capitalize;
