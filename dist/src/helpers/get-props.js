"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProps = void 0;
var traverse_1 = __importDefault(require("traverse"));
var propsRegex = /props\s*\.\s*([a-zA-Z0-9_\$]+)/;
var allPropsMatchesRegex = new RegExp(propsRegex, 'g');
/**
 * Get props used in the components by reference
 */
var getProps = function (json) {
    var props = new Set();
    (0, traverse_1.default)(json).forEach(function (item) {
        if (typeof item === 'string') {
            // TODO: proper babel ref matching
            var matches = item.match(allPropsMatchesRegex);
            if (matches) {
                for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                    var match = matches_1[_i];
                    props.add(match.match(propsRegex)[1]);
                }
            }
        }
    });
    return props;
};
exports.getProps = getProps;
