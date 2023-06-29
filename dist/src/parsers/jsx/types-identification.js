"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSignals = exports.createTypescriptProject = exports.mapSignalTypeInTSFile = exports.mapSignalType = exports.getSignalImportName = exports.getSignalMitosisImportForTarget = void 0;
var core_1 = require("@babel/core");
var function_1 = require("fp-ts/lib/function");
var ts_morph_1 = require("ts-morph");
var babel_transform_1 = require("../../helpers/babel-transform");
var imports_1 = require("./imports");
var getSignalMappingForTarget = function (target) {
    switch (target) {
        case 'svelte':
            var importDeclaration = core_1.types.importDeclaration([core_1.types.importSpecifier(core_1.types.identifier('Writable'), core_1.types.identifier('Writable'))], core_1.types.stringLiteral('svelte/store'));
            importDeclaration.importKind = 'type';
            return {
                getTypeReference: function (generics) {
                    if (generics === void 0) { generics = []; }
                    return core_1.types.tsTypeReference(core_1.types.identifier('Writable'), core_1.types.tsTypeParameterInstantiation(generics));
                },
                importDeclaration: importDeclaration,
            };
        default:
            return undefined;
    }
};
var getSignalMitosisImportForTarget = function (target) {
    var signalType = getSignalMappingForTarget(target);
    if (!signalType) {
        return undefined;
    }
    return (0, imports_1.mapImportDeclarationToMitosisImport)(signalType.importDeclaration);
};
exports.getSignalMitosisImportForTarget = getSignalMitosisImportForTarget;
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
        throw new Error('Could not find Signal symbol');
    }
    return signalSymbol;
};
var getSignalImportName = function (code) {
    var foundSignalUsage = false;
    var signalImportName = undefined;
    (0, babel_transform_1.babelTransformExpression)(code, {
        ImportSpecifier: function (path) {
            if (core_1.types.isIdentifier(path.node.imported) && path.node.imported.name === 'Signal') {
                if (path.parentPath.isImportDeclaration() &&
                    path.parentPath.node.source.value === '@builder.io/mitosis') {
                    /**
                     * in case the import is aliased, we need to use the local name,
                     * e.g. `import { Signal as MySignal } from '@builder.io/mitosis'`
                     */
                    signalImportName = path.node.local.name;
                    path.stop();
                }
            }
        },
    });
    if (!signalImportName) {
        return undefined;
    }
    (0, babel_transform_1.babelTransformExpression)(code, {
        TSTypeReference: function (path) {
            if (core_1.types.isIdentifier(path.node.typeName) && path.node.typeName.name === signalImportName) {
                foundSignalUsage = true;
                path.stop();
            }
        },
    });
    return foundSignalUsage ? signalImportName : undefined;
};
exports.getSignalImportName = getSignalImportName;
var addSignalImport = function (_a) {
    var code = _a.code, target = _a.target;
    var signalType = getSignalMappingForTarget(target);
    if (!signalType) {
        return code;
    }
    return (0, babel_transform_1.babelTransformExpression)(code, {
        Program: function (path) {
            path.node.body.unshift(signalType.importDeclaration);
        },
    });
};
/**
 * Finds all `Signal` types and replaces them with the correct type for the given target.
 * e.g. `Signal<string>` becomes `Writable<string>` for Svelte.
 */
var mapSignalType = function (_a) {
    var code = _a.code, target = _a.target, _b = _a.signalImportName, signalImportName = _b === void 0 ? (0, exports.getSignalImportName)(code) : _b;
    var signalType = getSignalMappingForTarget(target);
    return (0, babel_transform_1.babelTransformExpression)(code, {
        TSTypeReference: function (path) {
            var _a;
            if (core_1.types.isIdentifier(path.node.typeName) && path.node.typeName.name === signalImportName) {
                var params = ((_a = path.node.typeParameters) === null || _a === void 0 ? void 0 : _a.params) || [];
                var newType = (signalType === null || signalType === void 0 ? void 0 : signalType.getTypeReference)
                    ? signalType.getTypeReference(params)
                    : // if no mapping exists, drop `Signal` and just use the generic type passed to `Signal` as-is.
                        params[0];
                path.replaceWith(newType);
            }
        },
    });
};
exports.mapSignalType = mapSignalType;
/**
 * Processes the `Signal` type usage in a plain TS file:
 * - Finds the Signal import name
 * - Maps the Signal type to the target's equivalent
 * - Adds the equivalent of the Signal import to the file
 */
var mapSignalTypeInTSFile = function (_a) {
    var code = _a.code, target = _a.target;
    var signalImportName = (0, exports.getSignalImportName)(code);
    if (!signalImportName) {
        return code;
    }
    return (0, function_1.pipe)((0, exports.mapSignalType)({ target: target, code: code, signalImportName: signalImportName }), function (code) {
        return addSignalImport({ code: code, target: target });
    });
};
exports.mapSignalTypeInTSFile = mapSignalTypeInTSFile;
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
var getPropsSymbol = function (ast) {
    var propsSymbol = undefined;
    ast.forEachChild(function (node) {
        var _a;
        if (propsSymbol !== undefined)
            return;
        if (ts_morph_1.Node.isArrowFunction(node) || ts_morph_1.Node.isFunctionDeclaration(node)) {
            if (node.hasModifier(ts_morph_1.SyntaxKind.ExportKeyword) &&
                node.hasModifier(ts_morph_1.SyntaxKind.DefaultKeyword)) {
                propsSymbol = (_a = node.getParameters()[0]) === null || _a === void 0 ? void 0 : _a.getSymbol();
            }
        }
    });
    return propsSymbol;
};
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
var findSignals = function (args) {
    var project = args.project, signalSymbol = args.signalSymbol;
    var ast = args.code
        ? args.project.createSourceFile('homepage2.lite.tsx', args.code)
        : args.filePath
            ? args.project.getSourceFileOrThrow(args.filePath)
            : undefined;
    if (ast === undefined) {
        throw new Error('Could not find AST. Please provide either `code` or `filePath` configs.');
    }
    var reactiveValues = {
        props: new Set(),
        state: new Set(),
        context: new Set(),
    };
    var propsSymbol = getPropsSymbol(ast);
    var contextSymbols = getContextSymbols(ast);
    ast.forEachDescendant(function (parentNode) {
        var _a;
        if (ts_morph_1.Node.isPropertyAccessExpression(parentNode)) {
            var node = parentNode.getExpression();
            var aliasSymbol = (_a = node.getType().getTargetType()) === null || _a === void 0 ? void 0 : _a.getAliasSymbol();
            var isSignal = aliasSymbol === signalSymbol;
            if (!isSignal)
                return;
            var isInsideType_1 = false;
            var isInsideDeclaration = false;
            node.getParentWhile(function (parent, child) {
                // stop once we hit the function block
                if (ts_morph_1.Node.isBlock(child) || ts_morph_1.Node.isBlock(parent)) {
                    return false;
                }
                // crawl up parents to make sure we're not inside a type
                if (ts_morph_1.Node.isTypeNode(parent) || ts_morph_1.Node.isTypeAliasDeclaration(parent)) {
                    isInsideType_1 = true;
                    return false;
                }
                return true;
            });
            if (isInsideType_1)
                return;
            if (isInsideDeclaration)
                return;
            var nodeSymbol = node.getSymbol();
            if (ts_morph_1.Node.isPropertyAccessExpression(node) &&
                node.getExpression().getSymbol() === propsSymbol) {
                reactiveValues.props.add(node.getNameNode().getText());
            }
            else if (nodeSymbol && contextSymbols.has(nodeSymbol)) {
                reactiveValues.context.add(node.getText());
            }
            else {
                reactiveValues.state.add(node.getText());
            }
        }
    });
    return reactiveValues;
};
exports.findSignals = findSignals;
