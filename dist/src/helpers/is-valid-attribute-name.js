"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAttributeName = void 0;
var isValidAttributeName = function (str) {
    return Boolean(str && /^[a-z0-9\-_:]+$/i.test(str));
};
exports.isValidAttributeName = isValidAttributeName;
