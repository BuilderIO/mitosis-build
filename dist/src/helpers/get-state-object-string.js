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
exports.getStateObjectStringFromComponent = exports.getMemberObjectString = void 0;
var json5_1 = __importDefault(require("json5"));
var function_literal_prefix_1 = require("../constants/function-literal-prefix");
var method_literal_prefix_1 = require("../constants/method-literal-prefix");
var patterns_1 = require("./patterns");
var convertStateMemberToString = function (options) {
    return function (_a) {
        var key = _a[0], value = _a[1];
        var valueMapper = options.valueMapper || (function (val) { return val; });
        var keyValueDelimiter = options.format === 'object' ? ':' : '=';
        var keyPrefix = options.keyPrefix || '';
        if (typeof value === 'string') {
            if (value.startsWith(function_literal_prefix_1.functionLiteralPrefix)) {
                if (options.functions === false) {
                    return undefined;
                }
                var functionValue = value.replace(function_literal_prefix_1.functionLiteralPrefix, '');
                return "".concat(keyPrefix, " ").concat(key, " ").concat(keyValueDelimiter, " ").concat(valueMapper(functionValue, 'function'));
            }
            else if (value.startsWith(method_literal_prefix_1.methodLiteralPrefix)) {
                var methodValue = value.replace(method_literal_prefix_1.methodLiteralPrefix, '');
                var isGet = Boolean(methodValue.match(patterns_1.GETTER));
                if (isGet && options.getters === false) {
                    return undefined;
                }
                if (!isGet && options.functions === false) {
                    return undefined;
                }
                return "".concat(keyPrefix, " ").concat(valueMapper(methodValue, isGet ? 'getter' : 'function'));
            }
        }
        if (options.data === false) {
            return undefined;
        }
        return "".concat(keyPrefix, " ").concat(key).concat(keyValueDelimiter, " ").concat(valueMapper(json5_1.default.stringify(value), 'data'));
    };
};
var getMemberObjectString = function (object, options) {
    if (options === void 0) { options = {}; }
    var format = options.format || 'object';
    var lineItemDelimiter = format === 'object' ? ',' : '\n';
    var stringifiedProperties = Object.entries(object)
        .map(convertStateMemberToString(__assign(__assign({}, options), { format: format })))
        .filter(function (x) { return x !== undefined; })
        .join(lineItemDelimiter);
    var prefix = format === 'object' ? '{' : '';
    var suffix = format === 'object' ? '}' : '';
    // NOTE: we add a `lineItemDelimiter` at the very end because other functions will sometimes append more properties.
    // If the delimiter is a comma and the format is `object`, then we need to make sure we have an extra comma at the end,
    // or the object will become invalid JS.
    // We also have to make sure that `stringifiedProperties` isn't empty, or we will get `{,}` which is invalid
    var extraDelimiter = stringifiedProperties.length > 0 ? lineItemDelimiter : '';
    return "".concat(prefix).concat(stringifiedProperties).concat(extraDelimiter).concat(suffix);
};
exports.getMemberObjectString = getMemberObjectString;
var getStateObjectStringFromComponent = function (component, options) {
    if (options === void 0) { options = {}; }
    return (0, exports.getMemberObjectString)(component.state, options);
};
exports.getStateObjectStringFromComponent = getStateObjectStringFromComponent;
