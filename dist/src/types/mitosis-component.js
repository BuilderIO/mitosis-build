"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsCodeValue = void 0;
var checkIsCodeValue = function (value) {
    return typeof value === 'object' &&
        value &&
        Object.keys(value).length === 2 &&
        'type' in value &&
        'code' in value
        ? ['function', 'getter', 'method'].includes(value.type)
        : false;
};
exports.checkIsCodeValue = checkIsCodeValue;
