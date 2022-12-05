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
exports.transformAttributeName = exports.HTML_ATTR_FROM_JSX = exports.isImportOrDefaultExport = exports.parseCodeJson = exports.parseCode = exports.uncapitalize = exports.selfClosingTags = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var json_1 = require("../../helpers/json");
var typescript_1 = require("../../helpers/typescript");
var types = babel.types;
exports.selfClosingTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);
var uncapitalize = function (str) {
    if (!str) {
        return str;
    }
    return str[0].toLowerCase() + str.slice(1);
};
exports.uncapitalize = uncapitalize;
var parseCode = function (node) {
    return (0, generator_1.default)(node).code;
};
exports.parseCode = parseCode;
var parseCodeJson = function (node) {
    var code = (0, exports.parseCode)(node);
    return (0, json_1.tryParseJson)(code);
};
exports.parseCodeJson = parseCodeJson;
var isImportOrDefaultExport = function (node) {
    return types.isExportDefaultDeclaration(node) || types.isImportDeclaration(node);
};
exports.isImportOrDefaultExport = isImportOrDefaultExport;
exports.HTML_ATTR_FROM_JSX = {
    htmlFor: 'for',
};
var transformAttributeName = function (name) {
    if ((0, typescript_1.objectHasKey)(exports.HTML_ATTR_FROM_JSX, name))
        return exports.HTML_ATTR_FROM_JSX[name];
    return name;
};
exports.transformAttributeName = transformAttributeName;
