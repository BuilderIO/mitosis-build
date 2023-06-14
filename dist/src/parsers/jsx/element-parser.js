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
exports.jsxElementToJson = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var function_1 = require("fp-ts/lib/function");
var bindings_1 = require("../../helpers/bindings");
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var nullable_1 = require("../../helpers/nullable");
var helpers_1 = require("./helpers");
var types = babel.types;
var getForArguments = function (params) {
    var _a = params
        .filter(function (param) { return types.isIdentifier(param); })
        .map(function (param) { return param.name; })
        .filter(nullable_1.checkIsDefined), forName = _a[0], indexName = _a[1], collectionName = _a[2];
    return {
        forName: forName,
        collectionName: collectionName,
        indexName: indexName,
    };
};
/**
 * Parses a JSX element into a MitosisNode.
 */
var jsxElementToJson = function (node) {
    if (types.isJSXText(node)) {
        return (0, create_mitosis_node_1.createMitosisNode)({
            properties: {
                _text: node.value,
            },
        });
    }
    if (types.isJSXExpressionContainer(node)) {
        if (types.isJSXEmptyExpression(node.expression)) {
            return null;
        }
        // foo.map -> <For each={foo}>...</For>
        if (types.isCallExpression(node.expression) ||
            types.isOptionalCallExpression(node.expression)) {
            var callback = node.expression.arguments[0];
            if (types.isArrowFunctionExpression(callback)) {
                if (types.isIdentifier(callback.params[0])) {
                    var forArguments = getForArguments(callback.params);
                    return (0, create_mitosis_node_1.createMitosisNode)({
                        name: 'For',
                        bindings: {
                            each: (0, bindings_1.createSingleBinding)({
                                code: (0, generator_1.default)(node.expression.callee)
                                    .code // Remove .map or potentially ?.map
                                    .replace(/\??\.map$/, ''),
                            }),
                        },
                        scope: forArguments,
                        children: [(0, exports.jsxElementToJson)(callback.body)],
                    });
                }
            }
        }
        // {foo && <div />} -> <Show when={foo}>...</Show>
        if (types.isLogicalExpression(node.expression)) {
            if (node.expression.operator === '&&') {
                return (0, create_mitosis_node_1.createMitosisNode)({
                    name: 'Show',
                    bindings: {
                        when: (0, bindings_1.createSingleBinding)({ code: (0, generator_1.default)(node.expression.left).code }),
                    },
                    children: [(0, exports.jsxElementToJson)(node.expression.right)],
                });
            }
            else {
                // TODO: good warning system for unsupported operators
            }
        }
        // {foo ? <div /> : <span />} -> <Show when={foo} else={<span />}>...</Show>
        if (types.isConditionalExpression(node.expression)) {
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'Show',
                meta: {
                    else: (0, exports.jsxElementToJson)(node.expression.alternate),
                },
                bindings: {
                    when: (0, bindings_1.createSingleBinding)({ code: (0, generator_1.default)(node.expression.test).code }),
                },
                children: [(0, exports.jsxElementToJson)(node.expression.consequent)],
            });
        }
        // TODO: support {foo ? bar : baz}
        return (0, create_mitosis_node_1.createMitosisNode)({
            bindings: {
                _text: (0, bindings_1.createSingleBinding)({ code: (0, generator_1.default)(node.expression).code }),
            },
        });
    }
    if (types.isJSXFragment(node)) {
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'Fragment',
            children: node.children.map(exports.jsxElementToJson).filter(nullable_1.checkIsDefined),
        });
    }
    // TODO: support spread attributes
    if (types.isJSXSpreadChild(node)) {
        return null;
    }
    var nodeName = (0, generator_1.default)(node.openingElement.name).code;
    if (nodeName === 'Show') {
        var whenAttr = node.openingElement.attributes.find(function (item) { return types.isJSXAttribute(item) && item.name.name === 'when'; });
        var elseAttr = node.openingElement.attributes.find(function (item) { return types.isJSXAttribute(item) && item.name.name === 'else'; });
        var whenValue = whenAttr && types.isJSXExpressionContainer(whenAttr.value)
            ? (0, generator_1.default)(whenAttr.value.expression).code
            : undefined;
        var elseValue = elseAttr &&
            types.isJSXExpressionContainer(elseAttr.value) &&
            (0, exports.jsxElementToJson)(elseAttr.value.expression);
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'Show',
            meta: {
                else: elseValue || undefined,
            },
            bindings: __assign({}, (whenValue ? { when: (0, bindings_1.createSingleBinding)({ code: whenValue }) } : {})),
            children: node.children.map(exports.jsxElementToJson).filter(nullable_1.checkIsDefined),
        });
    }
    // <For ...> control flow component
    if (nodeName === 'For') {
        var child = node.children.find(function (item) {
            return types.isJSXExpressionContainer(item);
        });
        if ((0, nullable_1.checkIsDefined)(child)) {
            var childExpression = child.expression;
            if (types.isArrowFunctionExpression(childExpression)) {
                var forArguments = getForArguments(childExpression === null || childExpression === void 0 ? void 0 : childExpression.params);
                var forCode = (0, function_1.pipe)(node.openingElement.attributes[0], function (attr) {
                    if (types.isJSXAttribute(attr) && types.isJSXExpressionContainer(attr.value)) {
                        return (0, generator_1.default)(attr.value.expression).code;
                    }
                    else {
                        // TO-DO: is an empty string valid here?
                        return '';
                    }
                });
                return (0, create_mitosis_node_1.createMitosisNode)({
                    name: 'For',
                    bindings: {
                        each: (0, bindings_1.createSingleBinding)({
                            code: forCode,
                        }),
                    },
                    scope: forArguments,
                    children: [(0, exports.jsxElementToJson)(childExpression.body)],
                });
            }
        }
    }
    return (0, create_mitosis_node_1.createMitosisNode)({
        name: nodeName,
        properties: node.openingElement.attributes.reduce(function (memo, item) {
            if (types.isJSXAttribute(item)) {
                var key = (0, helpers_1.transformAttributeName)(item.name.name);
                var value = item.value;
                if (types.isStringLiteral(value)) {
                    memo[key] = value.value;
                    return memo;
                }
                if (types.isJSXExpressionContainer(value) && types.isStringLiteral(value.expression)) {
                    memo[key] = value.expression.value;
                    return memo;
                }
            }
            return memo;
        }, {}),
        bindings: node.openingElement.attributes.reduce(function (memo, item) {
            if (types.isJSXAttribute(item)) {
                var key = (0, helpers_1.transformAttributeName)(item.name.name);
                var value = item.value;
                // boolean attribute
                if (value === null) {
                    memo[key] = (0, bindings_1.createSingleBinding)({ code: 'true' });
                    return memo;
                }
                if (types.isJSXExpressionContainer(value) && !types.isStringLiteral(value.expression)) {
                    var expression = value.expression;
                    if (types.isArrowFunctionExpression(expression)) {
                        if (key.startsWith('on')) {
                            var args = expression.params.map(function (node) { return node === null || node === void 0 ? void 0 : node.name; });
                            memo[key] = (0, bindings_1.createSingleBinding)({
                                code: (0, generator_1.default)(expression.body).code,
                                arguments: args.length ? args : undefined,
                            });
                        }
                        else {
                            memo[key] = (0, bindings_1.createSingleBinding)({ code: (0, generator_1.default)(expression.body).code });
                        }
                    }
                    else {
                        memo[key] = (0, bindings_1.createSingleBinding)({ code: (0, generator_1.default)(expression).code });
                    }
                    return memo;
                }
            }
            else if (types.isJSXSpreadAttribute(item)) {
                // TODO: potentially like Vue store bindings and properties as array of key value pairs
                // too so can do this accurately when order matters. Also tempting to not support spread,
                // as some frameworks do not support it (e.g. Angular) tho Angular may be the only one
                var key = (0, generator_1.default)(item.argument).code;
                memo[key] = {
                    code: types.stringLiteral((0, generator_1.default)(item.argument).code).value,
                    type: 'spread',
                    spreadType: 'normal',
                };
            }
            return memo;
        }, {}),
        children: node.children.map(exports.jsxElementToJson).filter(nullable_1.checkIsDefined),
    });
};
exports.jsxElementToJson = jsxElementToJson;
