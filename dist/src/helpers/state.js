"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapJsonObjectToStateValue = exports.getStateTypeOfValue = exports.checkHasState = void 0;
var lodash_1 = require("lodash");
var function_literal_prefix_1 = require("../constants/function-literal-prefix");
var method_literal_prefix_1 = require("../constants/method-literal-prefix");
var patterns_1 = require("./patterns");
var checkHasState = function (component) {
    return Boolean(Object.keys(component.state).length);
};
exports.checkHasState = checkHasState;
/**
 * Sets StateTypeValue based on the string prefixes we've set previously.
 *
 * This is a temporary workaround until we eliminate the prefixes and make this StateValueType the
 * source of truth.
 */
var getStateTypeOfValue = function (value) {
    if (typeof value === 'string') {
        if (value.startsWith(function_literal_prefix_1.functionLiteralPrefix)) {
            return 'function';
        }
        else if (value.startsWith(method_literal_prefix_1.methodLiteralPrefix)) {
            var isGet = Boolean(value.replace(method_literal_prefix_1.methodLiteralPrefix, '').match(patterns_1.GETTER));
            if (isGet) {
                return 'getter';
            }
            return 'method';
        }
    }
    return 'property';
};
exports.getStateTypeOfValue = getStateTypeOfValue;
var mapJsonToStateValue = function (value) {
    return {
        code: value,
        type: (0, exports.getStateTypeOfValue)(value),
    };
};
var mapJsonObjectToStateValue = function (value) {
    return (0, lodash_1.mapValues)(value, mapJsonToStateValue);
};
exports.mapJsonObjectToStateValue = mapJsonObjectToStateValue;
