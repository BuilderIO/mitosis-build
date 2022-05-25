"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleMapToCss = exports.collectCss = exports.collectStyles = exports.parseCssObject = exports.collectStyledComponents = exports.hasStyles = exports.nodeHasStyles = void 0;
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var capitalize_1 = require("./capitalize");
var dash_case_1 = require("./dash-case");
var is_mitosis_node_1 = require("./is-mitosis-node");
var is_upper_case_1 = require("./is-upper-case");
var object_hash_1 = __importDefault(require("object-hash"));
var nodeHasStyles = function (node) {
    var _a;
    return Boolean(typeof ((_a = node.bindings.css) === null || _a === void 0 ? void 0 : _a.code) === 'string' &&
        node.bindings.css.code.trim().length > 6);
};
exports.nodeHasStyles = nodeHasStyles;
var hasStyles = function (component) {
    var hasStyles = false;
    (0, traverse_1.default)(component).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, exports.nodeHasStyles)(item)) {
                hasStyles = true;
                this.stop();
            }
        }
    });
    return hasStyles;
};
exports.hasStyles = hasStyles;
var collectStyledComponents = function (json) {
    var styledComponentsCode = '';
    var componentIndexes = {};
    var componentHashes = {};
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, exports.nodeHasStyles)(item)) {
                var value = (0, exports.parseCssObject)((_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code);
                delete item.bindings.css;
                var normalizedNameProperty = item.properties.$name
                    ? (0, capitalize_1.capitalize)((0, lodash_1.camelCase)(item.properties.$name.replace(/[^a-z]/gi, '')))
                    : null;
                var componentName = normalizedNameProperty
                    ? normalizedNameProperty
                    : /^h\d$/.test(item.name || '')
                        ? item.name
                        : (0, capitalize_1.capitalize)((0, lodash_1.camelCase)(item.name || 'div'));
                var index = (componentIndexes[componentName] =
                    (componentIndexes[componentName] || 0) + 1);
                var className = "".concat(componentName).concat(componentName !== item.name && index === 1 ? '' : index);
                var str = '';
                var styles = getStylesOnly(value);
                var stylesHash = (0, object_hash_1.default)(styles);
                if (stylesHash === componentHashes[componentName]) {
                    return;
                }
                if (!componentHashes[componentName]) {
                    componentHashes[componentName] = stylesHash;
                }
                str += "".concat((0, exports.styleMapToCss)(styles), "\n");
                var nestedSelectors = getNestedSelectors(value);
                for (var nestedSelector in nestedSelectors) {
                    var value_1 = nestedSelectors[nestedSelector];
                    str += "".concat(nestedSelector, " { ").concat((0, exports.styleMapToCss)(value_1), " }");
                }
                var prefix = (0, is_upper_case_1.isUpperCase)(item.name[0])
                    ? "styled(".concat(item.name, ")`")
                    : "styled.".concat(item.name, "`");
                item.name = className;
                styledComponentsCode += "\n          const ".concat(className, " = ").concat(prefix).concat(str, "`\n        ");
            }
            delete item.bindings.css;
        }
    });
    return styledComponentsCode;
};
exports.collectStyledComponents = collectStyledComponents;
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
var collectStyles = function (json, options) {
    if (options === void 0) { options = {}; }
    var styleMap = {};
    var classProperty = options.classProperty || 'class';
    var possibleClasses = ['class', 'className'];
    var componentIndexes = {};
    var componentHashes = {};
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, exports.nodeHasStyles)(item)) {
                var value = (0, exports.parseCssObject)((_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code);
                delete item.bindings.css;
                var componentName = item.properties.$name
                    ? (0, dash_case_1.dashCase)(item.properties.$name)
                    : /^h\d$/.test(item.name || '') // don't dashcase h1 into h-1
                        ? item.name
                        : (0, dash_case_1.dashCase)(item.name || 'div');
                var existedClass = possibleClasses
                    .map(function (prop) { return item.properties[prop]; })
                    .filter(Boolean)
                    .join(' ');
                var stylesHash = (0, object_hash_1.default)(value);
                if (componentHashes[componentName] === stylesHash) {
                    var className_1 = "".concat(componentName).concat(options.prefix ? "-".concat(options.prefix) : '');
                    item.properties[classProperty] = "".concat(existedClass, " ").concat(className_1)
                        .trim()
                        .replace(/\s{2,}/g, ' ');
                    if (classProperty === 'className') {
                        delete item.properties.class;
                    }
                    else {
                        delete item.properties.className;
                    }
                    return;
                }
                if (!componentHashes[componentName]) {
                    componentHashes[componentName] = stylesHash;
                }
                var index = (componentIndexes[componentName] =
                    (componentIndexes[componentName] || 0) + 1);
                var className = "".concat(componentName).concat(options.prefix ? "-".concat(options.prefix) : '').concat(index === 1 ? '' : "-".concat(index));
                item.properties[classProperty] = "".concat(existedClass, " ").concat(className)
                    .trim()
                    .replace(/\s{2,}/g, ' ');
                if (classProperty === 'className') {
                    delete item.properties.class;
                }
                else {
                    delete item.properties.className;
                }
                styleMap[className] = value;
            }
            delete item.bindings.css;
        }
    });
    return styleMap;
};
exports.collectStyles = collectStyles;
var collectCss = function (json, options) {
    if (options === void 0) { options = {}; }
    var styles = (0, exports.collectStyles)(json, options);
    // TODO create and use a root selector
    return classStyleMapToCss(styles);
};
exports.collectCss = collectCss;
var getNestedSelectors = function (map) {
    return (0, lodash_1.pickBy)(map, function (value) { return typeof value === 'object'; });
};
var getStylesOnly = function (map) {
    return (0, lodash_1.pickBy)(map, function (value) { return typeof value === 'string'; });
};
var classStyleMapToCss = function (map) {
    var str = '';
    for (var key in map) {
        var styles = getStylesOnly(map[key]);
        str += ".".concat(key, " { ").concat((0, exports.styleMapToCss)(styles), " }");
        var nestedSelectors = getNestedSelectors(map[key]);
        for (var nestedSelector in nestedSelectors) {
            var value = nestedSelectors[nestedSelector];
            if (nestedSelector.startsWith('@')) {
                str += "".concat(nestedSelector, " { .").concat(key, " { ").concat((0, exports.styleMapToCss)(value), " } }");
            }
            else {
                var useSelector = nestedSelector.includes('&')
                    ? nestedSelector.replace(/&/g, ".".concat(key))
                    : ".".concat(key, " ").concat(nestedSelector);
                str += "".concat(useSelector, " { ").concat((0, exports.styleMapToCss)(value), " }");
            }
        }
    }
    return str;
};
var styleMapToCss = function (map) {
    var str = '';
    for (var key in map) {
        var value = map[key];
        if (typeof value === 'string') {
            str += "\n".concat((0, dash_case_1.dashCase)(key), ": ").concat(value, ";");
        }
        else {
            // TODO: do nothing
        }
    }
    return str;
};
exports.styleMapToCss = styleMapToCss;
