"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSignalTypeInTSFile = exports.mapSignalType = exports.getSignalImportName = exports.getSignalMitosisImportForTarget = void 0;
var core_1 = require("@babel/core");
var function_1 = require("fp-ts/lib/function");
var babel_transform_1 = require("../../helpers/babel-transform");
var mitosis_imports_1 = require("../mitosis-imports");
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
    return (0, mitosis_imports_1.mapImportDeclarationToMitosisImport)(signalType.importDeclaration);
};
exports.getSignalMitosisImportForTarget = getSignalMitosisImportForTarget;
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
    var map = function (path) {
        var _a;
        if (core_1.types.isIdentifier(path.node.typeName) && path.node.typeName.name === signalImportName) {
            var params = ((_a = path.node.typeParameters) === null || _a === void 0 ? void 0 : _a.params) || [];
            var newType = (signalType === null || signalType === void 0 ? void 0 : signalType.getTypeReference)
                ? signalType.getTypeReference(params)
                : // if no mapping exists, drop `Signal` and just use the generic type passed to `Signal` as-is.
                    params[0];
            path.replaceWith(newType);
        }
    };
    return (0, babel_transform_1.babelTransformExpression)(code, {
        TSTypeReference: function (path) {
            map(path);
        },
    });
};
exports.mapSignalType = mapSignalType;
/**
 * Processes the `Signal` type usage in a plain TS file:
 * - Finds the `Signal` import name
 * - Maps the `Signal` type to the target's equivalent
 * - Adds the equivalent of the `Signal` import to the file
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
