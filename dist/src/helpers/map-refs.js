"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.mapRefs = void 0;
var traverse_1 = __importDefault(require("traverse"));
var babel = __importStar(require("@babel/core"));
var get_refs_1 = require("./get-refs");
var is_mitosis_node_1 = require("./is-mitosis-node");
var method_literal_prefix_1 = require("../constants/method-literal-prefix");
var function_literal_prefix_1 = require("../constants/function-literal-prefix");
var babel_transform_1 = require("./babel-transform");
var patterns_1 = require("./patterns");
var tsPreset = require('@babel/preset-typescript');
var replaceRefsInString = function (code, refs, mapper) {
    return (0, babel_transform_1.babelTransformExpression)(code, {
        Identifier: function (path) {
            var name = path.node.name;
            var isRef = refs.includes(name);
            if (isRef) {
                path.replaceWith(babel.types.identifier(mapper(name)));
            }
        },
    });
};
var mapRefs = function (component, mapper) {
    var _a;
    var refs = Array.from((0, get_refs_1.getRefs)(component));
    for (var _i = 0, _b = Object.keys(component.state); _i < _b.length; _i++) {
        var key = _b[_i];
        var value = component.state[key];
        if (typeof value === 'string') {
            if (value.startsWith(method_literal_prefix_1.methodLiteralPrefix)) {
                var methodValue = value.replace(method_literal_prefix_1.methodLiteralPrefix, '');
                var isGet = Boolean(methodValue.match(patterns_1.GETTER));
                var isSet = Boolean(methodValue.match(patterns_1.SETTER));
                component.state[key] =
                    method_literal_prefix_1.methodLiteralPrefix +
                        replaceRefsInString(methodValue.replace(/^(get |set )?/, 'function '), refs, mapper).replace(/^function /, isGet ? 'get ' : isSet ? 'set ' : '');
            }
            else if (value.startsWith(function_literal_prefix_1.functionLiteralPrefix)) {
                component.state[key] =
                    function_literal_prefix_1.functionLiteralPrefix +
                        replaceRefsInString(value.replace(function_literal_prefix_1.functionLiteralPrefix, ''), refs, mapper);
            }
        }
    }
    (0, traverse_1.default)(component).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var _i = 0, _a = Object.keys(item.bindings); _i < _a.length; _i++) {
                var key = _a[_i];
                var value = item.bindings[key];
                if (typeof value === 'string' && key !== 'ref') {
                    item.bindings[key] = replaceRefsInString(value, refs, mapper);
                }
            }
        }
    });
    for (var _c = 0, _d = Object.keys(component.hooks); _c < _d.length; _c++) {
        var key = _d[_c];
        var hookCode = (_a = component.hooks[key]) === null || _a === void 0 ? void 0 : _a.code;
        if (hookCode) {
            component.hooks[key].code = replaceRefsInString(hookCode, refs, mapper);
        }
    }
};
exports.mapRefs = mapRefs;
