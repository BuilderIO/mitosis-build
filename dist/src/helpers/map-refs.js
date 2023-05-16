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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRefs = void 0;
var core_1 = require("@babel/core");
var traverse_1 = __importDefault(require("traverse"));
var babel_transform_1 = require("./babel-transform");
var get_refs_1 = require("./get-refs");
var is_mitosis_node_1 = require("./is-mitosis-node");
var patterns_1 = require("./patterns");
var replaceRefsInString = function (code, refs, mapper) {
    return (0, babel_transform_1.babelTransformExpression)(code, {
        Identifier: function (path) {
            var name = path.node.name;
            var isRef = refs.includes(name);
            if (isRef) {
                path.replaceWith(core_1.types.identifier(mapper(name)));
            }
        },
    });
};
var mapRefs = function (component, mapper) {
    var refSet = (0, get_refs_1.getRefs)(component);
    // grab refs not used for bindings
    Object.keys(component.refs).forEach(function (ref) { return refSet.add(ref); });
    var refs = Array.from(refSet);
    for (var _i = 0, _a = Object.keys(component.state); _i < _a.length; _i++) {
        var key = _a[_i];
        var stateVal = component.state[key];
        if (typeof (stateVal === null || stateVal === void 0 ? void 0 : stateVal.code) === 'string') {
            var value = stateVal.code;
            switch (stateVal.type) {
                case 'method':
                case 'getter':
                    var isGet = stateVal.type === 'getter';
                    var isSet = Boolean(value.match(patterns_1.SETTER));
                    component.state[key] = {
                        code: replaceRefsInString(value.replace(/^(get |set )?/, 'function '), refs, mapper).replace(/^function /, isGet ? 'get ' : isSet ? 'set ' : ''),
                        type: stateVal.type,
                    };
                    break;
                case 'function':
                    component.state[key] = {
                        code: replaceRefsInString(value, refs, mapper),
                        type: 'function',
                    };
                    break;
                default:
                    break;
            }
        }
    }
    (0, traverse_1.default)(component).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var _i = 0, _a = Object.keys(item.bindings); _i < _a.length; _i++) {
                var key = _a[_i];
                var value = item.bindings[key];
                if (typeof value === 'object' && key !== 'ref') {
                    item.bindings[key] = __assign(__assign({}, value), { code: replaceRefsInString(value.code, refs, mapper) });
                }
            }
        }
    });
    for (var _b = 0, _c = Object.keys(component.hooks); _b < _c.length; _b++) {
        var key = _c[_b];
        var hooks = component.hooks[key];
        if (Array.isArray(hooks)) {
            hooks.forEach(function (hook) {
                if (hook.code) {
                    hook.code = replaceRefsInString(hook.code, refs, mapper);
                }
                if (hook.deps) {
                    hook.deps = replaceRefsInString(hook.deps, refs, mapper);
                }
            });
        }
        else {
            var hookCode = hooks === null || hooks === void 0 ? void 0 : hooks.code;
            if (hookCode) {
                hooks.code = replaceRefsInString(hookCode, refs, mapper);
            }
            if (hooks === null || hooks === void 0 ? void 0 : hooks.deps) {
                hooks.deps = replaceRefsInString(hooks === null || hooks === void 0 ? void 0 : hooks.deps, refs, mapper);
            }
        }
    }
};
exports.mapRefs = mapRefs;
