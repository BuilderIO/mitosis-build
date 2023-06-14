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
exports.processHookCode = exports.getHook = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var types = babel.types;
var getHook = function (node) {
    var item = node;
    if (types.isExpressionStatement(item)) {
        var expression = item.expression;
        if (types.isCallExpression(expression)) {
            if (types.isIdentifier(expression.callee)) {
                return expression;
            }
        }
    }
    return null;
};
exports.getHook = getHook;
var processHookCode = function (firstArg) {
    return (0, generator_1.default)(firstArg.body)
        .code.trim()
        // Remove arbitrary block wrapping if any
        // AKA
        //  { console.log('hi') } -> console.log('hi')
        .replace(/^{/, '')
        .replace(/}$/, '')
        .trim();
};
exports.processHookCode = processHookCode;
