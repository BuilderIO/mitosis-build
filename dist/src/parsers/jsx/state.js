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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStateObjectToMitosisState = exports.parseStateObject = exports.createFunctionStringLiteralObjectProperty = exports.mapReactIdentifiers = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var function_literal_prefix_1 = require("../../constants/function-literal-prefix");
var method_literal_prefix_1 = require("../../constants/method-literal-prefix");
var traverse_1 = __importDefault(require("traverse"));
var babel_transform_1 = require("../../helpers/babel-transform");
var capitalize_1 = require("../../helpers/capitalize");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var replace_idenifiers_1 = require("../../helpers/replace-idenifiers");
var helpers_1 = require("./helpers");
var function_1 = require("fp-ts/lib/function");
var state_1 = require("../../helpers/state");
var types = babel.types;
function mapReactIdentifiersInExpression(expression, stateProperties) {
    var setExpressions = stateProperties.map(function (propertyName) { return "set".concat((0, capitalize_1.capitalize)(propertyName)); });
    return (0, babel_transform_1.babelTransformExpression)(
    // foo -> state.foo
    (0, replace_idenifiers_1.replaceIdentifiers)(expression, stateProperties, function (name) { return "state.".concat(name); }), {
        CallExpression: function (path) {
            if (types.isIdentifier(path.node.callee)) {
                if (setExpressions.includes(path.node.callee.name)) {
                    // setFoo -> foo
                    var statePropertyName = (0, helpers_1.uncapitalize)(path.node.callee.name.slice(3));
                    // setFoo(...) -> state.foo = ...
                    path.replaceWith(types.assignmentExpression('=', types.identifier("state.".concat(statePropertyName)), path.node.arguments[0]));
                }
            }
        },
    });
}
/**
 * Convert state identifiers from React hooks format to the state.* format Mitosis needs
 * e.g.
 *   text -> state.text
 *   setText(...) -> state.text = ...
 */
function mapReactIdentifiers(json) {
    var _a;
    var stateProperties = Object.keys(json.state);
    for (var key in json.state) {
        var value = (_a = json.state[key]) === null || _a === void 0 ? void 0 : _a.code;
        if (typeof value === 'string' && value.startsWith(function_literal_prefix_1.functionLiteralPrefix)) {
            json.state[key] = {
                code: function_literal_prefix_1.functionLiteralPrefix +
                    mapReactIdentifiersInExpression(value.replace(function_literal_prefix_1.functionLiteralPrefix, ''), stateProperties),
                type: 'function',
            };
        }
    }
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var value = item.bindings[key];
                if (value) {
                    item.bindings[key] = {
                        code: mapReactIdentifiersInExpression(value.code, stateProperties),
                    };
                    if ((_a = value.arguments) === null || _a === void 0 ? void 0 : _a.length) {
                        item.bindings[key].arguments = value.arguments;
                    }
                }
            }
            if (item.bindings.className) {
                if (item.bindings.class) {
                    // TO-DO: it's too much work to merge 2 bindings, so just remove the old one for now.
                    item.bindings.class = item.bindings.className;
                }
                else {
                    item.bindings.class = item.bindings.className;
                }
                delete item.bindings.className;
            }
            if (item.properties.className) {
                if (item.properties.class) {
                    item.properties.class = "".concat(item.properties.class, " ").concat(item.properties.className);
                }
                else {
                    item.properties.class = item.properties.className;
                }
                delete item.properties.className;
            }
            if (item.properties.class && item.bindings.class) {
                console.warn("[".concat(json.name, "]: Ended up with both a property and binding for 'class'."));
            }
        }
    });
}
exports.mapReactIdentifiers = mapReactIdentifiers;
var createFunctionStringLiteral = function (node) {
    return types.stringLiteral("".concat(function_literal_prefix_1.functionLiteralPrefix).concat((0, generator_1.default)(node).code));
};
var createFunctionStringLiteralObjectProperty = function (key, node) {
    return types.objectProperty(key, createFunctionStringLiteral(node));
};
exports.createFunctionStringLiteralObjectProperty = createFunctionStringLiteralObjectProperty;
var parseStateValue = function (item) {
    if (types.isObjectProperty(item)) {
        if (types.isFunctionExpression(item.value) || types.isArrowFunctionExpression(item.value)) {
            return (0, exports.createFunctionStringLiteralObjectProperty)(item.key, item.value);
        }
    }
    if (types.isObjectMethod(item)) {
        return types.objectProperty(item.key, types.stringLiteral("".concat(method_literal_prefix_1.methodLiteralPrefix).concat((0, generator_1.default)(__assign(__assign({}, item), { returnType: null })).code)));
    }
    // Remove typescript types, e.g. from
    // { foo: ('string' as SomeType) }
    if (types.isObjectProperty(item)) {
        var value = item.value;
        if (types.isTSAsExpression(value)) {
            value = value.expression;
        }
        return types.objectProperty(item.key, value);
    }
    return item;
};
var parseStateObject = function (object) {
    return (0, function_1.pipe)(object.properties, function (p) { return p.map(parseStateValue); }, types.objectExpression, helpers_1.parseCodeJson);
};
exports.parseStateObject = parseStateObject;
exports.parseStateObjectToMitosisState = (0, function_1.flow)(exports.parseStateObject, state_1.mapJsonObjectToStateValue);
