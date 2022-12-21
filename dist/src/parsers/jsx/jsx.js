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
var create_mitosis_component_1 = require("../../helpers/create-mitosis-component");
var replace_new_lines_in_strings_1 = require("../../helpers/replace-new-lines-in-strings");
var json_1 = require("../../helpers/json");
var ast_1 = require("./ast");
var state_1 = require("./state");
var hooks_1 = require("./hooks");
var context_1 = require("./context");
var helpers_1 = require("./helpers");
var component_types_1 = require("./component-types");
var props_1 = require("./props");
var exports_1 = require("./exports");
var function_1 = require("fp-ts/lib/function");
var imports_1 = require("./imports");
var element_parser_1 = require("./element-parser");
var function_parser_1 = require("./function-parser");
var jsxPlugin = require('@babel/plugin-syntax-jsx');
var tsPreset = require('@babel/preset-typescript');
var types = babel.types;
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
    if (_options === void 0) { _options = {}; }
    var subComponentFunctions = [];
    var options = __assign({ typescript: false }, _options);
    var output = babel.transform(jsx, {
        configFile: false,
        babelrc: false,
        comments: false,
        presets: [
            [
                tsPreset,
                {
                    isTSX: true,
                    allExtensions: true,
                    // If left to its default `false`, then this will strip away:
                    // - unused JS imports
                    // - types imports within regular JS import syntax
                    // When outputting to TS, we must set it to `true` to preserve these imports.
                    onlyRemoveTypeImports: options.typescript,
                },
            ],
        ],
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
                        var keepStatements = path.node.body.filter(function (statement) { return (0, helpers_1.isImportOrDefaultExport)(statement) || (0, component_types_1.isTypeOrInterface)(statement); });
                        (0, component_types_1.handleTypeImports)(path, context);
                        context.builder.component.exports = (0, exports_1.generateExports)(path);
                        subComponentFunctions = path.node.body
                            .filter(function (node) {
                            return !types.isExportDefaultDeclaration(node) && types.isFunctionDeclaration(node);
                        })
                            .map(function (node) { return "export default ".concat((0, generator_1.default)(node).code); });
                        var preComponentCode = (0, function_1.pipe)(path.node.body.filter(function (statement) { return !(0, helpers_1.isImportOrDefaultExport)(statement); }), function (statements) {
                            return (0, hooks_1.collectModuleScopeHooks)(statements, context.builder.component, options);
                        }, types.program, generator_1.default, function (generatorResult) { return generatorResult.code; });
                        // TODO: support multiple? e.g. for others to add imports?
                        context.builder.component.hooks.preComponent = { code: preComponentCode };
                        path.replaceWith(types.program(keepStatements));
                    },
                    FunctionDeclaration: function (path, context) {
                        var node = path.node;
                        if (types.isIdentifier(node.id)) {
                            var name_1 = node.id.name;
                            if (name_1[0].toUpperCase() === name_1[0]) {
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
                            (0, component_types_1.collectTypes)(path.node, context);
                        }
                    },
                    TSTypeAliasDeclaration: function (path, context) {
                        (0, component_types_1.collectTypes)(path.node, context);
                    },
                    TSInterfaceDeclaration: function (path, context) {
                        (0, component_types_1.collectTypes)(path.node, context);
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
    (0, state_1.mapStateIdentifiers)(parsed);
    (0, context_1.extractContextComponents)(parsed);
    parsed.subComponents = subComponentFunctions.map(function (item) { return parseJsx(item, options); });
    return parsed;
}
exports.parseJsx = parseJsx;
