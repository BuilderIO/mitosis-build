"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryPrettierFormat = void 0;
var standalone_1 = require("prettier/standalone");
var tryPrettierFormat = function (str, parser) {
    try {
        return (0, standalone_1.format)(str, {
            parser: parser,
            plugins: [
                // To support running in browsers
                require('prettier/parser-typescript'),
                require('prettier/parser-postcss'),
                require('prettier/parser-html'),
                require('prettier/parser-babel'),
            ],
            htmlWhitespaceSensitivity: 'ignore',
        });
    }
    catch (err) {
        console.warn('Could not prettify', { string: str }, err);
    }
    return str;
};
exports.tryPrettierFormat = tryPrettierFormat;
