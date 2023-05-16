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
exports.isCodeBodyIdentifier = exports.isExpression = exports.isCodeBodyExpression = exports.parseCode = void 0;
var babel = __importStar(require("@babel/core"));
var plugin_syntax_decorators_1 = __importDefault(require("@babel/plugin-syntax-decorators"));
var plugin_syntax_typescript_1 = __importDefault(require("@babel/plugin-syntax-typescript"));
var preset_typescript_1 = __importDefault(require("@babel/preset-typescript"));
function parseCode(code) {
    var ast = babel.parse(code, {
        presets: [[preset_typescript_1.default, { isTSX: true, allExtensions: true }]],
        plugins: [
            [plugin_syntax_typescript_1.default, { isTSX: true }],
            [plugin_syntax_decorators_1.default, { legacy: true }],
        ],
    });
    var body = babel.types.isFile(ast)
        ? ast.program.body
        : babel.types.isProgram(ast)
            ? ast.body
            : [];
    return body;
}
exports.parseCode = parseCode;
var isCodeBodyExpression = function (body) {
    return body.length == 1 &&
        (babel.types.isExpression(body[0]) || babel.types.isExpressionStatement(body[0]));
};
exports.isCodeBodyExpression = isCodeBodyExpression;
/**
 * Returns `true` if the `code` is a valid expression. (vs a statement)
 */
function isExpression(code) {
    try {
        var body = parseCode(code);
        return (0, exports.isCodeBodyExpression)(body);
    }
    catch (e) {
        return false;
    }
}
exports.isExpression = isExpression;
var isCodeBodyIdentifier = function (body) {
    return body.length == 1 && babel.types.isIdentifier(body[0]);
};
exports.isCodeBodyIdentifier = isCodeBodyIdentifier;
