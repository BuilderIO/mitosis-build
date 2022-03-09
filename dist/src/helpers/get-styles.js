"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStyles = exports.getStyles = void 0;
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var getStyles = function (json) {
    if (!json.bindings.css) {
        return null;
    }
    var css;
    try {
        css = json5_1.default.parse(json.bindings.css);
    }
    catch (err) {
        console.warn('Could not json 5 parse css', err, json.bindings.css);
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
        json.bindings.css = json5_1.default.stringify(styles);
    }
};
exports.setStyles = setStyles;
