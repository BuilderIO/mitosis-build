"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefixWithFunction = exports.replaceGetterWithFunction = exports.SETTER = exports.GETTER = void 0;
exports.GETTER = /^get /;
exports.SETTER = /^set /;
var replaceGetterWithFunction = function (str) { return str.replace(/^(get )?/, 'function '); };
exports.replaceGetterWithFunction = replaceGetterWithFunction;
var prefixWithFunction = function (str) { return "function ".concat(str); };
exports.prefixWithFunction = prefixWithFunction;
