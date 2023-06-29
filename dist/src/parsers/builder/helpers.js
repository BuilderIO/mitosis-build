"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBuilderContentStateToMitosisState = void 0;
var lodash_1 = require("lodash");
var patterns_1 = require("../../helpers/patterns");
var __DO_NOT_USE_FUNCTION_LITERAL_PREFIX = "@builder.io/mitosis/function:";
var __DO_NOT_USE_METHOD_LITERAL_PREFIX = "@builder.io/mitosis/method:";
/**
 * Maps the Builder State format to the Mitosis State format.
 */
var mapJsonToStateValue = function (value) {
    if (typeof value === 'string') {
        if (value.startsWith(__DO_NOT_USE_FUNCTION_LITERAL_PREFIX)) {
            return { type: 'function', code: value.replace(__DO_NOT_USE_FUNCTION_LITERAL_PREFIX, '') };
        }
        else if (value.startsWith(__DO_NOT_USE_METHOD_LITERAL_PREFIX)) {
            var strippedValue = value.replace(__DO_NOT_USE_METHOD_LITERAL_PREFIX, '');
            var isGet = Boolean(strippedValue.match(patterns_1.GETTER));
            var type = isGet ? 'getter' : 'method';
            return { type: type, code: strippedValue };
        }
    }
    return { type: 'property', code: JSON.stringify(value), propertyType: 'normal' };
};
var mapBuilderContentStateToMitosisState = function (value) { return (0, lodash_1.mapValues)(value, mapJsonToStateValue); };
exports.mapBuilderContentStateToMitosisState = mapBuilderContentStateToMitosisState;
