"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypescriptProject = exports.getContextSymbols = exports.getPropsSymbol = exports.removeMitosisImport = void 0;
var ts_morph_1 = require("ts-morph");
var babel_transform_1 = require("./babel-transform");
var removeMitosisImport = function (code) {
    return (0, babel_transform_1.babelTransformExpression)(code, {
        ImportDeclaration: function (path) {
            if (path.node.source.value === '@builder.io/mitosis') {
                path.remove();
            }
        },
    });
};
exports.removeMitosisImport = removeMitosisImport;
var getPropsSymbol = function (ast) {
    var propsSymbol = undefined;
    return ast.forEachChild(function (node) {
        var _a;
        if (propsSymbol !== undefined)
            return undefined;
        if (ts_morph_1.Node.isArrowFunction(node) || ts_morph_1.Node.isFunctionDeclaration(node)) {
            if (node.hasModifier(ts_morph_1.SyntaxKind.ExportKeyword) &&
                node.hasModifier(ts_morph_1.SyntaxKind.DefaultKeyword)) {
                propsSymbol = (_a = node.getParameters()[0]) === null || _a === void 0 ? void 0 : _a.getSymbol();
                return propsSymbol;
            }
        }
        return undefined;
    });
};
exports.getPropsSymbol = getPropsSymbol;
var getContextSymbols = function (ast) {
    var contextSymbols = new Set();
    ast.forEachDescendant(function (node) {
        if (!ts_morph_1.Node.isVariableDeclaration(node))
            return;
        var initializer = node.getInitializer();
        if (!ts_morph_1.Node.isCallExpression(initializer))
            return;
        if (initializer.getExpression().getText() !== 'useContext')
            return;
        var contextSymbol = node.getNameNode().getSymbol();
        if (contextSymbol === undefined)
            return;
        contextSymbols.add(contextSymbol);
    });
    return contextSymbols;
};
exports.getContextSymbols = getContextSymbols;
var getSignalSymbol = function (project) {
    var symbolExport = project.createSourceFile('homepage3.lite.tsx', "import { Signal } from '@builder.io/mitosis';");
    // Find the original Signal symbol
    var signalSymbol = undefined;
    symbolExport.forEachDescendant(function (node) {
        var _a;
        if (ts_morph_1.Node.isImportSpecifier(node)) {
            signalSymbol = (_a = node.getSymbol()) === null || _a === void 0 ? void 0 : _a.getAliasedSymbol();
        }
    });
    if (signalSymbol === undefined) {
        throw new Error('Could not find the Mitosis Signal symbol in your TS project. Is `@builder.io/mitosis` installed correctly?');
    }
    return signalSymbol;
};
var getProject = function (tsConfigFilePath) {
    try {
        return new ts_morph_1.Project({ tsConfigFilePath: tsConfigFilePath });
    }
    catch (err) {
        throw new Error('Error creating Typescript Project. Make sure `tsConfigFilePath` points to a valid tsconfig.json file');
    }
};
var createTypescriptProject = function (tsConfigFilePath) {
    var project = getProject(tsConfigFilePath);
    var signalSymbol = getSignalSymbol(project);
    return { project: project, signalSymbol: signalSymbol };
};
exports.createTypescriptProject = createTypescriptProject;
