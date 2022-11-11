"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.collectModuleScopeHooks = exports.METADATA_HOOK_NAME = void 0;
var babel = __importStar(require("@babel/core"));
var hooks_1 = require("../../constants/hooks");
var function_parser_1 = require("./function-parser");
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
var collectModuleScopeHooks = function (nodes, component, options) {
    return nodes.filter(function (node) {
        var hook = getHook(node);
        if (!hook) {
            return true;
        }
        if (types.isIdentifier(hook.callee)) {
            var metadataHooks = new Set((options.jsonHookNames || []).concat(exports.METADATA_HOOK_NAME));
            if (metadataHooks.has(hook.callee.name)) {
                try {
                    if (component.meta[hook.callee.name]) {
                        component.meta[hook.callee.name] = __assign(__assign({}, component.meta[hook.callee.name]), (0, helpers_1.parseCodeJson)(hook.arguments[0]));
                    }
                    else {
                        component.meta[hook.callee.name] = (0, helpers_1.parseCodeJson)(hook.arguments[0]);
                    }
                    return false;
                }
                catch (e) {
                    console.error("Error parsing metadata hook ".concat(hook.callee.name));
                    throw e;
                }
            }
            else if (hook.callee.name === hooks_1.HOOKS.STYLE) {
                component.style = (0, function_parser_1.generateUseStyleCode)(hook);
                return false;
            }
            else if (hook.callee.name === hooks_1.HOOKS.DEFAULT_PROPS) {
                (0, function_parser_1.parseDefaultPropsHook)(component, hook);
            }
        }
        return true;
    });
};
exports.collectModuleScopeHooks = collectModuleScopeHooks;
