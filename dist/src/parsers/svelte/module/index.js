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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseModule = void 0;
var astring_1 = require("astring");
var compiler_1 = require("svelte/compiler");
function handleExportNamedDeclaration(json, node) {
    var _a;
    var _b, _c, _d;
    var declarations = (_b = node.declaration) === null || _b === void 0 ? void 0 : _b.declarations;
    if (declarations === null || declarations === void 0 ? void 0 : declarations.length) {
        var declaration = declarations[0];
        var property = declaration.id.name;
        var isFunction = ((_c = declaration.init) === null || _c === void 0 ? void 0 : _c.type) === 'FunctionExpression' ||
            ((_d = declaration.init) === null || _d === void 0 ? void 0 : _d.type) === 'ArrowFunctionExpression';
        var exportObject = (_a = {},
            _a[property] = {
                code: (0, astring_1.generate)(node),
                isFunction: isFunction,
            },
            _a);
        json.exports = __assign(__assign({}, json.exports), exportObject);
    }
}
function parseModule(ast, json) {
    (0, compiler_1.walk)(ast.module, {
        enter: function (node) {
            switch (node.type) {
                case 'ExportNamedDeclaration':
                    handleExportNamedDeclaration(json, node);
                    break;
            }
        },
    });
}
exports.parseModule = parseModule;
