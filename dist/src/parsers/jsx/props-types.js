"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOptionalProps = void 0;
var ts_morph_1 = require("ts-morph");
var typescript_project_1 = require("../../helpers/typescript-project");
var findOptionalProps = function (args) {
    var ast = args.project.getSourceFileOrThrow(args.filePath);
    if (ast === undefined) {
        throw new Error('Could not find AST. Please provide either `code` or `filePath` configs.');
    }
    var propsSymbol = (0, typescript_project_1.getPropsSymbol)(ast);
    if (!propsSymbol)
        return [];
    return propsSymbol
        .getDeclarations()[0]
        .getType()
        .getProperties()
        .map(function (p) { return p.getDeclarations()[0]; })
        .filter(function (k) {
        return ts_morph_1.PropertySignature.isPropertySignature(k) && k.hasQuestionToken();
    })
        .map(function (k) { return k.getName(); });
};
exports.findOptionalProps = findOptionalProps;
