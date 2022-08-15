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
exports.parseJsx = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var trace_reference_to_module_path_1 = require("../../helpers/trace-reference-to-module-path");
var function_literal_prefix_1 = require("../../constants/function-literal-prefix");
var create_mitosis_component_1 = require("../../helpers/create-mitosis-component");
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var get_bindings_1 = require("../../helpers/get-bindings");
var replace_new_lines_in_strings_1 = require("../../helpers/replace-new-lines-in-strings");
var json_1 = require("../../helpers/json");
var hooks_1 = require("../../constants/hooks");
var ast_1 = require("./ast");
var state_1 = require("./state");
var metadata_1 = require("./metadata");
var context_1 = require("./context");
var helpers_1 = require("./helpers");
var component_types_1 = require("./component-types");
var props_1 = require("./props");
var jsxPlugin = require('@babel/plugin-syntax-jsx');
var tsPreset = require('@babel/preset-typescript');
var types = babel.types;
var componentFunctionToJson = function (node, context) {
    var _a;
    var hooks = {};
    var state = {};
    var accessedContext = {};
    var setContext = {};
    var refs = {};
    for (var _i = 0, _b = node.body.body; _i < _b.length; _i++) {
        var item = _b[_i];
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
                                    var value = (0, state_1.parseStateObject)(valueNode);
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
                }
            }
        }
        if (types.isFunctionDeclaration(item)) {
            if (types.isIdentifier(item.id)) {
                state[item.id.name] = {
                    code: "".concat(function_literal_prefix_1.functionLiteralPrefix).concat((0, generator_1.default)(item).code),
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
            children.push(jsxElementToJson(value));
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
    return (0, create_mitosis_component_1.createMitosisComponent)(__assign(__assign({}, context.builder.component), { name: (_a = node.id) === null || _a === void 0 ? void 0 : _a.name, state: state, children: children, refs: refs, hooks: hooks, context: {
            get: accessedContext,
            set: setContext,
        }, propsTypeRef: (0, component_types_1.getPropsTypeRef)(node) }));
};
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
                    var forArguments = callback.params
                        .map(function (param) { return param === null || param === void 0 ? void 0 : param.name; })
                        .filter(Boolean);
                    return (0, create_mitosis_node_1.createMitosisNode)({
                        name: 'For',
                        bindings: {
                            each: {
                                code: (0, generator_1.default)(node.expression.callee)
                                    .code // Remove .map or potentially ?.map
                                    .replace(/\??\.map$/, ''),
                            },
                        },
                        scope: {
                            For: forArguments,
                        },
                        properties: {
                            _forName: forArguments[0],
                            _indexName: forArguments[1],
                            _collectionName: forArguments[2],
                        },
                        children: [jsxElementToJson(callback.body)],
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
                        when: { code: (0, generator_1.default)(node.expression.left).code },
                    },
                    children: [jsxElementToJson(node.expression.right)],
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
                    else: jsxElementToJson(node.expression.alternate),
                },
                bindings: {
                    when: { code: (0, generator_1.default)(node.expression.test).code },
                },
                children: [jsxElementToJson(node.expression.consequent)],
            });
        }
        // TODO: support {foo ? bar : baz}
        return (0, create_mitosis_node_1.createMitosisNode)({
            bindings: {
                _text: { code: (0, generator_1.default)(node.expression).code },
            },
        });
    }
    if (types.isJSXFragment(node)) {
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'Fragment',
            children: node.children.map(function (item) { return jsxElementToJson(item); }).filter(Boolean),
        });
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
            jsxElementToJson(elseAttr.value.expression);
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'Show',
            meta: {
                else: elseValue || undefined,
            },
            bindings: __assign({}, (whenValue ? { when: { code: whenValue } } : {})),
            children: node.children.map(function (item) { return jsxElementToJson(item); }).filter(Boolean),
        });
    }
    // <For ...> control flow component
    if (nodeName === 'For') {
        var child = node.children.find(function (item) { return types.isJSXExpressionContainer(item); });
        if (types.isJSXExpressionContainer(child)) {
            var childExpression = child.expression;
            if (types.isArrowFunctionExpression(childExpression)) {
                var forArguments = childExpression === null || childExpression === void 0 ? void 0 : childExpression.params.map(function (param) { return param === null || param === void 0 ? void 0 : param.name; }).filter(Boolean);
                return (0, create_mitosis_node_1.createMitosisNode)({
                    name: 'For',
                    bindings: {
                        each: {
                            code: (0, generator_1.default)(node.openingElement.attributes[0]
                                .value.expression).code,
                        },
                    },
                    scope: {
                        For: forArguments,
                    },
                    properties: {
                        _forName: forArguments[0],
                        _indexName: forArguments[1],
                        _collectionName: forArguments[2],
                    },
                    children: [jsxElementToJson(childExpression.body)],
                });
            }
        }
    }
    return (0, create_mitosis_node_1.createMitosisNode)({
        name: nodeName,
        properties: node.openingElement.attributes.reduce(function (memo, item) {
            if (types.isJSXAttribute(item)) {
                var key = item.name.name;
                var value = item.value;
                if (types.isStringLiteral(value)) {
                    memo[key] = value;
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
                var key = item.name.name;
                var value = item.value;
                if (types.isJSXExpressionContainer(value) && !types.isStringLiteral(value.expression)) {
                    var expression = value.expression;
                    if (types.isArrowFunctionExpression(expression)) {
                        if (key.startsWith('on')) {
                            memo[key] = {
                                code: (0, generator_1.default)(expression.body).code,
                                arguments: expression.params.map(function (node) { return node === null || node === void 0 ? void 0 : node.name; }),
                            };
                        }
                        else {
                            memo[key] = { code: (0, generator_1.default)(expression.body).code };
                        }
                    }
                    else {
                        memo[key] = { code: (0, generator_1.default)(expression).code };
                    }
                    return memo;
                }
            }
            else if (types.isJSXSpreadAttribute(item)) {
                // TODO: potentially like Vue store bindings and properties as array of key value pairs
                // too so can do this accurately when order matters. Also tempting to not support spread,
                // as some frameworks do not support it (e.g. Angular) tho Angular may be the only one
                memo._spread = {
                    code: types.stringLiteral((0, generator_1.default)(item.argument).code),
                };
            }
            return memo;
        }, {}),
        children: node.children.map(function (item) { return jsxElementToJson(item); }).filter(Boolean),
    });
};
var isImportOrDefaultExport = function (node) {
    return types.isExportDefaultDeclaration(node) || types.isImportDeclaration(node);
};
var beforeParse = function (path) {
    path.traverse({
        FunctionDeclaration: function (path) {
            (0, props_1.undoPropsDestructure)(path);
        },
    });
};
/**
 * This function takes the raw string from a Mitosis component, and converts it into a JSON that can be processed by
 * each generator function.
 *
 * @param jsx string representation of the Mitosis component
 * @returns A JSON representation of the Mitosis component
 */
function parseJsx(jsx, options) {
    if (options === void 0) { options = {}; }
    var useOptions = __assign({ format: 'react' }, options);
    var subComponentFunctions = [];
    var output = babel.transform(jsx, {
        configFile: false,
        babelrc: false,
        comments: false,
        presets: [[tsPreset, { isTSX: true, allExtensions: true }]],
        plugins: [
            jsxPlugin,
            function () { return ({
                visitor: {
                    JSXExpressionContainer: function (path, context) {
                        if (types.isJSXEmptyExpression(path.node.expression)) {
                            path.remove();
                        }
                    },
                    Program: function (path, context) {
                        if (context.builder) {
                            return;
                        }
                        beforeParse(path);
                        context.builder = {
                            component: (0, create_mitosis_component_1.createMitosisComponent)(),
                        };
                        var keepStatements = path.node.body.filter(function (statement) { return isImportOrDefaultExport(statement) || (0, component_types_1.isTypeOrInterface)(statement); });
                        for (var _i = 0, _a = path.node.body; _i < _a.length; _i++) {
                            var statement = _a[_i];
                            if ((0, component_types_1.isTypeImport)(statement)) {
                                var importDeclaration = statement;
                                // Remove .lite from path if exists, as that will be stripped
                                if (importDeclaration.source.value.endsWith('.lite')) {
                                    importDeclaration.source.value = importDeclaration.source.value.replace(/\.lite$/, '');
                                }
                                (0, component_types_1.collectTypes)(statement, context);
                            }
                        }
                        var exportsOrLocalVariables = path.node.body.filter(function (statement) {
                            return !isImportOrDefaultExport(statement) &&
                                !(0, component_types_1.isTypeOrInterface)(statement) &&
                                !types.isExpressionStatement(statement);
                        });
                        context.builder.component.exports = exportsOrLocalVariables.reduce(function (pre, node) {
                            var _a, _b;
                            var name, isFunction;
                            if (babel.types.isExportNamedDeclaration(node)) {
                                if (babel.types.isVariableDeclaration(node.declaration) &&
                                    babel.types.isIdentifier(node.declaration.declarations[0].id)) {
                                    name = node.declaration.declarations[0].id.name;
                                    isFunction = babel.types.isFunction(node.declaration.declarations[0].init);
                                }
                                if (babel.types.isFunctionDeclaration(node.declaration)) {
                                    name = (_a = node.declaration.id) === null || _a === void 0 ? void 0 : _a.name;
                                    isFunction = true;
                                }
                            }
                            else {
                                if (babel.types.isVariableDeclaration(node) &&
                                    babel.types.isIdentifier(node.declarations[0].id)) {
                                    name = node.declarations[0].id.name;
                                    isFunction = babel.types.isFunction(node.declarations[0].init);
                                }
                                if (babel.types.isFunctionDeclaration(node)) {
                                    name = (_b = node.id) === null || _b === void 0 ? void 0 : _b.name;
                                    isFunction = true;
                                }
                            }
                            if (name) {
                                pre[name] = {
                                    code: (0, generator_1.default)(node).code,
                                    isFunction: isFunction,
                                };
                            }
                            else {
                                console.warn('Could not parse export or variable: ignoring node', node);
                            }
                            return pre;
                        }, {});
                        var cutStatements = path.node.body.filter(function (statement) { return !isImportOrDefaultExport(statement); });
                        subComponentFunctions = path.node.body
                            .filter(function (node) {
                            return !types.isExportDefaultDeclaration(node) && types.isFunctionDeclaration(node);
                        })
                            .map(function (node) { return "export default ".concat((0, generator_1.default)(node).code); });
                        cutStatements = (0, metadata_1.collectMetadata)(cutStatements, context.builder.component, useOptions);
                        // TODO: support multiple? e.g. for others to add imports?
                        context.builder.component.hooks.preComponent = {
                            code: (0, generator_1.default)(types.program(cutStatements)).code,
                        };
                        path.replaceWith(types.program(keepStatements));
                    },
                    FunctionDeclaration: function (path, context) {
                        var node = path.node;
                        if (types.isIdentifier(node.id)) {
                            var name_3 = node.id.name;
                            if (name_3[0].toUpperCase() === name_3[0]) {
                                path.replaceWith((0, ast_1.jsonToAst)(componentFunctionToJson(node, context)));
                            }
                        }
                    },
                    ImportDeclaration: function (path, context) {
                        // @builder.io/mitosis or React imports compile away
                        var customPackages = (options === null || options === void 0 ? void 0 : options.compileAwayPackages) || [];
                        if (__spreadArray(['react', '@builder.io/mitosis', '@emotion/react'], customPackages, true).includes(path.node.source.value)) {
                            path.remove();
                            return;
                        }
                        var importObject = {
                            imports: {},
                            path: path.node.source.value,
                        };
                        for (var _i = 0, _a = path.node.specifiers; _i < _a.length; _i++) {
                            var specifier = _a[_i];
                            if (types.isImportSpecifier(specifier)) {
                                importObject.imports[specifier.local.name] = specifier.imported.name;
                            }
                            else if (types.isImportDefaultSpecifier(specifier)) {
                                importObject.imports[specifier.local.name] = 'default';
                            }
                            else if (types.isImportNamespaceSpecifier(specifier)) {
                                importObject.imports[specifier.local.name] = '*';
                            }
                        }
                        context.builder.component.imports.push(importObject);
                        path.remove();
                    },
                    ExportDefaultDeclaration: function (path) {
                        path.replaceWith(path.node.declaration);
                    },
                    JSXElement: function (path) {
                        var node = path.node;
                        path.replaceWith((0, ast_1.jsonToAst)(jsxElementToJson(node)));
                    },
                    ExportNamedDeclaration: function (path, context) {
                        var node = path.node;
                        var newTypeStr = (0, generator_1.default)(node).code;
                        if (babel.types.isTSInterfaceDeclaration(node.declaration)) {
                            (0, component_types_1.collectInterfaces)(path.node, context);
                        }
                        if (babel.types.isTSTypeAliasDeclaration(node.declaration)) {
                            (0, component_types_1.collectTypes)(path.node, context);
                        }
                    },
                    TSTypeAliasDeclaration: function (path, context) {
                        (0, component_types_1.collectTypes)(path.node, context);
                    },
                    TSInterfaceDeclaration: function (path, context) {
                        (0, component_types_1.collectInterfaces)(path.node, context);
                    },
                },
            }); },
        ],
    });
    var toParse = (0, replace_new_lines_in_strings_1.stripNewlinesInStrings)(output
        .code.trim()
        // Occasional issues where comments get kicked to the top. Full fix should strip these sooner
        .replace(/^\/\*[\s\S]*?\*\/\s*/, '')
        // Weird bug with adding a newline in a normal at end of a normal string that can't have one
        // If not one-off find full solve and cause
        .replace(/\n"/g, '"')
        .replace(/^\({/, '{')
        .replace(/}\);$/, '}'));
    var parsed = (0, json_1.tryParseJson)(toParse);
    (0, state_1.mapReactIdentifiers)(parsed);
    (0, context_1.extractContextComponents)(parsed);
    parsed.subComponents = subComponentFunctions.map(function (item) { return parseJsx(item, useOptions); });
    return parsed;
}
exports.parseJsx = parseJsx;