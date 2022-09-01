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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentFunctionToJson = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var trace_reference_to_module_path_1 = require("../../helpers/trace-reference-to-module-path");
var create_mitosis_component_1 = require("../../helpers/create-mitosis-component");
var get_bindings_1 = require("../../helpers/get-bindings");
var hooks_1 = require("../../constants/hooks");
var state_1 = require("./state");
var helpers_1 = require("./helpers");
var component_types_1 = require("./component-types");
var element_parser_1 = require("./element-parser");
var types = babel.types;
/**
 * Parses function declarations within the Mitosis copmonent's body to JSON
 */
var componentFunctionToJson = function (node, context) {
    var _a, _b;
    var hooks = {};
    var state = {};
    var accessedContext = {};
    var setContext = {};
    var refs = {};
    for (var _i = 0, _c = node.body.body; _i < _c.length; _i++) {
        var item = _c[_i];
        if (types.isExpressionStatement(item)) {
            var expression = item.expression;
            if (types.isCallExpression(expression)) {
                if (types.isIdentifier(expression.callee)) {
                    if (expression.callee.name === 'setContext' ||
                        expression.callee.name === 'provideContext') {
                        var keyNode = expression.arguments[0];
                        if (types.isIdentifier(keyNode)) {
                            var key = keyNode.name;
                            var keyPath = (0, trace_reference_to_module_path_1.traceReferenceToModulePath)(context.builder.component.imports, key);
                            var valueNode = expression.arguments[1];
                            if (valueNode) {
                                if (types.isObjectExpression(valueNode)) {
                                    var value = (0, state_1.parseStateObjectToMitosisState)(valueNode);
                                    setContext[keyPath] = {
                                        name: keyNode.name,
                                        value: value,
                                    };
                                }
                                else {
                                    var ref = (0, generator_1.default)(valueNode).code;
                                    setContext[keyPath] = {
                                        name: keyNode.name,
                                        ref: ref,
                                    };
                                }
                            }
                        }
                    }
                    else if (expression.callee.name === 'onMount' ||
                        expression.callee.name === 'useEffect') {
                        var firstArg = expression.arguments[0];
                        if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
                            var code = (0, generator_1.default)(firstArg.body)
                                .code.trim()
                                // Remove arbitrary block wrapping if any
                                // AKA
                                //  { console.log('hi') } -> console.log('hi')
                                .replace(/^{/, '')
                                .replace(/}$/, '');
                            // TODO: add arguments
                            hooks.onMount = { code: code };
                        }
                    }
                    else if (expression.callee.name === 'onUpdate') {
                        var firstArg = expression.arguments[0];
                        var secondArg = expression.arguments[1];
                        if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
                            var code = (0, generator_1.default)(firstArg.body)
                                .code.trim()
                                // Remove arbitrary block wrapping if any
                                // AKA
                                //  { console.log('hi') } -> console.log('hi')
                                .replace(/^{/, '')
                                .replace(/}$/, '');
                            if (!secondArg ||
                                (types.isArrayExpression(secondArg) && secondArg.elements.length > 0)) {
                                var depsCode = secondArg ? (0, generator_1.default)(secondArg).code : '';
                                hooks.onUpdate = __spreadArray(__spreadArray([], (hooks.onUpdate || []), true), [
                                    {
                                        code: code,
                                        deps: depsCode,
                                    },
                                ], false);
                            }
                        }
                    }
                    else if (expression.callee.name === 'onUnMount') {
                        var firstArg = expression.arguments[0];
                        if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
                            var code = (0, generator_1.default)(firstArg.body)
                                .code.trim()
                                // Remove arbitrary block wrapping if any
                                // AKA
                                //  { console.log('hi') } -> console.log('hi')
                                .replace(/^{/, '')
                                .replace(/}$/, '');
                            hooks.onUnMount = { code: code };
                        }
                    }
                    else if (expression.callee.name === 'onInit') {
                        var firstArg = expression.arguments[0];
                        if (types.isFunctionExpression(firstArg) || types.isArrowFunctionExpression(firstArg)) {
                            var code = (0, generator_1.default)(firstArg.body)
                                .code.trim()
                                // Remove arbitrary block wrapping if any
                                // AKA
                                //  { console.log('hi') } -> console.log('hi')
                                .replace(/^{/, '')
                                .replace(/}$/, '');
                            hooks.onInit = { code: code };
                        }
                    }
                    else if (expression.callee.name === hooks_1.HOOKS.DEFAULT_PROPS) {
                        var firstArg = expression.arguments[0];
                        if (types.isObjectExpression(firstArg)) {
                            var objectProperties = (_a = firstArg.properties) === null || _a === void 0 ? void 0 : _a.filter(function (i) {
                                return types.isObjectProperty(i);
                            });
                            objectProperties === null || objectProperties === void 0 ? void 0 : objectProperties.forEach(function (i) {
                                var _a;
                                var _b, _c, _d;
                                if ((_b = i.key) === null || _b === void 0 ? void 0 : _b.name) {
                                    context.builder.component.defaultProps = __assign(__assign({}, ((_c = context.builder.component.defaultProps) !== null && _c !== void 0 ? _c : {})), (_a = {}, _a[(_d = i.key) === null || _d === void 0 ? void 0 : _d.name] = i.value.value, _a));
                                }
                            });
                        }
                    }
                }
            }
        }
        if (types.isFunctionDeclaration(item)) {
            if (types.isIdentifier(item.id)) {
                state[item.id.name] = {
                    code: (0, generator_1.default)(item).code,
                    type: 'function',
                };
            }
        }
        if (types.isVariableDeclaration(item)) {
            var declaration = item.declarations[0];
            var init = declaration.init;
            if (types.isCallExpression(init)) {
                // React format, like:
                // const [foo, setFoo] = useState(...)
                if (types.isArrayPattern(declaration.id)) {
                    var varName = types.isIdentifier(declaration.id.elements[0]) && declaration.id.elements[0].name;
                    if (varName) {
                        var value = init.arguments[0];
                        // Function as init, like:
                        // useState(() => true)
                        if (types.isArrowFunctionExpression(value)) {
                            state[varName] = {
                                code: (0, helpers_1.parseCodeJson)(value.body),
                                type: 'function',
                            };
                        }
                        else {
                            // Value as init, like:
                            // useState(true)
                            state[varName] = {
                                code: (0, helpers_1.parseCodeJson)(value),
                                type: 'property',
                            };
                        }
                    }
                }
                // Legacy format, like:
                // const state = useStore({...})
                else if (types.isIdentifier(init.callee)) {
                    if (init.callee.name === hooks_1.HOOKS.STATE || init.callee.name === hooks_1.HOOKS.STORE) {
                        var firstArg = init.arguments[0];
                        if (types.isObjectExpression(firstArg)) {
                            var useStoreState = (0, state_1.parseStateObjectToMitosisState)(firstArg);
                            Object.assign(state, useStoreState);
                        }
                    }
                    else if (init.callee.name === hooks_1.HOOKS.CONTEXT) {
                        var firstArg = init.arguments[0];
                        if (types.isVariableDeclarator(declaration) && types.isIdentifier(declaration.id)) {
                            if (types.isIdentifier(firstArg)) {
                                var varName = declaration.id.name;
                                var name_1 = firstArg.name;
                                accessedContext[varName] = {
                                    name: name_1,
                                    path: (0, trace_reference_to_module_path_1.traceReferenceToModulePath)(context.builder.component.imports, name_1),
                                };
                            }
                            else {
                                var varName = declaration.id.name;
                                var name_2 = (0, generator_1.default)(firstArg).code;
                                accessedContext[varName] = {
                                    name: name_2,
                                    path: '',
                                };
                            }
                        }
                    }
                    else if (init.callee.name === hooks_1.HOOKS.REF) {
                        if (types.isIdentifier(declaration.id)) {
                            var firstArg = init.arguments[0];
                            var varName = declaration.id.name;
                            refs[varName] = {
                                argument: (0, generator_1.default)(firstArg).code,
                            };
                            // Typescript Parameter
                            if (types.isTSTypeParameterInstantiation(init.typeParameters)) {
                                refs[varName].typeParameter = (0, generator_1.default)(init.typeParameters.params[0]).code;
                            }
                        }
                    }
                }
            }
        }
    }
    var theReturn = node.body.body.find(function (item) { return types.isReturnStatement(item); });
    var children = [];
    if (theReturn) {
        var value = theReturn.argument;
        if (types.isJSXElement(value) || types.isJSXFragment(value)) {
            children.push((0, element_parser_1.jsxElementToJson)(value));
        }
    }
    var localExports = context.builder.component.exports;
    if (localExports) {
        var bindingsCode_1 = (0, get_bindings_1.getBindingsCode)(children);
        Object.keys(localExports).forEach(function (name) {
            var found = bindingsCode_1.find(function (code) { return code.match(new RegExp("\\b".concat(name, "\\b"))); });
            localExports[name].usedInLocal = Boolean(found);
        });
        context.builder.component.exports = localExports;
    }
    var propsTypeRef = (0, component_types_1.getPropsTypeRef)(node, context);
    return (0, create_mitosis_component_1.createMitosisComponent)(__assign(__assign({}, context.builder.component), { name: (_b = node.id) === null || _b === void 0 ? void 0 : _b.name, state: state, children: children, refs: refs, hooks: hooks, context: {
            get: accessedContext,
            set: setContext,
        }, propsTypeRef: propsTypeRef }));
};
exports.componentFunctionToJson = componentFunctionToJson;
