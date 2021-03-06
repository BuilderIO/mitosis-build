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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToReactNative = exports.collectReactNativeStyles = void 0;
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var fast_clone_1 = require("../helpers/fast-clone");
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var react_1 = require("./react");
var stylePropertiesThatMustBeNumber = new Set(['lineHeight']);
var MEDIA_QUERY_KEY_REGEX = /^@media.*/;
var collectReactNativeStyles = function (json) {
    var styleMap = {};
    var componentIndexes = {};
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if (!(0, is_mitosis_node_1.isMitosisNode)(item) || typeof ((_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code) !== 'string') {
            return;
        }
        var value = json5_1.default.parse(item.bindings.css.code);
        delete item.bindings.css;
        if (!(0, lodash_1.size)(value)) {
            return;
        }
        // Style properties like `"20px"` need to be numbers like `20` for react native
        for (var key in value) {
            var propertyValue = value[key];
            if (key.match(MEDIA_QUERY_KEY_REGEX)) {
                console.warn('Unsupported: skipping media queries for react-native: ', key, propertyValue);
                delete value[key];
                continue;
            }
            if (stylePropertiesThatMustBeNumber.has(key) && typeof propertyValue !== 'number') {
                console.warn("Style key ".concat(key, " must be a number, but had value `").concat(propertyValue, "`"));
                delete value[key];
                continue;
            }
            // convert strings to number if applicable
            if (typeof propertyValue === 'string' && propertyValue.match(/^\d/)) {
                var newValue = parseFloat(propertyValue);
                if (!isNaN(newValue)) {
                    value[key] = newValue;
                }
            }
        }
        var componentName = (0, lodash_1.camelCase)(item.name || 'view');
        var index = (componentIndexes[componentName] = (componentIndexes[componentName] || 0) + 1);
        var className = "".concat(componentName).concat(index);
        item.bindings.style = { code: "styles.".concat(className) };
        styleMap[className] = value;
    });
    return styleMap;
};
exports.collectReactNativeStyles = collectReactNativeStyles;
// Plugin to convert DOM tags to <View /> and <Text />
function processReactNative() {
    return function () { return ({
        json: {
            pre: function (json) {
                (0, traverse_1.default)(json).forEach(function (node) {
                    var _a, _b, _c, _d;
                    if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
                        // TODO: handle TextInput, Image, etc
                        if (node.name.toLowerCase() === node.name) {
                            node.name = 'View';
                        }
                        if (((_a = node.properties._text) === null || _a === void 0 ? void 0 : _a.trim().length) || ((_d = (_c = (_b = node.bindings._text) === null || _b === void 0 ? void 0 : _b.code) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.length)) {
                            node.name = 'Text';
                        }
                        if (node.properties.class) {
                            delete node.properties.class;
                        }
                        if (node.properties.className) {
                            delete node.properties.className;
                        }
                        if (node.bindings.class) {
                            delete node.bindings.class;
                        }
                        if (node.bindings.className) {
                            delete node.bindings.className;
                        }
                    }
                });
            },
        },
    }); };
}
var componentToReactNative = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var component = _a.component, path = _a.path;
        var json = (0, fast_clone_1.fastClone)(component);
        return (0, react_1.componentToReact)(__assign(__assign({}, options), { plugins: (options.plugins || []).concat([processReactNative()]), stylesType: options.stylesType || 'react-native', type: 'native' }))({ component: json, path: path });
    };
};
exports.componentToReactNative = componentToReactNative;
