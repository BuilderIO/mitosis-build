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
exports.collectInterfaces = exports.collectTypes = exports.isTypeOrInterface = exports.getPropsTypeRef = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var types = babel.types;
var getPropsTypeRef = function (node) {
    var param = node.params[0];
    // TODO: component function params name must be props
    if (babel.types.isIdentifier(param) &&
        param.name === 'props' &&
        babel.types.isTSTypeAnnotation(param.typeAnnotation)) {
        var paramIdentifier = babel.types.variableDeclaration('let', [
            babel.types.variableDeclarator(param),
        ]);
        return (0, generator_1.default)(paramIdentifier)
            .code.replace(/^let\sprops:\s+/, '')
            .replace(/;/g, '');
    }
    return undefined;
};
exports.getPropsTypeRef = getPropsTypeRef;
var isTypeOrInterface = function (node) {
    return types.isTSTypeAliasDeclaration(node) ||
        types.isTSInterfaceDeclaration(node) ||
        (types.isExportNamedDeclaration(node) && types.isTSTypeAliasDeclaration(node.declaration)) ||
        (types.isExportNamedDeclaration(node) && types.isTSInterfaceDeclaration(node.declaration));
};
exports.isTypeOrInterface = isTypeOrInterface;
var collectTypes = function (node, context) {
    var typeStr = (0, generator_1.default)(node).code;
    var _a = context.builder.component.types, types = _a === void 0 ? [] : _a;
    types.push(typeStr);
    context.builder.component.types = types.filter(Boolean);
};
exports.collectTypes = collectTypes;
var collectInterfaces = function (node, context) {
    var interfaceStr = (0, generator_1.default)(node).code;
    var _a = context.builder.component.interfaces, interfaces = _a === void 0 ? [] : _a;
    interfaces.push(interfaceStr);
    context.builder.component.interfaces = interfaces.filter(Boolean);
};
exports.collectInterfaces = collectInterfaces;
