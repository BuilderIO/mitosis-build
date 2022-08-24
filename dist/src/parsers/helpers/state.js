"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapJsonObjectToStateValue = void 0;
var lodash_1 = require("lodash");
var patterns_1 = require("../../helpers/patterns");
var outdated_prefixes_1 = require("../constants/outdated-prefixes");
/**
 * Sets StateTypeValue based on the string prefixes we've set previously.
 *
 * This is a temporary workaround until we eliminate the prefixes and make this StateValueType the
 * source of truth.
 */
var mapJsonToStateValue = function (value) {
    if (typeof value === 'string') {
        if (value.startsWith(outdated_prefixes_1.__DO_NOT_USE_FUNCTION_LITERAL_PREFIX)) {
            return { type: 'function', code: value.replace(outdated_prefixes_1.__DO_NOT_USE_FUNCTION_LITERAL_PREFIX, '') };
        }
        else if (value.startsWith(outdated_prefixes_1.__DO_NOT_USE_METHOD_LITERAL_PREFIX)) {
            var strippedValue = value.replace(outdated_prefixes_1.__DO_NOT_USE_METHOD_LITERAL_PREFIX, '');
            var isGet = Boolean(strippedValue.match(patterns_1.GETTER));
            var type = isGet ? 'getter' : 'method';
            return { type: type, code: strippedValue };
        }
    }
    return { type: 'property', code: value };
};
var mapJsonObjectToStateValue = function (value) {
    return (0, lodash_1.mapValues)(value, mapJsonToStateValue);
};
exports.mapJsonObjectToStateValue = mapJsonObjectToStateValue;
