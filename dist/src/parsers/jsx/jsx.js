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
exports.parseJsx = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var plugin_syntax_typescript_1 = __importDefault(require("@babel/plugin-syntax-typescript"));
var preset_typescript_1 = __importDefault(require("@babel/preset-typescript"));
var function_1 = require("fp-ts/lib/function");
var hooks_1 = require("../../constants/hooks");
var create_mitosis_component_1 = require("../../helpers/create-mitosis-component");
var json_1 = require("../../helpers/json");
var replace_new_lines_in_strings_1 = require("../../helpers/replace-new-lines-in-strings");
var signals_1 = require("../../helpers/signals");
var ast_1 = require("./ast");
var component_types_1 = require("./component-types");
var context_1 = require("./context");
var element_parser_1 = require("./element-parser");
var exports_1 = require("./exports");
var function_parser_1 = require("./function-parser");
var helpers_1 = require("./helpers");
var hooks_2 = require("./hooks");
var use_target_1 = require("./hooks/use-target");
var imports_1 = require("./imports");
var props_1 = require("./props");
var props_types_1 = require("./props-types");
var signals_2 = require("./signals");
var state_1 = require("./state");
var types = babel.types;
var typescriptBabelPreset = [preset_typescript_1.default, { isTSX: true, allExtensions: true }];
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
function parseJsx(jsx, _options) {
    var _a;
    if (_options === void 0) { _options = {}; }
    var subComponentFunctions = [];
    var options = __assign({ typescript: false }, _options);
    var jsxToUse = options.typescript
        ? jsx
        : // strip typescript types by running through babel's TS preset.
            (_a = babel.transform(jsx, {
                configFile: false,
                babelrc: false,
                presets: [typescriptBabelPreset],
            })) === null || _a === void 0 ? void 0 : _a.code;
    var output = babel.transform(jsxToUse, {
        configFile: false,
        babelrc: false,
        comments: false,
        plugins: [
            [plugin_syntax_typescript_1.default, { isTSX: true }],
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
                        var keepStatements = path.node.body.filter(function (statement) { return (0, helpers_1.isImportOrDefaultExport)(statement) || (0, component_types_1.isTypeOrInterface)(statement); });
                        context.builder.component.exports = (0, exports_1.generateExports)(path);
                        subComponentFunctions = path.node.body
                            .filter(function (node) {
                            return !types.isExportDefaultDeclaration(node) && types.isFunctionDeclaration(node);
                        })
                            .map(function (node) { return "export default ".concat((0, generator_1.default)(node).code); });
                        var preComponentCode = (0, function_1.pipe)(path.node.body.filter(function (statement) { return !(0, helpers_1.isImportOrDefaultExport)(statement); }), (0, hooks_2.collectModuleScopeHooks)(context.builder.component, options), types.program, generator_1.default, function (generatorResult) { return generatorResult.code; });
                        // TODO: support multiple? e.g. for others to add imports?
                        context.builder.component.hooks.preComponent = { code: preComponentCode };
                        path.replaceWith(types.program(keepStatements));
                    },
                    FunctionDeclaration: function (path, context) {
                        var node = path.node;
                        if (types.isIdentifier(node.id)) {
                            var name_1 = node.id.name;
                            if (name_1[0].toUpperCase() === name_1[0]) {
                                path.traverse({
                                    /**
                                     * Plugin to find all `useTarget()` assignment calls inside of the component function body
                                     * and replace them with a magic string.
                                     */
                                    CallExpression: function (path) {
                                        var _a;
                                        if (!types.isCallExpression(path.node))
                                            return;
                                        if (!types.isIdentifier(path.node.callee))
                                            return;
                                        if (path.node.callee.name !== hooks_1.HOOKS.TARGET)
                                            return;
                                        var targetBlock = (0, use_target_1.getUseTargetStatements)(path);
                                        if (!targetBlock)
                                            return;
                                        var blockId = (0, use_target_1.getTargetId)(context.builder.component);
                                        // replace the useTarget() call with a magic string
                                        path.replaceWith(types.stringLiteral((0, use_target_1.getMagicString)(blockId)));
                                        // store the target block in the component
                                        context.builder.component.targetBlocks = __assign(__assign({}, context.builder.component.targetBlocks), (_a = {}, _a[blockId] = targetBlock, _a));
                                    },
                                });
                                path.replaceWith((0, ast_1.jsonToAst)((0, function_parser_1.componentFunctionToJson)(node, context)));
                            }
                        }
                    },
                    ImportDeclaration: function (path, context) {
                        (0, imports_1.handleImportDeclaration)({ options: options, path: path, context: context });
                    },
                    ExportDefaultDeclaration: function (path) {
                        path.replaceWith(path.node.declaration);
                    },
                    JSXElement: function (path) {
                        var node = path.node;
                        path.replaceWith((0, ast_1.jsonToAst)((0, element_parser_1.jsxElementToJson)(node)));
                    },
                    ExportNamedDeclaration: function (path, context) {
                        var node = path.node;
                        if (babel.types.isTSInterfaceDeclaration(node.declaration) ||
                            babel.types.isTSTypeAliasDeclaration(node.declaration)) {
                            (0, component_types_1.collectTypes)(path, context);
                        }
                    },
                    TSTypeAliasDeclaration: function (path, context) {
                        (0, component_types_1.collectTypes)(path, context);
                    },
                    TSInterfaceDeclaration: function (path, context) {
                        (0, component_types_1.collectTypes)(path, context);
                    },
                },
            }); },
        ],
    });
    if (!output || !output.code) {
        throw new Error('Could not parse JSX');
    }
    var stringifiedMitosisComponent = (0, replace_new_lines_in_strings_1.stripNewlinesInStrings)(output.code
        .trim()
        // Occasional issues where comments get kicked to the top. Full fix should strip these sooner
        .replace(/^\/\*[\s\S]*?\*\/\s*/, '')
        // Weird bug with adding a newline in a normal at end of a normal string that can't have one
        // If not one-off find full solve and cause
        .replace(/\n"/g, '"')
        .replace(/^\({/, '{')
        .replace(/}\);$/, '}'));
    var mitosisComponent = (0, json_1.tryParseJson)(stringifiedMitosisComponent);
    (0, state_1.mapStateIdentifiers)(mitosisComponent);
    (0, context_1.extractContextComponents)(mitosisComponent);
    mitosisComponent.subComponents = subComponentFunctions.map(function (item) { return parseJsx(item, options); });
    var signalTypeImportName = (0, signals_1.getSignalImportName)(jsxToUse);
    if (signalTypeImportName) {
        mitosisComponent.signals = { signalTypeImportName: signalTypeImportName };
    }
    if (options.tsProject && options.filePath) {
        // identify optional props.
        var optionalProps = (0, props_types_1.findOptionalProps)({
            project: options.tsProject.project,
            filePath: options.filePath,
        });
        optionalProps.forEach(function (prop) {
            var _a;
            var _b;
            mitosisComponent.props = __assign(__assign({}, mitosisComponent.props), (_a = {}, _a[prop] = __assign(__assign({}, (_b = mitosisComponent.props) === null || _b === void 0 ? void 0 : _b[prop]), { optional: true }), _a));
        });
        var reactiveValues = (0, signals_2.findSignals)({
            filePath: options.filePath,
            project: options.tsProject.project,
            signalSymbol: options.tsProject.signalSymbol,
        });
        reactiveValues.props.forEach(function (prop) {
            var _a;
            var _b;
            mitosisComponent.props = __assign(__assign({}, mitosisComponent.props), (_a = {}, _a[prop] = __assign(__assign({}, (_b = mitosisComponent.props) === null || _b === void 0 ? void 0 : _b[prop]), { propertyType: 'reactive' }), _a));
        });
        reactiveValues.state.forEach(function (state) {
            if (!mitosisComponent.state[state])
                return;
            mitosisComponent.state[state].propertyType = 'reactive';
        });
        reactiveValues.context.forEach(function (context) {
            if (!mitosisComponent.context.get[context])
                return;
            mitosisComponent.context.get[context].type = 'reactive';
        });
    }
    return mitosisComponent;
}
exports.parseJsx = parseJsx;
