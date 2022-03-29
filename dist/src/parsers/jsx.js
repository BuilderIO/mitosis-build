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
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.parseJsx = exports.METADATA_HOOK_NAME = exports.parseStateObject = exports.createFunctionStringLiteralObjectProperty = exports.createFunctionStringLiteral = exports.selfClosingTags = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var trace_reference_to_module_path_1 = require("../helpers/trace-reference-to-module-path");
var traverse_1 = __importDefault(require("traverse"));
var function_literal_prefix_1 = require("../constants/function-literal-prefix");
var method_literal_prefix_1 = require("../constants/method-literal-prefix");
var babel_transform_1 = require("../helpers/babel-transform");
var capitalize_1 = require("../helpers/capitalize");
var create_mitosis_component_1 = require("../helpers/create-mitosis-component");
var create_mitosis_node_1 = require("../helpers/create-mitosis-node");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var replace_idenifiers_1 = require("../helpers/replace-idenifiers");
var replace_new_lines_in_strings_1 = require("../helpers/replace-new-lines-in-strings");
var json_1 = require("../helpers/json");
var jsxPlugin = require('@babel/plugin-syntax-jsx');
var tsPreset = require('@babel/preset-typescript');
exports.selfClosingTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);
var types = babel.types;
var arrayToAst = function (array) {
    return types.arrayExpression(array.map(function (item) { return jsonToAst(item); }));
};
var jsonToAst = function (json) {
    if (types.isNode(json)) {
        if (types.isJSXText(json)) {
            return types.stringLiteral(json.value);
        }
        return json;
    }
    switch (typeof json) {
        case 'undefined':
            return types.identifier('undefined');
        case 'string':
            return types.stringLiteral(json);
        case 'number':
            return types.numericLiteral(json);
        case 'boolean':
            return types.booleanLiteral(json);
        case 'object':
            if (!json) {
                return types.nullLiteral();
            }
            if (Array.isArray(json)) {
                return arrayToAst(json);
            }
            return jsonObjectToAst(json);
    }
};
var jsonObjectToAst = function (json) {
    if (!json) {
        return json;
    }
    var properties = [];
    for (var key in json) {
        var value = json[key];
        if (value === undefined) {
            continue;
        }
        var keyAst = types.stringLiteral(key);
        var valueAst = jsonToAst(value);
        properties.push(types.objectProperty(keyAst, valueAst));
    }
    var newNode = types.objectExpression(properties);
    return newNode;
};
var createFunctionStringLiteral = function (node) {
    return types.stringLiteral("".concat(function_literal_prefix_1.functionLiteralPrefix).concat((0, generator_1.default)(node).code));
};
exports.createFunctionStringLiteral = createFunctionStringLiteral;
var createFunctionStringLiteralObjectProperty = function (key, node) {
    return types.objectProperty(key, (0, exports.createFunctionStringLiteral)(node));
};
exports.createFunctionStringLiteralObjectProperty = createFunctionStringLiteralObjectProperty;
var uncapitalize = function (str) {
    if (!str) {
        return str;
    }
    return str[0].toLowerCase() + str.slice(1);
};
var parseStateObject = function (object) {
    var properties = object.properties;
    var useProperties = properties.map(function (item) {
        if (types.isObjectProperty(item)) {
            if (types.isFunctionExpression(item.value) ||
                types.isArrowFunctionExpression(item.value)) {
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
    });
    var newObject = types.objectExpression(useProperties);
    var obj = parseCodeJson(newObject);
    return obj;
};
exports.parseStateObject = parseStateObject;
var parseCodeJson = function (node) {
    var code = (0, generator_1.default)(node).code;
    return (0, json_1.tryParseJson)(code);
};
var componentFunctionToJson = function (node, context) {
    var _a;
    var hooks = {};
    var state = {};
    var accessedContext = {};
    var setContext = {};
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
                            setContext[keyPath] = {
                                name: keyNode.name,
                                value: valueNode && types.isObjectExpression(valueNode)
                                    ? (0, exports.parseStateObject)(valueNode)
                                    : undefined,
                            };
                        }
                    }
                    else if (expression.callee.name === 'onMount' ||
                        expression.callee.name === 'useEffect') {
                        var firstArg = expression.arguments[0];
                        if (types.isFunctionExpression(firstArg) ||
                            types.isArrowFunctionExpression(firstArg)) {
                            var code = (0, generator_1.default)(firstArg.body)
                                .code.trim()
                                // Remove arbitrary block wrapping if any
                                // AKA
                                //  { console.log('hi') } -> console.log('hi')
                                .replace(/^{/, '')
                                .replace(/}$/, '');
                            hooks.onMount = { code: code };
                        }
                    }
                    else if (expression.callee.name === 'onUpdate') {
                        var firstArg = expression.arguments[0];
                        var secondArg = expression.arguments[1];
                        if (types.isFunctionExpression(firstArg) ||
                            types.isArrowFunctionExpression(firstArg)) {
                            var code = (0, generator_1.default)(firstArg.body)
                                .code.trim()
                                // Remove arbitrary block wrapping if any
                                // AKA
                                //  { console.log('hi') } -> console.log('hi')
                                .replace(/^{/, '')
                                .replace(/}$/, '');
                            if (!secondArg ||
                                (types.isArrayExpression(secondArg) &&
                                    secondArg.elements.length > 0)) {
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
                        if (types.isFunctionExpression(firstArg) ||
                            types.isArrowFunctionExpression(firstArg)) {
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
                }
            }
        }
        if (types.isFunctionDeclaration(item)) {
            if (types.isIdentifier(item.id)) {
                state[item.id.name] = "".concat(function_literal_prefix_1.functionLiteralPrefix).concat((0, generator_1.default)(item).code);
            }
        }
        if (types.isVariableDeclaration(item)) {
            var declaration = item.declarations[0];
            var init = declaration.init;
            if (types.isCallExpression(init)) {
                // React format, like:
                // const [foo, setFoo] = useState(...)
                if (types.isArrayPattern(declaration.id)) {
                    var varName = types.isIdentifier(declaration.id.elements[0]) &&
                        declaration.id.elements[0].name;
                    if (varName) {
                        var value = init.arguments[0];
                        // Function as init, like:
                        // useState(() => true)
                        if (types.isArrowFunctionExpression(value)) {
                            state[varName] = parseCodeJson(value.body);
                        }
                        else {
                            // Value as init, like:
                            // useState(true)
                            state[varName] = parseCodeJson(value);
                        }
                    }
                }
                // Legacy format, like:
                // const state = useState({...})
                else if (types.isIdentifier(init.callee)) {
                    if (init.callee.name === 'useState') {
                        var firstArg = init.arguments[0];
                        if (types.isObjectExpression(firstArg)) {
                            state = (0, exports.parseStateObject)(firstArg);
                        }
                    }
                    else if (init.callee.name === 'useContext') {
                        var firstArg = init.arguments[0];
                        if (types.isVariableDeclarator(declaration) &&
                            types.isIdentifier(declaration.id)) {
                            if (types.isIdentifier(firstArg)) {
                                var varName = declaration.id.name;
                                var name_1 = firstArg.name;
                                accessedContext[varName] = {
                                    name: name_1,
                                    path: (0, trace_reference_to_module_path_1.traceReferenceToModulePath)(context.builder.component.imports, name_1),
                                };
                            }
                        }
                    }
                }
            }
        }
    }
    var theReturn = node.body.body.find(function (item) {
        return types.isReturnStatement(item);
    });
    var children = [];
    if (theReturn) {
        var value = theReturn.argument;
        if (types.isJSXElement(value) || types.isJSXFragment(value)) {
            children.push(jsxElementToJson(value));
        }
    }
    return (0, create_mitosis_component_1.createMitosisComponent)(__assign(__assign({}, context.builder.component), { name: (_a = node.id) === null || _a === void 0 ? void 0 : _a.name, state: state, children: children, hooks: hooks, context: {
            get: accessedContext,
            set: setContext,
        } }));
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
                    var forName = callback.params[0].name;
                    return (0, create_mitosis_node_1.createMitosisNode)({
                        name: 'For',
                        bindings: {
                            each: (0, generator_1.default)(node.expression.callee)
                                .code // Remove .map or potentially ?.map
                                .replace(/\??\.map$/, ''),
                        },
                        properties: {
                            _forName: forName,
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
                        when: (0, generator_1.default)(node.expression.left).code,
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
                    when: (0, generator_1.default)(node.expression.test).code,
                },
                children: [jsxElementToJson(node.expression.consequent)],
            });
        }
        // TODO: support {foo ? bar : baz}
        return (0, create_mitosis_node_1.createMitosisNode)({
            bindings: {
                _text: (0, generator_1.default)(node.expression).code,
            },
        });
    }
    if (types.isJSXFragment(node)) {
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'Fragment',
            children: node.children
                .map(function (item) { return jsxElementToJson(item); })
                .filter(Boolean),
        });
    }
    var nodeName = (0, generator_1.default)(node.openingElement.name).code;
    if (nodeName === 'Show') {
        var whenAttr = node.openingElement.attributes.find(function (item) { return types.isJSXAttribute(item) && item.name.name === 'when'; });
        var elseAttr = node.openingElement.attributes.find(function (item) { return types.isJSXAttribute(item) && item.name.name === 'else'; });
        var whenValue = whenAttr &&
            types.isJSXExpressionContainer(whenAttr.value) &&
            (0, generator_1.default)(whenAttr.value.expression).code;
        var elseValue = elseAttr &&
            types.isJSXExpressionContainer(elseAttr.value) &&
            jsxElementToJson(elseAttr.value.expression);
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'Show',
            meta: {
                else: elseValue || undefined,
            },
            bindings: {
                when: whenValue || undefined,
            },
            children: node.children
                .map(function (item) { return jsxElementToJson(item); })
                .filter(Boolean),
        });
    }
    // <For ...> control flow component
    if (nodeName === 'For') {
        var child = node.children.find(function (item) {
            return types.isJSXExpressionContainer(item);
        });
        if (types.isJSXExpressionContainer(child)) {
            var childExpression = child.expression;
            if (types.isArrowFunctionExpression(childExpression)) {
                var argName = childExpression.params[0]
                    .name;
                return (0, create_mitosis_node_1.createMitosisNode)({
                    name: 'For',
                    bindings: {
                        each: (0, generator_1.default)(node.openingElement.attributes[0]
                            .value.expression).code,
                    },
                    properties: {
                        _forName: argName,
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
            }
            return memo;
        }, {}),
        bindings: node.openingElement.attributes.reduce(function (memo, item) {
            if (types.isJSXAttribute(item)) {
                var key = item.name.name;
                var value = item.value;
                if (types.isJSXExpressionContainer(value)) {
                    var expression = value.expression;
                    if (types.isArrowFunctionExpression(expression)) {
                        memo[key] = (0, generator_1.default)(expression.body).code;
                    }
                    else {
                        memo[key] = (0, generator_1.default)(expression).code;
                    }
                    return memo;
                }
            }
            else if (types.isJSXSpreadAttribute(item)) {
                // TODO: potentially like Vue store bindings and properties as array of key value pairs
                // too so can do this accurately when order matters. Also tempting to not support spread,
                // as some frameworks do not support it (e.g. Angular) tho Angular may be the only one
                memo._spread = types.stringLiteral((0, generator_1.default)(item.argument).code);
            }
            return memo;
        }, {}),
        children: node.children
            .map(function (item) { return jsxElementToJson(item); })
            .filter(Boolean),
    });
};
var getHook = function (node) {
    var item = node;
    if (types.isExpressionStatement(item)) {
        var expression = item.expression;
        if (types.isCallExpression(expression)) {
            if (types.isIdentifier(expression.callee)) {
                return expression;
            }
        }
    }
    return null;
};
exports.METADATA_HOOK_NAME = 'useMetadata';
/**
 * Transform useMetadata({...}) onto the component JSON as
 * meta: { metadataHook: { ... }}
 *
 * This function collects metadata and removes the statement from
 * the returned nodes array
 */
var collectMetadata = function (nodes, component, options) {
    var hookNames = new Set((options.jsonHookNames || []).concat(exports.METADATA_HOOK_NAME));
    return nodes.filter(function (node) {
        var hook = getHook(node);
        if (!hook) {
            return true;
        }
        if (types.isIdentifier(hook.callee) && hookNames.has(hook.callee.name)) {
            try {
                component.meta[hook.callee.name] = parseCodeJson(hook.arguments[0]);
                return false;
            }
            catch (e) {
                console.error("Error parsing metadata hook ".concat(hook.callee.name));
                throw e;
            }
        }
        return true;
    });
};
function mapReactIdentifiersInExpression(expression, stateProperties) {
    var setExpressions = stateProperties.map(function (propertyName) { return "set".concat((0, capitalize_1.capitalize)(propertyName)); });
    return (0, babel_transform_1.babelTransformExpression)(
    // foo -> state.foo
    (0, replace_idenifiers_1.replaceIdentifiers)(expression, stateProperties, function (name) { return "state.".concat(name); }), {
        CallExpression: function (path) {
            if (types.isIdentifier(path.node.callee)) {
                if (setExpressions.includes(path.node.callee.name)) {
                    // setFoo -> foo
                    var statePropertyName = uncapitalize(path.node.callee.name.slice(3));
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
    var stateProperties = Object.keys(json.state);
    for (var key in json.state) {
        var value = json.state[key];
        if (typeof value === 'string' && value.startsWith(function_literal_prefix_1.functionLiteralPrefix)) {
            json.state[key] =
                function_literal_prefix_1.functionLiteralPrefix +
                    mapReactIdentifiersInExpression(value.replace(function_literal_prefix_1.functionLiteralPrefix, ''), stateProperties);
        }
    }
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var value = item.bindings[key];
                if (value) {
                    item.bindings[key] = mapReactIdentifiersInExpression(value, stateProperties);
                }
                if (key === 'className') {
                    var currentValue = item.bindings[key];
                    delete item.bindings[key];
                    item.bindings.class = currentValue;
                }
            }
            for (var key in item.properties) {
                if (key === 'class') {
                    var currentValue = item.properties[key];
                    delete item.properties[key];
                    item.properties.class = currentValue;
                }
            }
        }
    });
}
var expressionToNode = function (str) {
    var code = "export default ".concat(str);
    return babel.parse(code).program
        .body[0].declaration;
};
/**
 * Convert <Context.Provider /> to hooks formats by mutating the
 * MitosisComponent tree
 */
function extractContextComponents(json) {
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if (item.name.endsWith('.Provider')) {
                var value = item.bindings.value;
                var name_2 = item.name.split('.')[0];
                var refPath = (0, trace_reference_to_module_path_1.traceReferenceToModulePath)(json.imports, name_2);
                json.context.set[refPath] = {
                    name: name_2,
                    value: value
                        ? (0, exports.parseStateObject)(expressionToNode(value))
                        : undefined,
                };
                this.update((0, create_mitosis_node_1.createMitosisNode)({
                    name: 'Fragment',
                    children: item.children,
                }));
            }
            // TODO: maybe support Context.Consumer:
            // if (item.name.endsWith('.Consumer')) { ... }
        }
    });
}
var isImportOrDefaultExport = function (node) {
    return types.isExportDefaultDeclaration(node) || types.isImportDeclaration(node);
};
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
                        context.builder = {
                            component: (0, create_mitosis_component_1.createMitosisComponent)(),
                        };
                        var keepStatements = path.node.body.filter(function (statement) {
                            return isImportOrDefaultExport(statement);
                        });
                        var cutStatements = path.node.body.filter(function (statement) { return !isImportOrDefaultExport(statement); });
                        subComponentFunctions = path.node.body
                            .filter(function (node) {
                            return !types.isExportDefaultDeclaration(node) &&
                                types.isFunctionDeclaration(node);
                        })
                            .map(function (node) { return "export default ".concat((0, generator_1.default)(node).code); });
                        cutStatements = collectMetadata(cutStatements, context.builder.component, useOptions);
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
                                path.replaceWith(jsonToAst(componentFunctionToJson(node, context)));
                            }
                        }
                    },
                    ImportDeclaration: function (path, context) {
                        // @builder.io/mitosis or React imports compile away
                        if (['react', '@builder.io/mitosis', '@emotion/react'].includes(path.node.source.value)) {
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
                                importObject.imports[specifier.imported.name] = specifier.local.name;
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
                        path.replaceWith(jsonToAst(jsxElementToJson(node)));
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
    mapReactIdentifiers(parsed);
    extractContextComponents(parsed);
    parsed.subComponents = subComponentFunctions.map(function (item) {
        return parseJsx(item, useOptions);
    });
    return parsed;
}
exports.parseJsx = parseJsx;
