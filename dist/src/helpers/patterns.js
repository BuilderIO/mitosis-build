"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixWithFunction = exports.extractGetterCodeBlock = exports.replaceFunctionWithGetter = exports.replaceGetterWithFunction = exports.stripGetter = exports.checkIsGetter = exports.SETTER = exports.GETTER = void 0;
exports.GETTER = /^\s*get /;
exports.SETTER = /^\s*set /;
var checkIsGetter = function (code) { return code.match(exports.GETTER); };
exports.checkIsGetter = checkIsGetter;
var stripGetter = function (str) { return str.replace(exports.GETTER, ''); };
exports.stripGetter = stripGetter;
var replaceGetterWithFunction = function (str) { return str.replace(/^(get )?/, 'function '); };
exports.replaceGetterWithFunction = replaceGetterWithFunction;
var replaceFunctionWithGetter = function (str) { return str.replace(/^(function )?/, 'get '); };
exports.replaceFunctionWithGetter = replaceFunctionWithGetter;
var extractGetterCodeBlock = function (getter) {
    return getter.replace(/[\S\s]*\(\) \{([\S\s]*)\}[\S\s]*/, '$1').trim();
};
exports.extractGetterCodeBlock = extractGetterCodeBlock;
var prefixWithFunction = function (str) { return "function ".concat(str); };
exports.prefixWithFunction = prefixWithFunction;
