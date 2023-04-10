"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextToQwik = void 0;
var standalone_1 = require("prettier/standalone");
var contextToQwik = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var context = _a.context;
        var str = "\n  import { createContextId } from '@builder.io/qwik';\n\n  export default createContextId<any>(\"".concat(context.name, "\")\n  ");
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
exports.contextToQwik = contextToQwik;
