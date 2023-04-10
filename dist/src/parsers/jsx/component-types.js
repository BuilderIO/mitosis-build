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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectTypes = exports.isTypeOrInterface = exports.getPropsTypeRef = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var types = babel.types;
var getPropsTypeRef = function (node, context) {
    var _a;
    var param = node.params[0];
    // TODO: component function params name must be props
    if (babel.types.isIdentifier(param) &&
        param.name === 'props' &&
        babel.types.isTSTypeAnnotation(param.typeAnnotation)) {
        var paramIdentifier = babel.types.variableDeclaration('let', [
            babel.types.variableDeclarator(param),
        ]);
        var generatedTypes = (0, generator_1.default)(paramIdentifier)
            .code.replace(/^let\sprops:\s+/, '')
            .replace(/;/g, '');
        if (generatedTypes.startsWith('{')) {
            var propsTypeRef = "".concat((_a = node.id) === null || _a === void 0 ? void 0 : _a.name, "Props");
            context.builder.component.types = __spreadArray(__spreadArray([], (context.builder.component.types || []), true), [
                "export interface ".concat(propsTypeRef, " ").concat(generatedTypes),
            ], false);
            return propsTypeRef;
        }
        return generatedTypes;
    }
    return undefined;
};
exports.getPropsTypeRef = getPropsTypeRef;
var isTypeImport = function (node) {
    var _a;
    return types.isImportDeclaration(node) &&
        node.importKind === 'type' &&
        // Babel adds an implicit JSX type import that we don't want
        ((_a = node.specifiers[0]) === null || _a === void 0 ? void 0 : _a.local.name) !== 'JSX';
};
var isTypeOrInterface = function (node) {
    return types.isTSTypeAliasDeclaration(node) ||
        types.isTSInterfaceDeclaration(node) ||
        (types.isExportNamedDeclaration(node) && types.isTSTypeAliasDeclaration(node.declaration)) ||
        (types.isExportNamedDeclaration(node) && types.isTSInterfaceDeclaration(node.declaration));
};
exports.isTypeOrInterface = isTypeOrInterface;
var getTypesFromNode = function (node, context) {
    var typeStr = (0, generator_1.default)(node).code;
    var _a = context.builder.component.types, types = _a === void 0 ? [] : _a;
    types.push(typeStr);
    context.builder.component.types = types.filter(Boolean);
};
var collectTypes = function (path, context) {
    var node = path.node;
    getTypesFromNode(node, context);
    path.remove();
};
exports.collectTypes = collectTypes;
