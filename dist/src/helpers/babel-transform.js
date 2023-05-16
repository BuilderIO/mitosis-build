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
exports.convertTypeScriptToJS = exports.babelTransformExpression = exports.babelTransformCode = void 0;
var babel = __importStar(require("@babel/core"));
var plugin_syntax_decorators_1 = __importDefault(require("@babel/plugin-syntax-decorators"));
var plugin_syntax_typescript_1 = __importDefault(require("@babel/plugin-syntax-typescript"));
var preset_typescript_1 = __importDefault(require("@babel/preset-typescript"));
var function_1 = require("fp-ts/lib/function");
var patterns_1 = require("./patterns");
var handleErrorOrExpression = function (_a) {
    var code = _a.code, useCode = _a.useCode, result = _a.result, visitor = _a.visitor, stripTypes = _a.stripTypes;
    try {
        // If it can't, e.g. this is an expression or code fragment, modify the code below and try again
        // Detect method fragments. These get passed sometimes and otherwise
        // generate compile errors. They are of the form `foo() { ... }`
        var isMethod = Boolean(!code.trim().startsWith('function') && code.trim().match(/^[a-z0-9_]+\s*\([^\)]*\)\s*[\{:]/i));
        var isGetter = (0, patterns_1.checkIsGetter)(code);
        var isMethodOrGetter = isMethod || isGetter;
        if (isMethodOrGetter) {
            useCode = "function ".concat(useCode);
        }
        result = (0, function_1.pipe)(
        // Parse the code as an expression (instead of the default, a block) by giving it a fake variable assignment
        // e.g. if the code parsed is { ... } babel will treat that as a block by deafult, unless processed as an expression
        // that is an object
        "let _ = ".concat(useCode), function (code) { return (0, exports.babelTransformCode)(code, visitor, stripTypes); }, trimSemicolons, 
        // Remove our fake variable assignment
        function (str) { return str.replace(/let _ =\s/, ''); });
        if (isMethodOrGetter) {
            return result.replace('function', '');
        }
        return result;
    }
    catch (err) {
        // console.error('Error parsing code:\n', { code, result, useCode });
        throw err;
    }
};
var babelTransform = function (_a) {
    var code = _a.code, visitor = _a.visitor, stripTypes = _a.stripTypes;
    return babel.transform(code, __assign(__assign({ sourceFileName: 'file.tsx', configFile: false, babelrc: false, parserOpts: { allowReturnOutsideFunction: true } }, (stripTypes ? { presets: [[preset_typescript_1.default, { isTSX: true, allExtensions: true }]] } : {})), { plugins: __spreadArray([
            [plugin_syntax_typescript_1.default, { isTSX: true }],
            [plugin_syntax_decorators_1.default, { legacy: true }]
        ], (visitor ? [function () { return ({ visitor: visitor }); }] : []), true) }));
};
var babelTransformCode = function (code, visitor, stripTypes) {
    var _a;
    if (stripTypes === void 0) { stripTypes = false; }
    return ((_a = babelTransform({ code: code, visitor: visitor, stripTypes: stripTypes })) === null || _a === void 0 ? void 0 : _a.code) || '';
};
exports.babelTransformCode = babelTransformCode;
// Babel adds trailing semicolons, but for expressions we need those gone
// TODO: maybe detect if the original code ended with one, and keep it if so, for the case
// of appending several fragements
var trimSemicolons = function (code) { return code.replace(/;$/, ''); };
var trimExpression = function (type) { return function (code) {
    switch (type) {
        case 'functionBody':
            return code.replace(/^function\s*\(\)\s*\{/, '').replace(/\};?$/, '');
        default:
            return trimSemicolons(code);
    }
}; };
var getType = function (code, initialType) {
    // match for object literal like { foo: ... }
    if (initialType === 'unknown' && code.trim().match(/^\s*{\s*[a-z0-9]+:/i)) {
        return 'expression';
    }
    // For Builder content
    if (initialType === 'unknown' &&
        (code.includes('return _virtual_index') || code.trim().startsWith('return ')) &&
        !code.trim().startsWith('function')) {
        return 'functionBody';
    }
    return initialType;
};
var babelTransformExpression = function (code, visitor, initialType, stripTypes) {
    if (initialType === void 0) { initialType = 'unknown'; }
    if (stripTypes === void 0) { stripTypes = false; }
    if (!code) {
        return '';
    }
    var isGetter = code.trim().startsWith('get ');
    return (0, function_1.pipe)(code, isGetter ? patterns_1.replaceGetterWithFunction : function_1.identity, function (code) {
        var type = getType(code, initialType);
        var useCode = type === 'functionBody' ? "function(){".concat(code, "}") : code;
        return { type: type, useCode: useCode };
    }, function (_a) {
        var type = _a.type, useCode = _a.useCode;
        if (type !== 'expression') {
            try {
                return (0, function_1.pipe)((0, exports.babelTransformCode)(useCode, visitor, stripTypes), trimExpression(type));
            }
            catch (error) {
                return handleErrorOrExpression({ code: code, useCode: useCode, result: null, visitor: visitor, stripTypes: stripTypes });
            }
        }
        else {
            return handleErrorOrExpression({ code: code, useCode: useCode, result: null, visitor: visitor, stripTypes: stripTypes });
        }
    }, isGetter ? patterns_1.replaceFunctionWithGetter : function_1.identity);
};
exports.babelTransformExpression = babelTransformExpression;
var convertTypeScriptToJS = function (code) {
    return (0, exports.babelTransformExpression)(code, {}, 'unknown', true);
};
exports.convertTypeScriptToJS = convertTypeScriptToJS;
