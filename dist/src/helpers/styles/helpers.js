"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleMapToCss = exports.parseCssObject = exports.getStylesOnly = exports.getNestedSelectors = exports.hasStyle = exports.hasCss = exports.nodeHasStyle = exports.nodeHasCss = void 0;
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var dash_case_1 = require("../dash-case");
var is_mitosis_node_1 = require("../is-mitosis-node");
var is_upper_case_1 = require("../is-upper-case");
var nodeHasCss = function (node) {
    var _a;
    return Boolean(typeof ((_a = node.bindings.css) === null || _a === void 0 ? void 0 : _a.code) === 'string' && node.bindings.css.code.trim().length > 6);
};
exports.nodeHasCss = nodeHasCss;
var nodeHasStyle = function (node) {
    var _a;
    return (Boolean(typeof ((_a = node.bindings.style) === null || _a === void 0 ? void 0 : _a.code) === 'string') ||
        Boolean(typeof node.properties.style === 'string'));
};
exports.nodeHasStyle = nodeHasStyle;
var hasCss = function (component) {
    var _a;
    var hasStyles = !!((_a = component.style) === null || _a === void 0 ? void 0 : _a.length);
    if (hasStyles) {
        return true;
    }
    (0, traverse_1.default)(component).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, exports.nodeHasCss)(item)) {
                hasStyles = true;
                this.stop();
            }
        }
    });
    return hasStyles;
};
exports.hasCss = hasCss;
var hasStyle = function (component) {
    var hasStyles = false;
    (0, traverse_1.default)(component).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, exports.nodeHasStyle)(item)) {
                hasStyles = true;
                this.stop();
            }
        }
    });
    return hasStyles;
};
exports.hasStyle = hasStyle;
var getNestedSelectors = function (map) {
    return (0, lodash_1.pickBy)(map, function (value) { return typeof value === 'object'; });
};
exports.getNestedSelectors = getNestedSelectors;
var getStylesOnly = function (map) {
    return (0, lodash_1.pickBy)(map, function (value) { return typeof value === 'string'; });
};
exports.getStylesOnly = getStylesOnly;
var parseCssObject = function (css) {
    try {
        return json5_1.default.parse(css);
    }
    catch (e) {
        console.warn('Could not parse CSS object', css);
        throw e;
    }
};
exports.parseCssObject = parseCssObject;
var getCssPropertyName = function (cssObjectKey) {
    // Allow custom CSS properties
    if (cssObjectKey.startsWith('--')) {
        return cssObjectKey;
    }
    var str = (0, dash_case_1.dashCase)(cssObjectKey);
    // Convert vendor prefixes like 'WebkitFoo' to '-webkit-foo'
    if ((0, is_upper_case_1.isUpperCase)(cssObjectKey[0])) {
        str = "-".concat(str);
    }
    return str;
};
var styleMapToCss = function (map) {
    return Object.entries(map)
        .filter(function (_a) {
        var key = _a[0], value = _a[1];
        return typeof value === 'string';
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return "  ".concat(getCssPropertyName(key), ": ").concat(value, ";");
    })
        .join('\n');
};
exports.styleMapToCss = styleMapToCss;
