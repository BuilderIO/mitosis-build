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
exports.componentToRsc = void 0;
var traverse_1 = __importDefault(require("traverse"));
var fast_clone_1 = require("../helpers/fast-clone");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var is_upper_case_1 = require("../helpers/is-upper-case");
var react_1 = require("./react");
/**
 * Transform react to be RSC compatible, such as
 * - remove event listeners
 * - remove lifecycle hooks
 * - remove refs
 * - transform context to prop drilling
 */
var RSC_TRANSFORM_PLUGIN = function () { return ({
    json: {
        pre: function (json) {
            if (json.hooks.onMount) {
                delete json.hooks.onMount;
            }
            if (json.hooks.onUnMount) {
                delete json.hooks.onUnMount;
            }
            if (json.hooks.onUpdate) {
                delete json.hooks.onUpdate;
            }
            if (json.refs) {
                json.refs = {};
            }
            (0, traverse_1.default)(json).forEach(function (node) {
                if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
                    if ((0, is_upper_case_1.isUpperCase)(node.name[0])) {
                        // Drill context down, aka
                        // function (props) { return <Component _context{props._context} /> }
                        if (!node.bindings[react_1.contextPropDrillingKey]) {
                            node.bindings[react_1.contextPropDrillingKey] = {
                                code: react_1.contextPropDrillingKey,
                            };
                        }
                    }
                    if (node.bindings.ref) {
                        delete node.bindings.ref;
                    }
                    for (var key in node.bindings) {
                        if (key.match(/^on[A-Z]/)) {
                            delete node.bindings[key];
                        }
                    }
                }
            });
        },
    },
}); };
var DEFAULT_OPTIONS = {
    plugins: [RSC_TRANSFORM_PLUGIN],
};
var componentToRsc = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var component = _a.component, path = _a.path;
        var json = (0, fast_clone_1.fastClone)(component);
        var options = __assign(__assign(__assign({}, DEFAULT_OPTIONS), _options), { plugins: __spreadArray(__spreadArray([], (DEFAULT_OPTIONS.plugins || []), true), (_options.plugins || []), true), stylesType: 'style-tag', stateType: 'variables', contextType: 'prop-drill' });
        return (0, react_1.componentToReact)(options)({ component: json, path: path });
    };
};
exports.componentToRsc = componentToRsc;
