"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOnEventHooksPlugin = exports.getOnEventHooksForNode = exports.getOnEventHandlerName = void 0;
var capitalize_1 = require("./capitalize");
var traverse_nodes_1 = require("./traverse-nodes");
var checkIsEventHandlerNode = function (node, hook) {
    var _a;
    return hook.refName === ((_a = node.bindings.ref) === null || _a === void 0 ? void 0 : _a.code);
};
var getBindingName = function (hook) {
    return "on".concat((0, capitalize_1.capitalize)(hook.eventName));
};
var getOnEventHandlerName = function (hook) {
    return "".concat(hook.refName, "_").concat(getBindingName(hook));
};
exports.getOnEventHandlerName = getOnEventHandlerName;
var getOnEventHooksForNode = function (_a) {
    var node = _a.node, component = _a.component;
    return component.hooks.onEvent.filter(function (hook) { return checkIsEventHandlerNode(node, hook); });
};
exports.getOnEventHooksForNode = getOnEventHooksForNode;
/**
 * Adds event handlers from `onEvent` hooks to the appropriate node's bindings.
 * Only works with frameworks that support custom events in their templates.
 */
var processOnEventHooksPlugin = function (args) {
    if (args === void 0) { args = {}; }
    return function () { return ({
        json: {
            pre: function (component) {
                var _a = args.setBindings, setBindings = _a === void 0 ? true : _a, _b = args.includeRootEvents, includeRootEvents = _b === void 0 ? true : _b;
                (0, traverse_nodes_1.traverseNodes)(component, function (node) {
                    (0, exports.getOnEventHooksForNode)({ node: node, component: component }).forEach(function (hook) {
                        if (!includeRootEvents && hook.isRoot)
                            return;
                        var handlerName = getBindingName(hook);
                        var fnName = (0, exports.getOnEventHandlerName)(hook);
                        component.state[fnName] = {
                            code: "".concat(fnName, "(").concat(hook.eventArgName, ") { ").concat(hook.code, " }"),
                            type: 'method',
                        };
                        if (setBindings) {
                            node.bindings[handlerName] = {
                                code: "state.".concat(fnName, "(").concat(hook.eventArgName, ")"),
                                arguments: [hook.eventArgName],
                                type: 'single',
                            };
                        }
                    });
                });
            },
        },
    }); };
};
exports.processOnEventHooksPlugin = processOnEventHooksPlugin;
