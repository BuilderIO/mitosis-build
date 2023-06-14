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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeOptions = exports.mergeOptions = void 0;
var process_target_blocks_1 = require("./plugins/process-target-blocks");
/**
 * Merges options while combining the `plugins` array, and adds any default plugins.
 */
var mergeOptions = function (a, b, c) {
    if (b === void 0) { b = {}; }
    return __assign(__assign(__assign(__assign({}, a), b), c), { plugins: __spreadArray(__spreadArray(__spreadArray([], (a.plugins || []), true), (b.plugins || []), true), ((c === null || c === void 0 ? void 0 : c.plugins) || []), true) });
};
exports.mergeOptions = mergeOptions;
/**
 * Merges options while combining the `plugins` array, and adds any default plugins.
 */
var initializeOptions = function (target, a, b, c) {
    if (b === void 0) { b = {}; }
    var options = (0, exports.mergeOptions)(a, b, c);
    // we want this plugin to run first in every case, as it replaces magic strings with the correct code.
    options.plugins.unshift((0, process_target_blocks_1.processTargetBlocks)(target));
    return options;
};
exports.initializeOptions = initializeOptions;
