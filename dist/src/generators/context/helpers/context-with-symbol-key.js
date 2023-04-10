"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextWithSymbolKey = void 0;
var standalone_1 = require("prettier/standalone");
var get_state_object_string_1 = require("../../../helpers/get-state-object-string");
var getContextWithSymbolKey = function (options) {
    return function (_a) {
        var context = _a.context;
        var str = "\n  const key = Symbol();  \n\n  export default {\n    ".concat(context.name, ": ").concat((0, get_state_object_string_1.stringifyContextValue)(context.value), ", \n    key \n  }\n  ");
        if (options.prettier !== false) {
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
exports.getContextWithSymbolKey = getContextWithSymbolKey;
