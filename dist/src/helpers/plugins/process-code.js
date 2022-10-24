"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CODE_PROCESSOR_PLUGIN = void 0;
var nullable_1 = require("../nullable");
var traverse_nodes_1 = require("../traverse-nodes");
/**
 * Process code in bindings and properties of a node
 */
var preProcessBlockCode = function (_a) {
    var json = _a.json, codeProcessor = _a.codeProcessor;
    var propertiesProcessor = codeProcessor('properties');
    for (var key in json.properties) {
        var value = json.properties[key];
        if (value) {
            json.properties[key] = propertiesProcessor(value);
        }
    }
    var bindingsProcessor = codeProcessor('bindings');
    for (var key in json.bindings) {
        var value = json.bindings[key];
        if (value === null || value === void 0 ? void 0 : value.code) {
            value.code = bindingsProcessor(value.code);
        }
    }
};
/**
 * Given a `codeProcessor` function, processes all code expressions within a Mitosis component.
 */
var CODE_PROCESSOR_PLUGIN = function (codeProcessor) {
    return function () { return ({
        json: {
            post: function (json) {
                var processHookCode = codeProcessor('hooks');
                /**
                 * process code in hooks
                 */
                for (var key in json.hooks) {
                    var typedKey = key;
                    var hooks = json.hooks[typedKey];
                    if ((0, nullable_1.checkIsDefined)(hooks) && Array.isArray(hooks)) {
                        for (var _i = 0, hooks_1 = hooks; _i < hooks_1.length; _i++) {
                            var hook = hooks_1[_i];
                            hook.code = processHookCode(hook.code);
                            if (hook.deps) {
                                hook.deps = codeProcessor('hooks-deps')(hook.deps);
                            }
                        }
                    }
                    else if ((0, nullable_1.checkIsDefined)(hooks)) {
                        hooks.code = processHookCode(hooks.code);
                        if (hooks.deps) {
                            hooks.deps = codeProcessor('hooks-deps')(hooks.deps);
                        }
                    }
                }
                for (var key in json.state) {
                    var state = json.state[key];
                    if (state && state.type !== 'property') {
                        state.code = codeProcessor('state')(state.code);
                    }
                }
                (0, traverse_nodes_1.tarverseNodes)(json, function (node) {
                    preProcessBlockCode({ json: node, codeProcessor: codeProcessor });
                });
            },
        },
    }); };
};
exports.CODE_PROCESSOR_PLUGIN = CODE_PROCESSOR_PLUGIN;
