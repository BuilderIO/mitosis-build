"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSignals = void 0;
var ts_morph_1 = require("ts-morph");
var typescript_project_1 = require("../../helpers/typescript-project");
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
    var propsSymbol = (0, typescript_project_1.getPropsSymbol)(ast);
    var contextSymbols = (0, typescript_project_1.getContextSymbols)(ast);
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
