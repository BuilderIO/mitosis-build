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
var replace_identifiers_1 = require("../../../helpers/replace-identifiers");
var bindings_1 = require("./bindings");
var getArgs = function (code) {
    try {
        var parsed = parser.parse(code);
        var body = parsed.program.body[0];
        if (types.isFunctionDeclaration(body)) {
            return body.params.map(function (p) { return (0, generator_1.default)(p).code; });
        }
    }
    catch (e) { }
    return [];
};
function preventNameCollissions(json, item) {
    var output = item.code;
    var argumentsOutput = getArgs(output);
    output = (0, replace_identifiers_1.replaceNodes)({
        code: output,
        nodeMaps: argumentsOutput.map(function (arg) { return ({
            from: types.identifier(arg),
            to: types.identifier("".concat(arg, "_")),
        }); }),
    });
    return (argumentsOutput === null || argumentsOutput === void 0 ? void 0 : argumentsOutput.length)
        ? __assign(__assign({}, item), { code: output, arguments: getArgs(output) }) : __assign(__assign({}, item), { code: output });
}
exports.preventNameCollissions = preventNameCollissions;
function prependProperties(json, code) {
    return (0, replace_identifiers_1.replaceNodes)({
        code: code,
        nodeMaps: Object.keys(json.props).map(function (property) { return ({
            from: types.identifier(property),
            to: types.memberExpression(types.identifier('props'), types.identifier(property)),
        }); }),
    });
}
function prependState(json, input) {
    var output = input;
    for (var _i = 0, _a = Object.keys(json.state); _i < _a.length; _i++) {
        var stateKey = _a[_i];
        output = (0, replace_identifiers_1.replaceIdentifiers)({
            code: output,
            from: stateKey,
            to: "state.".concat(stateKey),
        });
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
    var _loop_1 = function (key) {
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
        _loop_1(key);
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
