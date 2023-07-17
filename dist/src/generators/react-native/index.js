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
var traverse_1 = __importDefault(require("traverse"));
var html_tags_1 = require("../../constants/html_tags");
var bindings_1 = require("../../helpers/bindings");
var fast_clone_1 = require("../../helpers/fast-clone");
var is_children_1 = __importDefault(require("../../helpers/is-children"));
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var merge_options_1 = require("../../helpers/merge-options");
var react_1 = require("../react");
var sanitize_react_native_block_styles_1 = require("./sanitize-react-native-block-styles");
var stylePropertiesThatMustBeNumber = new Set(['lineHeight']);
var MEDIA_QUERY_KEY_REGEX = /^@media.*/;
var sanitizeStyle = function (obj) { return function (key, value) {
    var propertyValue = obj[key];
    if (key.match(MEDIA_QUERY_KEY_REGEX)) {
        console.warn('Unsupported: skipping media queries for react-native: ', key, propertyValue);
        delete obj[key];
        return;
    }
}; };
var collectReactNativeStyles = function (json) {
    var styleMap = {};
    var componentIndexes = {};
    var getStyleSheetName = function (item) {
        var componentName = (0, lodash_1.camelCase)(item.name || 'view');
        // If we have already seen this component name, we will increment the index. Otherwise, we will set the index to 1.
        var index = (componentIndexes[componentName] = (componentIndexes[componentName] || 0) + 1);
        return "".concat(componentName).concat(index);
    };
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a, _b, _c;
        if (!(0, is_mitosis_node_1.isMitosisNode)(item)) {
            return;
        }
        var cssValue = json5_1.default.parse(((_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code) || '{}');
        delete item.bindings.css;
        if ((0, lodash_1.size)(cssValue)) {
            // Style properties like `"20px"` need to be numbers like `20` for react native
            for (var key in cssValue) {
                sanitizeStyle(cssValue)(key, cssValue[key]);
                cssValue = (0, sanitize_react_native_block_styles_1.sanitizeReactNativeBlockStyles)(cssValue);
            }
        }
        try {
            var styleValue = json5_1.default.parse(((_b = item.bindings.style) === null || _b === void 0 ? void 0 : _b.code) || '{}');
            if ((0, lodash_1.size)(styleValue)) {
                // Style properties like `"20px"` need to be numbers like `20` for react native
                for (var key in styleValue) {
                    sanitizeStyle(styleValue)(key, styleValue[key]);
                    styleValue = (0, sanitize_react_native_block_styles_1.sanitizeReactNativeBlockStyles)(styleValue);
                }
                item.bindings.style.code = json5_1.default.stringify(styleValue);
            }
        }
        catch (e) { }
        if (!(0, lodash_1.size)(cssValue)) {
            return;
        }
        var styleSheetName = getStyleSheetName(item);
        var styleSheetAccess = "styles.".concat(styleSheetName);
        styleMap[styleSheetName] = cssValue;
        if (!item.bindings.style) {
            item.bindings.style = (0, bindings_1.createSingleBinding)({
                code: styleSheetAccess,
            });
            return;
        }
        try {
            // run the code below only if the style binding is a JSON object
            json5_1.default.parse(item.bindings.style.code || '{}');
            item.bindings.style = (0, bindings_1.createSingleBinding)({
                code: ((_c = item.bindings.style) === null || _c === void 0 ? void 0 : _c.code.replace(/}$/, ", ...".concat(styleSheetAccess, " }"))) || styleSheetAccess,
            });
        }
        catch (e) {
            // if not a JSON, then it's a property, so we should spread it.
            item.bindings.style = (0, bindings_1.createSingleBinding)({
                code: "{\n        ...".concat(styleSheetAccess, ",\n        ...").concat(item.bindings.style.code, "\n        }"),
            });
        }
    });
    return styleMap;
};
exports.collectReactNativeStyles = collectReactNativeStyles;
/**
 * Plugin that handles necessary transformations from React to React Native:
 * - Converts DOM tags to <View /> and <Text />
 * - Removes redundant `class`/`className` attributes
 */
var PROCESS_REACT_NATIVE_PLUGIN = function () { return ({
    json: {
        pre: function (json) {
            (0, traverse_1.default)(json).forEach(function (node) {
                var _a, _b, _c, _d;
                if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
                    // TODO: handle TextInput, Image, etc
                    if ((0, is_children_1.default)({ node: node })) {
                        node.name = '';
                    }
                    else if (node.name.toLowerCase() === node.name && html_tags_1.VALID_HTML_TAGS.includes(node.name)) {
                        node.name = 'View';
                    }
                    else if (((_a = node.properties._text) === null || _a === void 0 ? void 0 : _a.trim().length) ||
                        ((_d = (_c = (_b = node.bindings._text) === null || _b === void 0 ? void 0 : _b.code) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.length)) {
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
var DEFAULT_OPTIONS = {
    stateType: 'useState',
    stylesType: 'react-native',
    plugins: [PROCESS_REACT_NATIVE_PLUGIN],
};
var componentToReactNative = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var component = _a.component, path = _a.path;
        var json = (0, fast_clone_1.fastClone)(component);
        var options = (0, merge_options_1.mergeOptions)(DEFAULT_OPTIONS, _options);
        return (0, react_1.componentToReact)(__assign(__assign({}, options), { type: 'native' }))({ component: json, path: path });
    };
};
exports.componentToReactNative = componentToReactNative;
