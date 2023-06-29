"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextToSvelte = void 0;
var standalone_1 = require("prettier/standalone");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
/**
 * TO-DO: support types
 */
var contextToSvelte = function (options) {
    return function (_a) {
        var context = _a.context;
        var isReactive = context.type === 'reactive';
        var str = "\nconst key = Symbol();  \n".concat(isReactive ? 'import {writable} from "svelte/store";' : '', "\n\nexport default {\n  ").concat(context.name, ": ").concat([
            isReactive && 'writable(',
            (0, get_state_object_string_1.stringifyContextValue)(context.value),
            isReactive && ')',
        ]
            .filter(Boolean)
            .join(''), ", \n  key \n}\n");
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
exports.contextToSvelte = contextToSvelte;
