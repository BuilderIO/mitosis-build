"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.babelTransformExpression = exports.babelTransformCode = exports.babelTransform = void 0;
var babel = __importStar(require("@babel/core"));
var lodash_1 = require("lodash");
var jsxPlugin = require('@babel/plugin-syntax-jsx');
var tsPreset = require('@babel/preset-typescript');
var decorators = require('@babel/plugin-syntax-decorators');
var babelTransform = function (code, visitor) {
    return babel.transform(code, {
        sourceFileName: 'file.tsx',
        configFile: false,
        babelrc: false,
        presets: [[tsPreset, { isTSX: true, allExtensions: true }]],
        plugins: [[decorators, { legacy: true }], jsxPlugin, function () { return ({ visitor: visitor }); }],
    });
};
exports.babelTransform = babelTransform;
var babelTransformCode = function (code, visitor) {
    var _a;
    return ((_a = (0, exports.babelTransform)(code, visitor)) === null || _a === void 0 ? void 0 : _a.code) || '';
};
exports.babelTransformCode = babelTransformCode;
var babelTransformExpression = function (code, visitor, type) {
    var _a;
    if (type === void 0) { type = 'unknown'; }
    if (!code) {
        return '';
    }
    // match for object literal like { foo: ... }
    if (type === 'unknown' && code.trim().match(/^\s*{\s*[a-z0-9]+:/i)) {
        type = 'expression';
    }
    // For Builder content
    if (type === 'unknown' &&
        (code.includes('return _virtual_index') ||
            code.trim().startsWith('return ')) &&
        !code.trim().startsWith('function')) {
        type = 'functionBody';
    }
    var useCode = code;
    if (type === 'functionBody') {
        useCode = "function(){".concat(useCode, "}");
    }
    var result = type === 'expression'
        ? null
        : (0, lodash_1.attempt)(function () {
            var _a;
            var result = ((_a = (0, exports.babelTransform)(useCode, visitor)) === null || _a === void 0 ? void 0 : _a.code) || '';
            if (type === 'functionBody') {
                return result.replace(/^function\(\)\{/, '').replace(/\};$/, '');
            }
            else {
                // Babel addes trailing semicolons, but for expressions we need those gone
                // TODO: maybe detect if the original code ended with one, and keep it if so, for the case
                // of appending several fragements
                return result.replace(/;$/, '');
            }
        });
    if ((0, lodash_1.isError)(result) || type === 'expression') {
        try {
            // If it can't, e.g. this is an expression or code fragment, modify the code below and try again
            // Detect method fragments. These get passed sometimes and otherwise
            // generate compile errors. They are of the form `foo() { ... }`
            var isMethod = Boolean(!code.startsWith('function') &&
                code.match(/^[a-z0-9]+\s*\([^\)]*\)\s*[\{:]/i));
            if (isMethod) {
                useCode = "function ".concat(useCode);
            }
            // Parse the code as an expression (instead of the default, a block) by giving it a fake variable assignment
            // e.g. if the code parsed is { ... } babel will treat that as a block by deafult, unless processed as an expression
            // that is an object
            useCode = "let _ = ".concat(useCode);
            result = (((_a = (0, exports.babelTransform)(useCode, visitor)) === null || _a === void 0 ? void 0 : _a.code) || '')
                // Babel addes trailing semicolons, but for expressions we need those gone
                .replace(/;$/, '')
                // Remove our fake variable assignment
                .replace(/let _ =\s/, '');
            if (isMethod) {
                result = result.replace('function', '');
            }
        }
        catch (err) {
            console.error('Error parsing code:\n', code, '\n', result);
            try {
                return (0, exports.babelTransformExpression)(code, visitor, 'functionBody');
            }
            catch (err) {
                throw err;
            }
        }
    }
    if (type === 'functionBody') {
        return result.replace(/^function\s*\(\)\s*\{/, '').replace(/\};?$/, '');
    }
    else {
        // Babel addes trailing semicolons, but for expressions we need those gone
        // TODO: maybe detect if the original code ended with one, and keep it if so, for the case
        // of appending several fragements
        return result.replace(/;$/, '');
    }
};
exports.babelTransformExpression = babelTransformExpression;
