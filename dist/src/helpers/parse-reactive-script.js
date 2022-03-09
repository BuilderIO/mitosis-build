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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReactiveScript = exports.reactiveScriptRe = void 0;
var core_1 = require("@babel/core");
var generator_1 = __importDefault(require("@babel/generator"));
var json5_1 = __importDefault(require("json5"));
var method_literal_prefix_1 = require("../constants/method-literal-prefix");
var jsx_1 = require("../parsers/jsx");
exports.reactiveScriptRe = /<script\s[^>]*reactive[^>]*>([\s\S]*)<\/\s*script>/i;
function parseReactiveScript(code, options) {
    var _a;
    var state = {};
    var format = options.format || 'html';
    var useCode = format === 'html' ? ((_a = code.match(exports.reactiveScriptRe)) === null || _a === void 0 ? void 0 : _a[1]) || '' : code;
    var output = (0, core_1.transform)(useCode, {
        plugins: [
            function () { return ({
                visitor: {
                    ExportDefaultDeclaration: function (path) {
                        if (core_1.types.isObjectExpression(path.node.declaration)) {
                            var stateProperty = path.node.declaration.properties.find(function (item) {
                                return core_1.types.isObjectProperty(item) &&
                                    core_1.types.isIdentifier(item.key) &&
                                    item.key.name === 'state';
                            });
                            if (stateProperty) {
                                var value = stateProperty.value;
                                if (core_1.types.isObjectExpression(value)) {
                                    var properties = value.properties;
                                    var useProperties = properties.map(function (item) {
                                        if (core_1.types.isObjectProperty(item)) {
                                            if (core_1.types.isFunctionExpression(item.value) ||
                                                core_1.types.isArrowFunctionExpression(item.value)) {
                                                return (0, jsx_1.createFunctionStringLiteralObjectProperty)(item.key, item.value);
                                            }
                                        }
                                        if (core_1.types.isObjectMethod(item)) {
                                            return core_1.types.objectProperty(item.key, core_1.types.stringLiteral("".concat(method_literal_prefix_1.methodLiteralPrefix).concat((0, generator_1.default)(__assign(__assign({}, item), { returnType: null })).code)));
                                        }
                                        // Remove typescript types, e.g. from
                                        // { foo: ('string' as SomeType) }
                                        if (core_1.types.isObjectProperty(item)) {
                                            var value_1 = item.value;
                                            if (core_1.types.isTSAsExpression(value_1)) {
                                                value_1 = value_1.expression;
                                            }
                                            return core_1.types.objectProperty(item.key, value_1);
                                        }
                                        return item;
                                    });
                                    var newObject = core_1.types.objectExpression(useProperties);
                                    var code_1;
                                    var obj = void 0;
                                    try {
                                        code_1 = (0, generator_1.default)(newObject).code;
                                        obj = json5_1.default.parse(code_1);
                                    }
                                    catch (err) {
                                        console.error('Could not JSON5 parse object:\n', code_1);
                                        throw err;
                                    }
                                    state = obj;
                                }
                            }
                        }
                    },
                },
            }); },
        ],
    });
    return { state: state };
}
exports.parseReactiveScript = parseReactiveScript;
