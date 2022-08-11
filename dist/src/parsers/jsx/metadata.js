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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectMetadata = exports.METADATA_HOOK_NAME = void 0;
var babel = __importStar(require("@babel/core"));
var helpers_1 = require("./helpers");
var types = babel.types;
var getHook = function (node) {
    var item = node;
    if (types.isExpressionStatement(item)) {
        var expression = item.expression;
        if (types.isCallExpression(expression)) {
            if (types.isIdentifier(expression.callee)) {
                return expression;
            }
        }
    }
    return null;
};
exports.METADATA_HOOK_NAME = 'useMetadata';
/**
 * Transform useMetadata({...}) onto the component JSON as
 * meta: { metadataHook: { ... }}
 *
 * This function collects metadata and removes the statement from
 * the returned nodes array
 */
var collectMetadata = function (nodes, component, options) {
    var hookNames = new Set((options.jsonHookNames || []).concat(exports.METADATA_HOOK_NAME));
    return nodes.filter(function (node) {
        var hook = getHook(node);
        if (!hook) {
            return true;
        }
        if (types.isIdentifier(hook.callee) && hookNames.has(hook.callee.name)) {
            try {
                component.meta[hook.callee.name] = (0, helpers_1.parseCodeJson)(hook.arguments[0]);
                return false;
            }
            catch (e) {
                console.error("Error parsing metadata hook ".concat(hook.callee.name));
                throw e;
            }
        }
        return true;
    });
};
exports.collectMetadata = collectMetadata;
