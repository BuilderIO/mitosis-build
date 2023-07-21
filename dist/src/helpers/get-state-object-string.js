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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateObjectStringFromComponent = exports.stringifyContextValue = exports.getMemberObjectString = void 0;
var DEFAULT_OPTIONS = {
    format: 'object',
    keyPrefix: '',
    valueMapper: function (val) { return val; },
    data: true,
    functions: true,
    getters: true,
};
var convertStateMemberToString = function (_a) {
    var data = _a.data, format = _a.format, functions = _a.functions, getters = _a.getters, keyPrefix = _a.keyPrefix, valueMapper = _a.valueMapper;
    return function (_a) {
        var key = _a[0], state = _a[1];
        var keyValueDelimiter = format === 'object' ? ':' : '=';
        if (!state) {
            return undefined;
        }
        var code = state.code, typeParameter = state.typeParameter;
        switch (state.type) {
            case 'function': {
                if (functions === false || typeof code !== 'string') {
                    return undefined;
                }
                return "".concat(keyPrefix, " ").concat(key, " ").concat(keyValueDelimiter, " ").concat(valueMapper(code, 'function', typeParameter, key));
            }
            case 'method': {
                if (functions === false || typeof code !== 'string') {
                    return undefined;
                }
                return "".concat(keyPrefix, " ").concat(valueMapper(code, 'function', typeParameter, key));
            }
            case 'getter': {
                if (getters === false || typeof code !== 'string') {
                    return undefined;
                }
                return "".concat(keyPrefix, " ").concat(valueMapper(code, 'getter', typeParameter, key));
            }
            case 'property': {
                if (data === false) {
                    return undefined;
                }
                return "".concat(keyPrefix, " ").concat(key).concat(keyValueDelimiter, " ").concat(valueMapper(code, 'data', typeParameter, key));
            }
            default:
                break;
        }
    };
};
var getMemberObjectString = function (object, userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    var options = __assign(__assign({}, DEFAULT_OPTIONS), userOptions);
    var lineItemDelimiter = options.format === 'object' ? ',' : '\n';
    var stringifiedProperties = Object.entries(object)
        .map(convertStateMemberToString(options))
        .filter(function (x) { return x !== undefined; })
        .join(lineItemDelimiter);
    var prefix = options.format === 'object' ? '{' : '';
    var suffix = options.format === 'object' ? '}' : '';
    // NOTE: we add a `lineItemDelimiter` at the very end because other functions will sometimes append more properties.
    // If the delimiter is a comma and the format is `object`, then we need to make sure we have an extra comma at the end,
    // or the object will become invalid JS.
    // We also have to make sure that `stringifiedProperties` isn't empty, or we will get `{,}` which is invalid
    var extraDelimiter = stringifiedProperties.length > 0 ? lineItemDelimiter : '';
    return "".concat(prefix).concat(stringifiedProperties).concat(extraDelimiter).concat(suffix);
};
exports.getMemberObjectString = getMemberObjectString;
var stringifyContextValue = function (object, userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return (0, exports.getMemberObjectString)(object, userOptions);
};
exports.stringifyContextValue = stringifyContextValue;
var getStateObjectStringFromComponent = function (component, options) { return (0, exports.getMemberObjectString)(component.state, options); };
exports.getStateObjectStringFromComponent = getStateObjectStringFromComponent;
