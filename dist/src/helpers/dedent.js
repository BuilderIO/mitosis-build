"use strict";
// Based on "dedent" package
// Latest commit 2381e76 on Feb 15, 2017
// Source: https://raw.githubusercontent.com/dmnd/dedent/master/dedent.js
// License: MIT
// Updates:
// 1. Converted to TypeScript
// 2. Preserve whitespace inside backtick string literals
Object.defineProperty(exports, "__esModule", { value: true });
exports.dedent = void 0;
function dedent(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var raw = typeof strings === 'string' ? [strings] : strings.raw;
    // first, perform interpolation
    var result = '';
    for (var i = 0; i < raw.length; i++) {
        result += raw[i]
            // join lines when there is a suppressed newline
            .replace(/\\\n[ \t]*/g, '')
            // handle escaped backticks
            .replace(/\\`/g, '`');
        if (i < values.length) {
            result += values[i];
        }
    }
    // now strip indentation
    var lines = split(result);
    var mindent = null;
    lines.forEach(function (l) {
        var m = l.match(/^(\s+)\S+/);
        if (m) {
            var indent = m[1].length;
            if (!mindent) {
                // this is the first indented line
                mindent = indent;
            }
            else {
                mindent = Math.min(mindent, indent);
            }
        }
    });
    if (mindent !== null) {
        var m_1 = mindent;
        result = lines.map(function (l) { return (l[0] === ' ' ? l.slice(m_1) : l); }).join('\n');
    }
    // trim trailing whitespace on all lines
    result = result
        .split('\n')
        .map(function (l) { return l.trimEnd(); })
        .join('\n');
    return (result
        // dedent eats leading and trailing whitespace too
        .trim()
        // handle escaped newlines at the end to ensure they don't get stripped too
        .replace(/\\n/g, '\n'));
}
exports.dedent = dedent;
/**
 * Splits a string by newlines.
 * Preserve whitespace inside backtick string literals.
 * @param input The original input string.
 * @returns The split string.
 */
function split(input) {
    var result = [];
    var prev = '';
    var current = '';
    var inBackticks = false;
    for (var i = 0; i < input.length; i++) {
        var char = input[i];
        if (prev !== '\\' && char === '`') {
            inBackticks = !inBackticks;
        }
        if (!inBackticks && char === '\n') {
            result.push(current);
            current = '';
        }
        else {
            current += char;
        }
        prev = char;
    }
    return result;
}
