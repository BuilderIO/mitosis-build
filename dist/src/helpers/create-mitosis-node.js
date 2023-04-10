"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMitosisNode = void 0;
var createMitosisNode = function (options) { return (__assign({ '@type': '@builder.io/mitosis/node', name: 'div', meta: {}, scope: {}, properties: {}, bindings: {}, children: [] }, options)); };
exports.createMitosisNode = createMitosisNode;
