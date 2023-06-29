"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateMethodsAndGetters = exports.getLexicalScopeVars = exports.emitStateMethodsAndRewriteBindings = exports.emitUseStore = void 0;
var traverse_1 = __importDefault(require("traverse"));
var babel_transform_1 = require("../../../helpers/babel-transform");
var convert_method_to_function_1 = require("./convert-method-to-function");
var stable_inject_1 = require("./stable-inject");
/**
 * @param file
 * @param stateInit
 */
function emitUseStore(_a) {
    var file = _a.file, stateInit = _a.stateInit, isDeep = _a.isDeep;
    var state = stateInit[0];
    var hasState = state && Object.keys(state).length > 0;
    if (hasState) {
        file.src.emit('const state=', file.import(file.qwikModule, 'useStore').localName);
        if (file.options.isTypeScript) {
            file.src.emit('<any>');
        }
        var fnArgs = [(0, stable_inject_1.stableInject)(state), isDeep ? '{deep: true}' : undefined].filter(Boolean);
        file.src.emit("(".concat(fnArgs, ");"));
    }
    else {
        // TODO hack for now so that `state` variable is defined, even though it is never read.
        file.src.emit("const state".concat(file.options.isTypeScript ? ': any' : '', " = {};"));
    }
}
exports.emitUseStore = emitUseStore;
function emitStateMethods(file, componentState, lexicalArgs) {
    var stateValues = {};
    var stateInit = [stateValues];
    var methodMap = getStateMethodsAndGetters(componentState);
    for (var key in componentState) {
        var stateValue = componentState[key];
        switch (stateValue === null || stateValue === void 0 ? void 0 : stateValue.type) {
            case 'method':
            case 'function':
                var code = stateValue.code;
                var prefixIdx = 0;
                if (stateValue.type === 'function') {
                    prefixIdx += 'function '.length;
                }
                code = code.substring(prefixIdx);
                code = (0, convert_method_to_function_1.convertMethodToFunction)(code, methodMap, lexicalArgs).replace('(', "(".concat(lexicalArgs.join(','), ","));
                var functionName = code.split(/\(/)[0];
                if (!file.options.isTypeScript) {
                    // Erase type information
                    code = (0, babel_transform_1.convertTypeScriptToJS)(code);
                }
                file.exportConst(functionName, 'function ' + code, true);
                continue;
            case 'property':
                stateValues[key] = stateValue.code;
                continue;
        }
    }
    return stateInit;
}
function emitStateMethodsAndRewriteBindings(file, component, metadata) {
    var _a;
    var lexicalArgs = getLexicalScopeVars(component);
    var state = emitStateMethods(file, component.state, lexicalArgs);
    var methodMap = getStateMethodsAndGetters(component.state);
    rewriteCodeExpr(component, methodMap, lexicalArgs, (_a = metadata === null || metadata === void 0 ? void 0 : metadata.qwik) === null || _a === void 0 ? void 0 : _a.replace);
    return state;
}
exports.emitStateMethodsAndRewriteBindings = emitStateMethodsAndRewriteBindings;
var checkIsObjectWithCodeBlock = function (obj) {
    return typeof obj == 'object' && (obj === null || obj === void 0 ? void 0 : obj.code) && typeof obj.code === 'string';
};
function getLexicalScopeVars(component) {
    return __spreadArray(__spreadArray(['props', 'state'], Object.keys(component.refs), true), Object.keys(component.context.get), true);
}
exports.getLexicalScopeVars = getLexicalScopeVars;
function rewriteCodeExpr(component, methodMap, lexicalArgs, replace) {
    if (replace === void 0) { replace = {}; }
    (0, traverse_1.default)(component).forEach(function (item) {
        if (!checkIsObjectWithCodeBlock(item)) {
            return;
        }
        var code = (0, convert_method_to_function_1.convertMethodToFunction)(item.code, methodMap, lexicalArgs);
        Object.keys(replace).forEach(function (key) {
            code = code.replace(key, replace[key]);
        });
        item.code = code;
    });
}
function getStateMethodsAndGetters(state) {
    var methodMap = {};
    Object.keys(state).forEach(function (key) {
        var stateVal = state[key];
        if ((stateVal === null || stateVal === void 0 ? void 0 : stateVal.type) === 'getter' || (stateVal === null || stateVal === void 0 ? void 0 : stateVal.type) === 'method') {
            methodMap[key] = stateVal.type;
        }
    });
    return methodMap;
}
exports.getStateMethodsAndGetters = getStateMethodsAndGetters;
