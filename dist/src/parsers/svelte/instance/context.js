"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSetContext = exports.parseHasContext = exports.parseGetContext = void 0;
var astring_1 = require("astring");
var string_1 = require("../helpers/string");
function parseGetContext(json, node) {
    var _a;
    if (node.declarations.length > 0) {
        var declaration = node.declarations[0];
        var name_1 = declaration.id.name;
        var arguments_ = (_a = declaration.init) === null || _a === void 0 ? void 0 : _a.arguments;
        if (arguments === null || arguments === void 0 ? void 0 : arguments.length) {
            var argument = arguments_[0];
            json.context.get[name_1] = {
                name: (0, astring_1.generate)(argument),
                path: '',
            };
        }
    }
}
exports.parseGetContext = parseGetContext;
function parseHasContext(json, node) {
    var _a;
    if (node.declarations.length > 0) {
        var declaration = node.declarations[0];
        var name_2 = declaration.id.name;
        var arguments_ = (_a = declaration.init) === null || _a === void 0 ? void 0 : _a.arguments;
        if (arguments === null || arguments === void 0 ? void 0 : arguments.length) {
            var argument = arguments_[0];
            var generatedArgument = (0, astring_1.generate)(argument);
            json.context.get[(0, string_1.stripQuotes)(generatedArgument)] = {
                name: generatedArgument,
                path: '',
            };
            json.state[name_2] = {
                code: "get ".concat(name_2, "() { return ").concat((0, string_1.stripQuotes)(generatedArgument), " !== undefined}"),
                type: 'getter',
            };
        }
    }
}
exports.parseHasContext = parseHasContext;
function parseSetContext(json, node) {
    var _a;
    if (node.type === 'ExpressionStatement' &&
        node.expression.type === 'CallExpression' &&
        ((_a = node.expression.arguments) === null || _a === void 0 ? void 0 : _a.length)) {
        var hook = node.expression.callee.name;
        if (hook === 'setContext') {
            var key = node.expression.arguments[0];
            var value = node.expression.arguments[1];
            json.context.set[key.value] = {
                name: (0, astring_1.generate)(key),
                ref: (0, astring_1.generate)(value),
            };
        }
    }
}
exports.parseSetContext = parseSetContext;
