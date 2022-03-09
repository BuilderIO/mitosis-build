"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasProps = void 0;
var traverse_1 = __importDefault(require("traverse"));
var hasProps = function (json) {
    var has = false;
    (0, traverse_1.default)(json).forEach(function (item) {
        // TODO: use proper reference tracking
        if (typeof item === 'string' && item.match(/(^|\W)props\s*\./)) {
            has = true;
            this.stop();
        }
    });
    return has;
};
exports.hasProps = hasProps;
