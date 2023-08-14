"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSignals = void 0;
var ts_morph_1 = require("ts-morph");
var typescript_project_1 = require("../../helpers/typescript-project");
var findSignals = function (args) {
    var project = args.project, signalSymbol = args.signalSymbol;
    var ast = args.project.getSourceFileOrThrow(args.filePath);
    if (ast === undefined) {
        throw new Error('Could not find AST. Please provide a correct `filePath`.');
    }
    var reactiveValues = {
        props: new Set(),
        state: new Set(),
        context: new Set(),
    };
    var propsSymbol = (0, typescript_project_1.getPropsSymbol)(ast);
    var contextSymbols = (0, typescript_project_1.getContextSymbols)(ast);
    var checkIsSignalSymbol = function (type) { var _a; return ((_a = type.getTargetType()) === null || _a === void 0 ? void 0 : _a.getAliasSymbol()) === signalSymbol; };
    var checkIsOptionalSignal = function (node) {
        var hasUndefined = false;
        var hasSignal = false;
        var perfectMatch = node
            .getType()
            .getUnionTypes()
            .every(function (type) {
            if (type.isUndefined()) {
                hasUndefined = true;
                return true;
            }
            else if (checkIsSignalSymbol(type)) {
                hasSignal = true;
                return true;
            }
            return false;
        });
        return perfectMatch && hasUndefined && hasSignal;
    };
    ast.forEachDescendant(function (parentNode) {
        if (ts_morph_1.Node.isPropertyAccessExpression(parentNode)) {
            var node = parentNode.getExpression();
            var isOptionalAccess = parentNode.hasQuestionDotToken();
            var isSignal = isOptionalAccess
                ? checkIsOptionalSignal(node)
                : checkIsSignalSymbol(node.getType());
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
