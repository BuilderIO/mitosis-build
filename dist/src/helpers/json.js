"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseJson = void 0;
var json5_1 = __importDefault(require("json5"));
var tryParseJson = function (jsonStr) {
    try {
        return json5_1.default.parse(jsonStr);
    }
    catch (err) {
        console.error('Could not JSON5 parse object:\n', jsonStr);
        throw err;
    }
};
exports.tryParseJson = tryParseJson;
