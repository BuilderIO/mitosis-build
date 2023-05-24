"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectCss = void 0;
var object_hash_1 = __importDefault(require("object-hash"));
var traverse_1 = __importDefault(require("traverse"));
var dash_case_1 = require("../dash-case");
var is_mitosis_node_1 = require("../is-mitosis-node");
var helpers_1 = require("./helpers");
var trimClassStr = function (classStr) { return classStr.trim().replace(/\s{2,}/g, ' '); };
var updateClassForNode = function (item, className) {
    if (item.bindings.class) {
        // combine className with existing binding. We use single quotes because in Vue, bindings are wrapped in double quotes
        // e.g. <div :class="_classStringToObject(this.className + ' div-21azgz5avex')" />
        item.bindings.class.code = trimClassStr("".concat(item.bindings.class.code, " + ' ").concat(className, "'"));
    }
    else {
        item.properties.class = trimClassStr("".concat(item.properties.class || '', " ").concat(className));
    }
};
var collectStyles = function (json, options) {
    if (options === void 0) { options = {}; }
    var styleMap = {};
    var componentIndexes = {};
    var componentHashes = {};
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, helpers_1.nodeHasCss)(item)) {
                var value = (0, helpers_1.parseCssObject)((_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code);
                delete item.bindings.css;
                var componentName = item.properties.$name
                    ? (0, dash_case_1.dashCase)(item.properties.$name)
                    : /^h\d$/.test(item.name || '') // don't dashcase h1 into h-1
                        ? item.name
                        : (0, dash_case_1.dashCase)(item.name || 'div');
                var classNameWPrefix = "".concat(componentName).concat(options.prefix ? "-".concat(options.prefix) : '');
                var stylesHash = (0, object_hash_1.default)(value);
                if (componentHashes[componentName] === stylesHash) {
                    var className_1 = classNameWPrefix;
                    updateClassForNode(item, className_1);
                    return;
                }
                if (!componentHashes[componentName]) {
                    componentHashes[componentName] = stylesHash;
                }
                var index = (componentIndexes[componentName] =
                    (componentIndexes[componentName] || 0) + 1);
                var className = "".concat(classNameWPrefix).concat(index === 1 ? '' : "-".concat(index));
                updateClassForNode(item, className);
                styleMap[className] = value;
            }
            delete item.bindings.css;
        }
    });
    return styleMap;
};
var collectCss = function (json, options) {
    var _a;
    if (options === void 0) { options = {}; }
    var styles = collectStyles(json, options);
    // TODO create and use a root selector
    var css = '';
    css += !!((_a = json.style) === null || _a === void 0 ? void 0 : _a.length) ? "".concat(json.style, "\n") : '';
    css += classStyleMapToCss(styles);
    return css;
};
exports.collectCss = collectCss;
var classStyleMapToCss = function (map) {
    var str = '';
    var _loop_1 = function (key) {
        var styles = (0, helpers_1.getStylesOnly)(map[key]);
        str += ".".concat(key, " {\n").concat((0, helpers_1.styleMapToCss)(styles), "\n}");
        var nestedSelectors = (0, helpers_1.getNestedSelectors)(map[key]);
        for (var nestedSelector in nestedSelectors) {
            var value = nestedSelectors[nestedSelector];
            if (nestedSelector.startsWith('@')) {
                str += "".concat(nestedSelector, " { .").concat(key, " { ").concat((0, helpers_1.styleMapToCss)(value), " } }");
            }
            else {
                var getSelector = function (nestedSelector) {
                    if (nestedSelector.startsWith(':')) {
                        return ".".concat(key).concat(nestedSelector);
                    }
                    if (nestedSelector.includes('&')) {
                        return nestedSelector.replace(/&/g, ".".concat(key));
                    }
                    return ".".concat(key, " ").concat(nestedSelector);
                };
                str += "".concat(getSelector(nestedSelector), " {\n").concat((0, helpers_1.styleMapToCss)(value), "\n}");
            }
        }
    };
    for (var key in map) {
        _loop_1(key);
    }
    return str;
};
