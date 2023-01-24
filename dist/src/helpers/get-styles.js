"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStyles = exports.getStyles = void 0;
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var bindings_1 = require("./bindings");
var getStyles = function (json) {
    var _a;
    if (!json.bindings.css) {
        return null;
    }
    var css;
    try {
        css = json5_1.default.parse((_a = json.bindings.css) === null || _a === void 0 ? void 0 : _a.code);
    }
    catch (err) {
        console.warn('Could not json 5 parse css', err, json.bindings.css.code);
        return null;
    }
    return css;
};
exports.getStyles = getStyles;
var setStyles = function (json, styles) {
    if (!(0, lodash_1.size)(styles)) {
        delete json.bindings.css;
    }
    else {
        json.bindings.css = (0, bindings_1.createSingleBinding)({ code: json5_1.default.stringify(styles) });
    }
};
exports.setStyles = setStyles;
