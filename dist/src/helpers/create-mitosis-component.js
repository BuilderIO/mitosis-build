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
exports.createMitosisComponent = void 0;
var createMitosisComponent = function (options) { return (__assign({ '@type': '@builder.io/mitosis/component', imports: [], exports: {}, inputs: [], meta: {}, refs: {}, state: {}, children: [], hooks: {}, context: { get: {}, set: {} }, name: (options === null || options === void 0 ? void 0 : options.name) || 'MyComponent', subComponents: [] }, options)); };
exports.createMitosisComponent = createMitosisComponent;
