"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CODE_PROCESSOR_PLUGIN = void 0;
var nullable_1 = require("../nullable");
var traverse_nodes_1 = require("../traverse-nodes");
/**
 * Process code in bindings and properties of a node
 */
var preProcessBlockCode = function (_a) {
    // const propertiesProcessor = codeProcessor('properties');
    // for (const key in json.properties) {
    //   const value = json.properties[key];
    //   if (key !== '_text' && value) {
    //     json.properties[key] = propertiesProcessor(value);
    //   }
    // }
    var json = _a.json, codeProcessor = _a.codeProcessor;
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
                function processHook(key, hook) {
                    hook.code = codeProcessor('hooks')(hook.code, key);
                    if (hook.deps) {
                        hook.deps = codeProcessor('hooks-deps')(hook.deps);
                    }
                }
                /**
                 * process code in hooks
                 */
                for (var key in json.hooks) {
                    var typedKey = key;
                    var hooks = json.hooks[typedKey];
                    if ((0, nullable_1.checkIsDefined)(hooks)) {
                        if (Array.isArray(hooks)) {
                            for (var _i = 0, hooks_1 = hooks; _i < hooks_1.length; _i++) {
                                var hook = hooks_1[_i];
                                processHook(typedKey, hook);
                            }
                        }
                        else {
                            processHook(typedKey, hooks);
                        }
                    }
                }
                for (var key in json.state) {
                    var state = json.state[key];
                    if (state) {
                        state.code = codeProcessor('state')(state.code);
                    }
                }
                (0, traverse_nodes_1.traverseNodes)(json, function (node) {
                    preProcessBlockCode({ json: node, codeProcessor: codeProcessor });
                });
            },
        },
    }); };
};
exports.CODE_PROCESSOR_PLUGIN = CODE_PROCESSOR_PLUGIN;
