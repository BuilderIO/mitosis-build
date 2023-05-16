"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInstance = void 0;
var astring_1 = require("astring");
var compiler_1 = require("svelte/compiler");
var context_1 = require("./context");
var expressions_1 = require("./expressions");
var functions_1 = require("./functions");
var hooks_1 = require("./hooks");
var imports_1 = require("./imports");
var properties_1 = require("./properties");
var reactive_1 = require("./reactive");
var references_1 = require("./references");
var statements_1 = require("./statements");
var handleImportDeclaration = function (json, node) {
    (0, imports_1.parseImports)(json, node);
};
var handleExportNamedDeclaration = function (json, node) {
    (0, properties_1.parseProperties)(json, node);
};
var handleMemberExpression = function (json, node, parent) {
    (0, expressions_1.parseMemberExpression)(json, node, parent);
};
var handleExpressionStatement = function (json, node, parent) {
    var _a;
    if (node.expression.type === 'CallExpression') {
        if (node.expression.callee.type === 'MemberExpression') {
            handleMemberExpression(json, node, parent);
            return;
        }
        var callee = node.expression.callee;
        switch (callee.name) {
            case 'setContext': {
                (0, context_1.parseSetContext)(json, node);
                break;
            }
            case 'onMount': {
                (0, hooks_1.parseOnMount)(json, node);
                break;
            }
            case 'onDestroy': {
                (0, hooks_1.parseOnDestroy)(json, node);
                break;
            }
            case 'onAfterUpdate': {
                (0, hooks_1.parseAfterUpdate)(json, node);
                break;
            }
        }
        // No default
    }
    else if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'Program') {
        var onMountCode = ((_a = json.hooks.onMount) === null || _a === void 0 ? void 0 : _a.code) || '';
        json.hooks.onMount = {
            code: "".concat(onMountCode, "\n").concat((0, astring_1.generate)(node), ";\n"),
        };
    }
};
var handleFunctionDeclaration = function (json, node) {
    (0, functions_1.parseFunctions)(json, node);
};
var handleVariableDeclaration = function (json, node) {
    var _a, _b, _c, _d;
    var init = (_a = node.declarations[0]) === null || _a === void 0 ? void 0 : _a.init;
    if ((init === null || init === void 0 ? void 0 : init.type) === 'CallExpression' && ((_b = init === null || init === void 0 ? void 0 : init.callee) === null || _b === void 0 ? void 0 : _b.name) === 'getContext') {
        (0, context_1.parseGetContext)(json, node);
    }
    else if ((init === null || init === void 0 ? void 0 : init.type) === 'CallExpression' &&
        ((_c = init === null || init === void 0 ? void 0 : init.callee) === null || _c === void 0 ? void 0 : _c.name) === 'hasContext') {
        (0, context_1.parseHasContext)(json, node);
    }
    else if ((init === null || init === void 0 ? void 0 : init.type) === 'CallExpression' &&
        ((_d = init === null || init === void 0 ? void 0 : init.callee) === null || _d === void 0 ? void 0 : _d.name) === 'createEventDispatcher') {
        // ignore
    }
    else {
        (0, references_1.parseReferences)(json, node);
    }
};
var handleLabeledStatement = function (json, node) {
    if (node.label.name === '$') {
        (0, reactive_1.parseReactive)(json, node);
    }
};
var handleStatement = function (json, node, parent) {
    if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'Program') {
        (0, statements_1.parseStatementAtProgramLevel)(json, node);
    }
};
function parseInstance(ast, json) {
    (0, compiler_1.walk)(ast.instance, {
        enter: function (node, parent) {
            switch (node.type) {
                case 'ImportDeclaration':
                    handleImportDeclaration(json, node);
                    break;
                case 'ExportNamedDeclaration':
                    handleExportNamedDeclaration(json, node);
                    break;
                case 'ExpressionStatement':
                    handleExpressionStatement(json, node, parent);
                    break;
                case 'FunctionDeclaration':
                    handleFunctionDeclaration(json, node);
                    break;
                case 'VariableDeclaration':
                    parent.type === 'Program' && handleVariableDeclaration(json, node);
                    break;
                case 'LabeledStatement':
                    handleLabeledStatement(json, node);
                    break;
                case 'IfStatement':
                case 'SwitchStatement':
                case 'TryStatement':
                case 'DoWhileStatement':
                case 'ForStatement':
                case 'ForInStatement':
                case 'ForOfStatement':
                    handleStatement(json, node, parent);
                    break;
            }
        },
    });
}
exports.parseInstance = parseInstance;
