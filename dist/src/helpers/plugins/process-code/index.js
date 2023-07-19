"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CODE_PROCESSOR_PLUGIN = exports.createCodeProcessorPlugin = void 0;
var function_1 = require("fp-ts/lib/function");
var nullable_1 = require("../../nullable");
var traverse_nodes_1 = require("../../traverse-nodes");
var createCodeProcessorPlugin = function (codeProcessor, _a) {
    var _b = _a === void 0 ? { processProperties: false } : _a, processProperties = _b.processProperties;
    return function (json) {
        var _a;
        function processHook(key, hook) {
            var result = codeProcessor('hooks', json)(hook.code, key);
            if (typeof result === 'string') {
                hook.code = result;
            }
            else {
                result();
            }
            if (hook.deps) {
                var result_1 = codeProcessor('hooks-deps', json)(hook.deps, key);
                if (typeof result_1 === 'string') {
                    hook.deps = result_1;
                }
                else {
                    result_1();
                }
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
                var result = codeProcessor('state', json)(state.code, key);
                if (typeof result === 'string') {
                    state.code = result;
                }
                else {
                    result();
                }
                if (state.typeParameter) {
                    var result_2 = codeProcessor('types', json)(state.typeParameter, key);
                    if (typeof result_2 === 'string') {
                        state.typeParameter = result_2;
                    }
                    else {
                        result_2();
                    }
                }
            }
        }
        for (var key in json.context.set) {
            var set = json.context.set[key];
            if (set.ref) {
                var result = codeProcessor('context-set', json)(set.ref, key);
                if (typeof result === 'string') {
                    set.ref = result;
                }
                else {
                    result();
                }
            }
            if (set.value) {
                for (var key_1 in set.value) {
                    var value = set.value[key_1];
                    if (value) {
                        var result = codeProcessor('context-set', json)(value.code, key_1);
                        if (typeof result === 'string') {
                            value.code = result;
                        }
                        else {
                            result();
                        }
                    }
                }
            }
        }
        (0, traverse_nodes_1.traverseNodes)(json, function (node) {
            if (processProperties) {
                for (var key in node.properties) {
                    var value = node.properties[key];
                    if (key !== '_text' && value) {
                        var result_3 = codeProcessor('properties', json, node)(value, key);
                        if (typeof result_3 === 'string') {
                            node.properties[key] = result_3;
                        }
                        else {
                            result_3();
                        }
                    }
                }
            }
            for (var key in node.bindings) {
                var value = node.bindings[key];
                if (value === null || value === void 0 ? void 0 : value.code) {
                    var result_4 = codeProcessor('bindings', json, node)(value.code, key);
                    if (typeof result_4 === 'string') {
                        value.code = result_4;
                    }
                    else {
                        result_4();
                    }
                }
            }
            var result = codeProcessor('dynamic-jsx-elements', json)(node.name, '');
            if (typeof result === 'string') {
                node.name = result;
            }
            else {
                result();
            }
        });
        if (json.types) {
            json.types = (_a = json.types) === null || _a === void 0 ? void 0 : _a.map(function (type) {
                var result = codeProcessor('types', json)(type, '');
                if (typeof result === 'string') {
                    return result;
                }
                result();
                return type;
            });
        }
        if (json.propsTypeRef) {
            var result = codeProcessor('types', json)(json.propsTypeRef, '');
            if (typeof result === 'string') {
                json.propsTypeRef = result;
            }
            else {
                result();
            }
        }
    };
};
exports.createCodeProcessorPlugin = createCodeProcessorPlugin;
/**
 * Given a `codeProcessor` function, processes all code expressions within a Mitosis component.
 */
exports.CODE_PROCESSOR_PLUGIN = (0, function_1.flow)(exports.createCodeProcessorPlugin, function (plugin) {
    return function () { return ({ json: { post: plugin } }); };
});
