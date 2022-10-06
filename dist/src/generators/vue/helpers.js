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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBinding = exports.getContextNames = exports.renameMitosisComponentsToKebabCase = exports.encodeQuotes = exports.invertBooleanExpression = exports.getOnUpdateHookName = exports.addBindingsToJson = exports.addPropertiesToJson = void 0;
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var addPropertiesToJson = function (properties) {
    return function (json) { return (__assign(__assign({}, json), { properties: __assign(__assign({}, json.properties), properties) })); };
};
exports.addPropertiesToJson = addPropertiesToJson;
var addBindingsToJson = function (bindings) {
    return function (json) { return (__assign(__assign({}, json), { bindings: __assign(__assign({}, json.bindings), bindings) })); };
};
exports.addBindingsToJson = addBindingsToJson;
var ON_UPDATE_HOOK_NAME = 'onUpdateHook';
var getOnUpdateHookName = function (index) { return ON_UPDATE_HOOK_NAME + "".concat(index); };
exports.getOnUpdateHookName = getOnUpdateHookName;
var invertBooleanExpression = function (expression) { return "!Boolean(".concat(expression, ")"); };
exports.invertBooleanExpression = invertBooleanExpression;
function encodeQuotes(string) {
    return string.replace(/"/g, '&quot;');
}
exports.encodeQuotes = encodeQuotes;
// Transform <FooBar> to <foo-bar> as Vue2 needs
var renameMitosisComponentsToKebabCase = function (str) {
    return str.replace(/<\/?\w+/g, function (match) { return match.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); });
};
exports.renameMitosisComponentsToKebabCase = renameMitosisComponentsToKebabCase;
function getContextNames(json) {
    return Object.keys(json.context.get);
}
exports.getContextNames = getContextNames;
// TODO: migrate all stripStateAndPropsRefs to use this here
// to properly replace context refs
function processBinding(_a) {
    var code = _a.code, options = _a.options, json = _a.json, _b = _a.includeProps, includeProps = _b === void 0 ? true : _b;
    return (0, replace_identifiers_1.replaceIdentifiers)({
        code: (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
            includeState: true,
            includeProps: includeProps,
            replaceWith: function (name) {
                if (name === 'children' || name.startsWith('children.')) {
                    return 'this.$slots.default';
                }
                return 'this.' + name;
            },
        }),
        from: getContextNames(json),
        to: function (name) { return (options.api === 'options' ? "this.".concat(name) : "".concat(name, ".value")); },
    });
}
exports.processBinding = processBinding;
