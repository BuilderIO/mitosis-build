"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateUsed = void 0;
var traverse_1 = __importDefault(require("traverse"));
var stateAccessRegex = /state\s*\.\s*([a-zA-Z0-9_\$]+)/;
var allStateMatchesRegex = new RegExp(stateAccessRegex, 'g');
/**
 * Get state used in the components by reference
 */
var getStateUsed = function (json) {
    var stateProperties = new Set();
    (0, traverse_1.default)(json).forEach(function (item) {
        if (typeof item === 'string') {
            // TODO: proper babel ref matching
            var matches = item.match(allStateMatchesRegex);
            if (matches) {
                for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                    var match = matches_1[_i];
                    stateProperties.add(match.match(stateAccessRegex)[1]);
                }
            }
        }
    });
    return stateProperties;
};
exports.getStateUsed = getStateUsed;
