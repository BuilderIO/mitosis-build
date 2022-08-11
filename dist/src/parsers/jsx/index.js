"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFunctionStringLiteralObjectProperty = exports.parseStateObject = exports.METADATA_HOOK_NAME = exports.selfClosingTags = void 0;
__exportStar(require("./jsx"), exports);
var helpers_1 = require("./helpers");
Object.defineProperty(exports, "selfClosingTags", { enumerable: true, get: function () { return helpers_1.selfClosingTags; } });
var metadata_1 = require("./metadata");
Object.defineProperty(exports, "METADATA_HOOK_NAME", { enumerable: true, get: function () { return metadata_1.METADATA_HOOK_NAME; } });
var state_1 = require("./state");
Object.defineProperty(exports, "parseStateObject", { enumerable: true, get: function () { return state_1.parseStateObject; } });
Object.defineProperty(exports, "createFunctionStringLiteralObjectProperty", { enumerable: true, get: function () { return state_1.createFunctionStringLiteralObjectProperty; } });
