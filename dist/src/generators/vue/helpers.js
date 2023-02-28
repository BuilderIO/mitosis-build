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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextKey = exports.checkIfContextHasStrName = exports.getContextValue = exports.processBinding = exports.getContextNames = exports.renameMitosisComponentsToKebabCase = exports.encodeQuotes = exports.invertBooleanExpression = exports.getOnUpdateHookName = exports.addBindingsToJson = exports.addPropertiesToJson = void 0;
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var function_1 = require("fp-ts/lib/function");
var babel_transform_1 = require("../../helpers/babel-transform");
var core_1 = require("@babel/core");
var lodash_1 = require("lodash");
var patterns_1 = require("../../helpers/patterns");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var slots_1 = require("../../helpers/slots");
var html_tags_1 = require("../../constants/html_tags");
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
    return str.replace(/<\/?\w+/g, function (match) {
        var tagName = match.replaceAll('<', '').replaceAll('/', '');
        if (html_tags_1.VALID_HTML_TAGS.includes(tagName)) {
            return match;
        }
        else {
            return match.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }
    });
};
exports.renameMitosisComponentsToKebabCase = renameMitosisComponentsToKebabCase;
function getContextNames(json) {
    return Object.keys(json.context.get);
}
exports.getContextNames = getContextNames;
function shouldAppendValueToRef(path) {
    var parent = path.parent, node = path.node;
    if (core_1.types.isFunctionDeclaration(parent) && parent.id === node) {
        return false;
    }
    if (core_1.types.isCallExpression(parent)) {
        return false;
    }
    var isMemberExpression = core_1.types.isMemberExpression(parent);
    if (isMemberExpression &&
        core_1.types.isThisExpression(parent.object) &&
        core_1.types.isProgram(path.scope.block) &&
        path.scope.hasReference(node.name)) {
        return false;
    }
    if (isMemberExpression &&
        core_1.types.isIdentifier(parent.object) &&
        core_1.types.isIdentifier(parent.property) &&
        parent.property.name === node.name) {
        return false;
    }
    if (Object.keys(path.scope.bindings).includes(path.node.name)) {
        return false;
    }
    if (path.parentPath.listKey === 'arguments' || path.parentPath.listKey === 'params') {
        return false;
    }
    return true;
}
var getAllRefs = function (component) {
    var refKeys = Object.keys(component.refs);
    var stateKeys = Object.keys((0, lodash_1.pickBy)(component.state, function (i) { return (i === null || i === void 0 ? void 0 : i.type) === 'property'; }));
    var allKeys = __spreadArray(__spreadArray([], refKeys, true), stateKeys, true);
    return allKeys;
};
function processRefs(_a) {
    var input = _a.input, component = _a.component, options = _a.options, thisPrefix = _a.thisPrefix;
    var refs = options.api === 'options' ? getContextNames(component) : getAllRefs(component);
    return (0, babel_transform_1.babelTransformExpression)(input, {
        Identifier: function (path) {
            var name = path.node.name;
            if (refs.includes(name) && shouldAppendValueToRef(path)) {
                var newValue = options.api === 'options' ? "".concat(thisPrefix, ".").concat(name) : "".concat(name, ".value");
                path.replaceWith(core_1.types.identifier(newValue));
            }
        },
    });
}
function prefixMethodsWithThis(input, component, options) {
    if (options.api === 'options') {
        var allMethodNames = Object.entries(component.state)
            .filter(function (_a) {
            var _key = _a[0], value = _a[1];
            return (value === null || value === void 0 ? void 0 : value.type) === 'function';
        })
            .map(function (_a) {
            var key = _a[0];
            return key;
        });
        if (!allMethodNames.length)
            return input;
        return (0, replace_identifiers_1.replaceIdentifiers)({ code: input, from: allMethodNames, to: function (name) { return "this.".concat(name); } });
    }
    else {
        return input;
    }
}
function optionsApiStateAndPropsReplace(name, thisPrefix, codeType) {
    if (codeType === 'bindings') {
        return (0, slots_1.isSlotProperty)(name) ? (0, slots_1.replaceSlotsInString)(name, function (x) { return "$slots.".concat(x); }) : name;
    }
    if (name === 'children' || name.startsWith('children.')) {
        return "".concat(thisPrefix, ".$slots.default");
    }
    return (0, slots_1.isSlotProperty)(name)
        ? (0, slots_1.replaceSlotsInString)(name, function (x) { return "".concat(thisPrefix, ".$slots.").concat(x); })
        : "".concat(thisPrefix, ".").concat(name);
}
// TODO: migrate all stripStateAndPropsRefs to use this here
// to properly replace context refs
var processBinding = function (_a) {
    var code = _a.code, options = _a.options, json = _a.json, _b = _a.preserveGetter, preserveGetter = _b === void 0 ? false : _b, _c = _a.thisPrefix, thisPrefix = _c === void 0 ? 'this' : _c, codeType = _a.codeType;
    try {
        return (0, function_1.pipe)(
        // processed twice, once for props and once for state
        (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
            includeState: false,
            includeProps: true,
            replaceWith: function (name) {
                switch (options.api) {
                    // keep pointing to `props.${value}`
                    case 'composition':
                        if (codeType === 'bindings') {
                            return (0, slots_1.isSlotProperty)(name)
                                ? (0, slots_1.replaceSlotsInString)(name, function (x) { return "$slots.".concat(x); })
                                : name;
                        }
                        if (name === 'children' || name.startsWith('children.')) {
                            return "useSlots().default";
                        }
                        return (0, slots_1.isSlotProperty)(name)
                            ? (0, slots_1.replaceSlotsInString)(name, function (x) { return "useSlots().".concat(x); })
                            : "props.".concat(name);
                    case 'options':
                        return optionsApiStateAndPropsReplace(name, thisPrefix, codeType);
                }
            },
        }), function (code) {
            return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
                includeState: true,
                includeProps: false,
                replaceWith: function (name) {
                    switch (options.api) {
                        case 'composition':
                            return name;
                        case 'options':
                            return optionsApiStateAndPropsReplace(name, thisPrefix, codeType);
                    }
                },
            });
        }, function (x) {
            return (0, function_1.pipe)(x, 
            // bindings does not need process refs and prefix this
            function (code) {
                return codeType === 'bindings'
                    ? code
                    : processRefs({ input: code, component: json, options: options, thisPrefix: thisPrefix });
            }, function (code) { return (codeType === 'bindings' ? code : prefixMethodsWithThis(code, json, options)); }, function (code) { return (preserveGetter === false ? (0, patterns_1.stripGetter)(code) : code); });
        });
    }
    catch (e) {
        console.log('could not process bindings in ', { code: code });
        throw e;
    }
};
exports.processBinding = processBinding;
var getContextValue = function (args) {
    return function (_a) {
        var name = _a.name, ref = _a.ref, value = _a.value;
        var valueStr = value
            ? (0, get_state_object_string_1.stringifyContextValue)(value, {
                valueMapper: function (code) { return (0, exports.processBinding)(__assign(__assign({ code: code }, args), { preserveGetter: true })); },
            })
            : ref
                ? (0, exports.processBinding)(__assign(__assign({ code: ref }, args), { preserveGetter: true }))
                : null;
        return valueStr;
    };
};
exports.getContextValue = getContextValue;
var checkIfContextHasStrName = function (context) {
    // check if the name is wrapped in single or double quotes
    var isStrName = context.name.startsWith("'") || context.name.startsWith('"');
    return isStrName;
};
exports.checkIfContextHasStrName = checkIfContextHasStrName;
var getContextKey = function (context) {
    var isStrName = (0, exports.checkIfContextHasStrName)(context);
    var key = isStrName ? context.name : "".concat(context.name, ".key");
    return key;
};
exports.getContextKey = getContextKey;
