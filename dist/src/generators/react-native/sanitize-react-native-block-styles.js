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
exports.sanitizeReactNativeBlockStyles = void 0;
var propertiesThatMustBeNumber = new Set(['lineHeight']);
var displayValues = new Set(['flex', 'none']);
var normalizeNumber = function (value) {
    if (Number.isNaN(value)) {
        return undefined;
    }
    else if (value < 0) {
        // TODO: why are negative values not allowed?
        return 0;
    }
    else {
        return value;
    }
};
var sanitizeReactNativeBlockStyles = function (styles) {
    return Object.keys(styles).reduce(function (acc, key) {
        var _a, _b, _c;
        var propertyValue = styles[key];
        if (key === 'display' && !displayValues.has(propertyValue)) {
            console.warn("Style value for key \"display\" must be \"flex\" or \"none\" but had ".concat(propertyValue));
            return acc;
        }
        if (propertiesThatMustBeNumber.has(key) && typeof propertyValue !== 'number') {
            console.warn("Style key ".concat(key, " must be a number, but had value `").concat(styles[key], "`"));
            return acc;
        }
        if (typeof propertyValue === 'string') {
            // `px` units need to be stripped and replaced with numbers
            // https://regexr.com/6ualn
            var isPixelUnit = propertyValue.match(/^-?(\d*)(\.?)(\d*)*px$/);
            if (isPixelUnit) {
                var newValue = parseFloat(propertyValue);
                var normalizedValue = normalizeNumber(newValue);
                if (normalizedValue) {
                    return __assign(__assign({}, acc), (_a = {}, _a[key] = normalizedValue, _a));
                }
                else {
                    return acc;
                }
            }
            else if (propertyValue === '0') {
                // 0 edge case needs to be handled
                return __assign(__assign({}, acc), (_b = {}, _b[key] = 0, _b));
            }
        }
        return __assign(__assign({}, acc), (_c = {}, _c[key] = propertyValue, _c));
    }, {});
};
exports.sanitizeReactNativeBlockStyles = sanitizeReactNativeBlockStyles;
