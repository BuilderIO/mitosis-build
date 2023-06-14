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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectModuleScopeHooks = exports.generateUseStyleCode = exports.parseDefaultPropsHook = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var hooks_1 = require("../../../constants/hooks");
var helpers_1 = require("../helpers");
var state_1 = require("../state");
var helpers_2 = require("./helpers");
var types = babel.types;
function parseDefaultPropsHook(component, expression) {
    var firstArg = expression.arguments[0];
    if (types.isObjectExpression(firstArg)) {
        component.defaultProps = (0, state_1.parseStateObjectToMitosisState)(firstArg, false);
    }
}
exports.parseDefaultPropsHook = parseDefaultPropsHook;
function generateUseStyleCode(expression) {
    return (0, generator_1.default)(expression.arguments[0]).code.replace(/(^("|'|`)|("|'|`)$)/g, '');
}
exports.generateUseStyleCode = generateUseStyleCode;
/**
 * Transform useMetadata({...}) onto the component JSON as
 * meta: { metadataHook: { ... }}
 *
 * This function collects metadata and removes the statement from
 * the returned nodes array
 */
var collectModuleScopeHooks = function (component, options) { return function (nodes) {
    return nodes.filter(function (node) {
        var hook = (0, helpers_2.getHook)(node);
        if (!hook) {
            return true;
        }
        if (types.isIdentifier(hook.callee)) {
            var metadataHooks = new Set((options.jsonHookNames || []).concat(hooks_1.HOOKS.METADATA));
            if (metadataHooks.has(hook.callee.name)) {
                try {
                    component.meta[hook.callee.name] = __assign(__assign({}, (component.meta[hook.callee.name] || {})), (0, helpers_1.parseCodeJson)(hook.arguments[0]));
                    return false;
                }
                catch (e) {
                    console.error("Error parsing metadata hook ".concat(hook.callee.name));
                    throw e;
                }
            }
            else if (hook.callee.name === hooks_1.HOOKS.STYLE) {
                component.style = generateUseStyleCode(hook);
                return false;
            }
            else if (hook.callee.name === hooks_1.HOOKS.DEFAULT_PROPS) {
                parseDefaultPropsHook(component, hook);
            }
        }
        return true;
    });
}; };
exports.collectModuleScopeHooks = collectModuleScopeHooks;
