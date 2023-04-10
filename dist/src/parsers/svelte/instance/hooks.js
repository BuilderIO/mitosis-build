"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAfterUpdate = exports.parseOnDestroy = exports.parseOnMount = void 0;
var astring_1 = require("astring");
function parseHookBody(node, stripCurlyBraces) {
    var _a;
    if (stripCurlyBraces === void 0) { stripCurlyBraces = true; }
    var arguments_ = (_a = node.expression) === null || _a === void 0 ? void 0 : _a.arguments;
    var code = (0, astring_1.generate)(arguments_[0].body);
    if (stripCurlyBraces && (code === null || code === void 0 ? void 0 : code.trim().length) && code[0] === '{' && code[code.length - 1] === '}')
        code = code.slice(1, -1);
    return code;
}
function parseOnMount(json, node) {
    json.hooks.onMount = {
        code: parseHookBody(node),
    };
}
exports.parseOnMount = parseOnMount;
function parseOnDestroy(json, node) {
    json.hooks.onUnMount = {
        code: parseHookBody(node),
    };
}
exports.parseOnDestroy = parseOnDestroy;
function parseAfterUpdate(json, node) {
    json.hooks.onUpdate = [
        {
            code: parseHookBody(node),
        },
    ];
}
exports.parseAfterUpdate = parseAfterUpdate;
