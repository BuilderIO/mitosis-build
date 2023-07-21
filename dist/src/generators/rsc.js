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
exports.componentToRsc = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var merge_options_1 = require("../helpers/merge-options");
var nullable_1 = require("../helpers/nullable");
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
            delete json.hooks.onMount;
            delete json.hooks.onUnMount;
            delete json.hooks.onUpdate;
            json.refs = {};
            json.context.get = {};
            json.context.set = {};
            (0, traverse_1.default)(json).forEach(function (node) {
                if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
                    var isComponent = node.name.match(/[A-Z]/);
                    // if (isComponent) {
                    //   // Drill context down, aka
                    //   // function (props) { return <Component _context{props._context} /> }
                    //   if (!node.bindings[contextPropDrillingKey]) {
                    //     node.bindings[contextPropDrillingKey] = createSingleBinding({
                    //       code: contextPropDrillingKey,
                    //     });
                    //   }
                    // }
                    if (node.bindings.ref) {
                        delete node.bindings.ref;
                    }
                    // for (const key in node.bindings) {
                    //   if (key.match(/^on[A-Z]/)) {
                    //     delete node.bindings[key];
                    //   }
                    // }
                }
            });
        },
    },
}); };
var checkIfIsRsc = function (json) {
    if (json.hooks.onMount)
        return false;
    if (json.hooks.onUnMount)
        return false;
    if (json.hooks.onUpdate)
        return false;
    if (Object.keys(json.refs).length)
        return false;
    if (Object.keys(json.context.get).length)
        return false;
    if (Object.keys(json.context.set).length)
        return false;
    if (Object.values(json.state).filter(function (s) { return (s === null || s === void 0 ? void 0 : s.type) === 'property'; }).length)
        return false;
    return true;
};
var RscOptions = {
    plugins: [RSC_TRANSFORM_PLUGIN],
    stateType: 'variables',
};
var componentToRsc = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f;
        var component = _a.component, path = _a.path;
        if (!(0, nullable_1.checkIsDefined)((_c = (_b = component.meta.useMetadata) === null || _b === void 0 ? void 0 : _b.rsc) === null || _c === void 0 ? void 0 : _c.componentType) &&
            checkIfIsRsc(component)) {
            component.meta.useMetadata = __assign(__assign({}, component.meta.useMetadata), { rsc: __assign(__assign({}, (_d = component.meta.useMetadata) === null || _d === void 0 ? void 0 : _d.rsc), { componentType: 'server' }) });
        }
        var isRSC = ((_f = (_e = component.meta.useMetadata) === null || _e === void 0 ? void 0 : _e.rsc) === null || _f === void 0 ? void 0 : _f.componentType) === 'server';
        var options = (0, merge_options_1.mergeOptions)(__assign({ rsc: true }, (isRSC ? RscOptions : {})), _options);
        return (0, react_1.componentToReact)(options)({ component: component, path: path });
    };
};
exports.componentToRsc = componentToRsc;
