"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectStyledComponents = void 0;
var lodash_1 = require("lodash");
var object_hash_1 = __importDefault(require("object-hash"));
var traverse_1 = __importDefault(require("traverse"));
var capitalize_1 = require("../capitalize");
var is_mitosis_node_1 = require("../is-mitosis-node");
var is_upper_case_1 = require("../is-upper-case");
var helpers_1 = require("./helpers");
var collectStyledComponents = function (json) {
    var styledComponentsCode = '';
    var componentIndexes = {};
    var componentHashes = {};
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, helpers_1.nodeHasCss)(item)) {
                var value = (0, helpers_1.parseCssObject)((_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code);
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
                var styles = (0, helpers_1.getStylesOnly)(value);
                var stylesHash = (0, object_hash_1.default)(styles);
                if (stylesHash === componentHashes[componentName]) {
                    return;
                }
                if (!componentHashes[componentName]) {
                    componentHashes[componentName] = stylesHash;
                }
                str += "".concat((0, helpers_1.styleMapToCss)(styles), "\n");
                var nestedSelectors = (0, helpers_1.getNestedSelectors)(value);
                for (var nestedSelector in nestedSelectors) {
                    var value_1 = nestedSelectors[nestedSelector];
                    str += "".concat(nestedSelector, " { ").concat((0, helpers_1.styleMapToCss)(value_1), " }");
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
