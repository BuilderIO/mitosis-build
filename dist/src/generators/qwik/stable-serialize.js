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
    if (obj && typeof obj === 'object') {
        var keys = Object.keys(obj).sort();
        output.push('{');
        var sep = '';
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var value = JSON.stringify(key);
            if (value !== undefined) {
                output.push(sep);
                output.push(value);
                output.push(':');
                _serialize(output, obj[key]);
                sep = ',';
            }
        }
        output.push('}');
    }
    else {
        output.push(JSON.stringify(obj));
    }
}
