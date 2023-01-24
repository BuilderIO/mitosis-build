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
exports.postProcess = exports.preventNameCollissions = void 0;
var generator_1 = __importDefault(require("@babel/generator"));
var parser = __importStar(require("@babel/parser"));
var types = __importStar(require("@babel/types"));
var bindings_1 = require("./bindings");
function preventNameCollissions(json, item, prepend, append) {
    if (prepend === void 0) { prepend = ''; }
    if (append === void 0) { append = '_'; }
    var output = item.code;
    var argumentsOutput = [];
    try {
        var parsed = parser.parse(item.code);
        var body = parsed.program.body[0];
        if (types.isFunctionDeclaration(body)) {
            argumentsOutput = body.params.map(function (p) { return (0, generator_1.default)(p).code; });
        }
    }
    catch (e) { }
    var keys = __spreadArray(__spreadArray(__spreadArray([], Object.keys(json.props), true), Object.keys(json.state), true), Object.keys(json.refs), true);
    var _loop_1 = function (key) {
        var regex = function () { return new RegExp("(?<!=(?:\\s))".concat(key, "\\b"), 'g'); };
        var isInArguments = false;
        argumentsOutput.forEach(function (argument, index) {
            if (regex().test(argument)) {
                isInArguments = true;
                argumentsOutput.splice(index, 1, argument.replace(regex(), "".concat(prepend).concat(key).concat(append)));
            }
        });
        var outputRegex = function () { return new RegExp("\\b".concat(key, "\\b"), 'g'); };
        var isInOutput = outputRegex().test(output);
        if (isInArguments && isInOutput) {
            output = output.replace(outputRegex(), "".concat(prepend).concat(key).concat(append));
        }
    };
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        _loop_1(key);
    }
    return (argumentsOutput === null || argumentsOutput === void 0 ? void 0 : argumentsOutput.length)
        ? __assign(__assign({}, item), { code: output, arguments: argumentsOutput }) : __assign(__assign({}, item), { code: output });
}
exports.preventNameCollissions = preventNameCollissions;
function prependProperties(json, input) {
    var output = input;
    var propertyKeys = Object.keys(json.props);
    for (var _i = 0, propertyKeys_1 = propertyKeys; _i < propertyKeys_1.length; _i++) {
        var property = propertyKeys_1[_i];
        var regex = new RegExp("(?<!(\\.|'|\"|`))\\b(props\\.)?".concat(property, "\\b"), 'g');
        if (regex.test(output)) {
            output = output.replace(regex, "props.".concat(property));
        }
    }
    return output;
}
function prependState(json, input) {
    var output = input;
    var stateKeys = Object.keys(json.state);
    for (var _i = 0, stateKeys_1 = stateKeys; _i < stateKeys_1.length; _i++) {
        var state = stateKeys_1[_i];
        var regex = new RegExp("(?<!(\\.|'|\"|`|function |get ))\\b(state\\.)?".concat(state, "\\b"), 'g');
        if (regex.test(output)) {
            output = output.replace(regex, "state.".concat(state));
        }
    }
    return output;
}
function addPropertiesAndState(json, input) {
    var output = input;
    output = prependProperties(json, output);
    output = prependState(json, output);
    return output;
}
function addPropertiesAndStateToNode(json, node) {
    var _a;
    for (var _i = 0, _b = Object.keys(node.bindings); _i < _b.length; _i++) {
        var key = _b[_i];
        if (Object.prototype.hasOwnProperty.call(node.bindings, key)) {
            var value = node.bindings[key];
            node.bindings[key].code = addPropertiesAndState(json, (_a = value === null || value === void 0 ? void 0 : value.code) !== null && _a !== void 0 ? _a : '').trim();
        }
    }
}
function postProcessState(json) {
    for (var _i = 0, _a = Object.keys(json.state); _i < _a.length; _i++) {
        var key = _a[_i];
        var item = json.state[key];
        if ((item === null || item === void 0 ? void 0 : item.type) !== 'property') {
            var output = preventNameCollissions(json, item);
            output.code = addPropertiesAndState(json, output.code);
            json.state[key] = __assign(__assign({}, item), output);
        }
    }
}
function postProcessChildren(json, children) {
    var _a;
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var node = children_1[_i];
        addPropertiesAndStateToNode(json, node);
        (0, bindings_1.processBindings)(json, node);
        var children_2 = [];
        if (((_a = node.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            children_2 = node.children;
        }
        var metaValues = (Object.values(node.meta) || []);
        if (metaValues.length > 0) {
            var metaChildren = metaValues.filter(function (item) {
                return (item === null || item === void 0 ? void 0 : item['@type']) === '@builder.io/mitosis/node';
            });
            children_2 = __spreadArray(__spreadArray([], children_2, true), metaChildren, true);
        }
        postProcessChildren(json, children_2);
    }
}
function addPropertiesAndStateToHook(json, hook) {
    return {
        code: addPropertiesAndState(json, hook.code),
        deps: addPropertiesAndState(json, hook.deps || ''),
    };
}
function postProcessHooks(json) {
    var hookKeys = Object.keys(json.hooks);
    var _loop_2 = function (key) {
        var hook = json.hooks[key];
        if (!hook) {
            return "continue";
        }
        if (key === 'onUpdate' && Array.isArray(hook)) {
            hook.forEach(function (item, index) {
                var _a;
                (_a = json.hooks[key]) === null || _a === void 0 ? void 0 : _a.splice(index, 1, addPropertiesAndStateToHook(json, item));
            });
            return "continue";
        }
        json.hooks[key] = addPropertiesAndStateToHook(json, hook);
    };
    for (var _i = 0, hookKeys_1 = hookKeys; _i < hookKeys_1.length; _i++) {
        var key = hookKeys_1[_i];
        _loop_2(key);
    }
}
function postProcessContext(json) {
    var _a;
    for (var _i = 0, _b = Object.keys(json.context.set); _i < _b.length; _i++) {
        var key = _b[_i];
        if ((_a = json.context.set[key]) === null || _a === void 0 ? void 0 : _a.ref) {
            json.context.set[key].ref = addPropertiesAndState(json, json.context.set[key].ref);
        }
    }
}
function postProcess(json) {
    // Call preventNameCollissions here, before the rest (where it applies -- function arguments for now)
    // State (everything except type === 'property')
    postProcessState(json);
    // Children
    postProcessChildren(json, json.children);
    // Hooks
    postProcessHooks(json);
    // Context
    postProcessContext(json);
}
exports.postProcess = postProcess;
