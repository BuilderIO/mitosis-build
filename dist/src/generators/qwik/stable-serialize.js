"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stableJSONserialize = void 0;
/**
 * Same as JSON.stringify, but sorts keys ensuring that the output is stable across runs.
 * @param obj
 * @returns JSON serialized string
 */
function stableJSONserialize(obj) {
    var output = [];
    _serialize(output, obj);
    return output.join('');
}
exports.stableJSONserialize = stableJSONserialize;
function _serialize(output, obj) {
    if (obj == null) {
        output.push('null');
    }
    else if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            output.push('[');
            var sep = '';
            for (var i = 0; i < obj.length; i++) {
                output.push(sep);
                _serialize(output, obj[i]);
                sep = ',';
            }
            output.push(']');
        }
        else {
            var keys = Object.keys(obj).sort();
            output.push('{');
            var sep = '';
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var value = obj[key];
                if (value !== undefined) {
                    output.push(sep);
                    output.push(JSON.stringify(key));
                    output.push(':');
                    _serialize(output, value);
                    sep = ',';
                }
            }
            output.push('}');
        }
    }
    else {
        output.push(JSON.stringify(obj));
    }
}
