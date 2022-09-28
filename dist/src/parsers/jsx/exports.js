"use strict";
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
exports.generateExports = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var component_types_1 = require("./component-types");
var helpers_1 = require("./helpers");
var types = babel.types;
var generateExports = function (path) {
    var exportsOrLocalVariables = path.node.body.filter(function (statement) {
        return !(0, helpers_1.isImportOrDefaultExport)(statement) &&
            !(0, component_types_1.isTypeOrInterface)(statement) &&
            !types.isExpressionStatement(statement);
    });
    return exportsOrLocalVariables.reduce(function (pre, node) {
        var _a, _b;
        var name, isFunction;
        if (babel.types.isExportNamedDeclaration(node)) {
            if (babel.types.isVariableDeclaration(node.declaration) &&
                babel.types.isIdentifier(node.declaration.declarations[0].id)) {
                name = node.declaration.declarations[0].id.name;
                isFunction = babel.types.isFunction(node.declaration.declarations[0].init);
            }
            if (babel.types.isFunctionDeclaration(node.declaration)) {
                name = (_a = node.declaration.id) === null || _a === void 0 ? void 0 : _a.name;
                isFunction = true;
            }
        }
        else {
            if (babel.types.isVariableDeclaration(node) &&
                babel.types.isIdentifier(node.declarations[0].id)) {
                name = node.declarations[0].id.name;
                isFunction = babel.types.isFunction(node.declarations[0].init);
            }
            if (babel.types.isFunctionDeclaration(node)) {
                name = (_b = node.id) === null || _b === void 0 ? void 0 : _b.name;
                isFunction = true;
            }
        }
        if (name) {
            pre[name] = {
                code: (0, generator_1.default)(node).code,
                isFunction: isFunction,
            };
        }
        else {
            console.warn('Could not parse export or variable: ignoring node', node);
        }
        return pre;
    }, {});
};
exports.generateExports = generateExports;
