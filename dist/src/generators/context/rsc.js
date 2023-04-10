"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextToRsc = void 0;
var standalone_1 = require("prettier/standalone");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
/**
 * React Server Components currently do not support context, so we use
 * plain objects and prop drilling instead.
 */
var contextToRsc = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var context = _a.context;
        var str = "\n    export default ".concat((0, get_state_object_string_1.stringifyContextValue)(context.value), "\n    ");
        if (options.format !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'typescript',
                    plugins: [
                        require('prettier/parser-typescript'), // To support running in browsers
                    ],
                });
            }
            catch (err) {
                console.error('Format error for file:', str);
                throw err;
            }
        }
        return str;
    };
};
exports.contextToRsc = contextToRsc;
