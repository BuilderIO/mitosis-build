"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCodeJson = exports.uncapitalize = exports.selfClosingTags = void 0;
var generator_1 = __importDefault(require("@babel/generator"));
var json_1 = require("../../helpers/json");
exports.selfClosingTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);
var uncapitalize = function (str) {
    if (!str) {
        return str;
    }
    return str[0].toLowerCase() + str.slice(1);
};
exports.uncapitalize = uncapitalize;
var parseCodeJson = function (node) {
    var code = (0, generator_1.default)(node).code;
    return (0, json_1.tryParseJson)(code);
};
exports.parseCodeJson = parseCodeJson;
