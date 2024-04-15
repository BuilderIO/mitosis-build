"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextToAngular = void 0;
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var standalone_1 = require("prettier/standalone");
var contextToAngular = function (options) {
    if (options === void 0) { options = { typescript: false }; }
    return function (_a) {
        var context = _a.context;
        var str = "\nimport { Injectable } from '@angular/core';\n\n@Injectable({\n    providedIn: 'root'\n})\nexport default class ".concat(context.name, "Context {\n    ").concat((0, get_state_object_string_1.stringifyContextValue)(context.value)
            .replace(/^\{/, '')
            .replace(/\}$/, '')
            .replaceAll(',', ';\n')
            .replaceAll(':', ': any = '), "\n    constructor() { }\n}\n  ");
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
exports.contextToAngular = contextToAngular;
