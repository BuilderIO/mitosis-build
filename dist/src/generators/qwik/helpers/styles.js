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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderStyles = exports.collectStyles = void 0;
var json5_1 = __importDefault(require("json5"));
var dash_case_1 = require("../../../helpers/dash-case");
function collectStyles(children, styleMap) {
    var _a;
    var nodes = __spreadArray([], children, true);
    while (nodes.length) {
        var child = nodes.shift();
        nodes.push.apply(nodes, child.children);
        var css = (_a = child.bindings.css) === null || _a === void 0 ? void 0 : _a.code;
        if (css && typeof css == 'string') {
            var value = __assign({ CLASS_NAME: 'c' + hashCode(css) }, json5_1.default.parse(css));
            styleMap.set(css, value);
        }
    }
    return styleMap;
}
exports.collectStyles = collectStyles;
function hashCode(text) {
    var hash = 0, i, chr;
    if (text.length === 0)
        return hash;
    for (i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Number(Math.abs(hash)).toString(36);
}
function renderStyles(styles) {
    return function () {
        var _this = this;
        this.emit('`');
        var mediaStyles = [];
        styles.forEach(function (styles) {
            _this.emit('.', styles.CLASS_NAME, /*'.🏷️�', WS,*/ '{');
            for (var key in styles) {
                if (key !== 'CLASS_NAME' && Object.prototype.hasOwnProperty.call(styles, key)) {
                    var value = styles[key];
                    if (value && typeof value == 'object') {
                        mediaStyles.push(styles.CLASS_NAME, key, value);
                    }
                    else {
                        _this.emit((0, dash_case_1.dashCase)(key), ':', value, ';');
                    }
                }
            }
            _this.emit('}');
        });
        while (mediaStyles.length) {
            var className = mediaStyles.shift();
            var mediaKey = mediaStyles.shift();
            var mediaObj = mediaStyles.shift();
            this.emit(mediaKey, '{.', className, /*'.🏷️�',*/ '{');
            for (var key in mediaObj) {
                if (Object.prototype.hasOwnProperty.call(mediaObj, key)) {
                    var value = mediaObj[key];
                    this.emit((0, dash_case_1.dashCase)(key), ':', value, ';');
                }
            }
            this.emit('}}');
        }
        this.emit('`');
    };
}
exports.renderStyles = renderStyles;
