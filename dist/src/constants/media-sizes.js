"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaQueryRegex = exports.sizes = exports.sizeNames = void 0;
exports.sizeNames = ['small', 'medium', 'large'];
exports.sizes = {
    small: {
        min: 320,
        default: 321,
        max: 640,
    },
    medium: {
        min: 641,
        default: 642,
        max: 991,
    },
    large: {
        min: 990,
        default: 991,
        max: 1200,
    },
    getWidthForSize: function (size) {
        return this[size].default;
    },
    getSizeForWidth: function (width) {
        for (var _i = 0, sizeNames_1 = exports.sizeNames; _i < sizeNames_1.length; _i++) {
            var size = sizeNames_1[_i];
            var value = this[size];
            if (width <= value.max) {
                return size;
            }
        }
        return 'large';
    },
};
exports.mediaQueryRegex = /@\s*?media\s*?\(\s*?max-width\s*?:\s*?(\d+)(px)\s*?\)\s*?/;
