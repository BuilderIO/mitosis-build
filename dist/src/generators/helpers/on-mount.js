"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifySingleScopeOnMount = void 0;
/**
 * Helper for frameworks where all `onMount()`s must share a single scope.
 */
var stringifySingleScopeOnMount = function (json) {
    var hooks = json.hooks.onMount;
    if (hooks.length === 0)
        return '';
    if (hooks.length === 1) {
        return hooks[0].code;
    }
    return hooks
        .map(function (hook, i) {
        var hookFnName = "onMountHook_".concat(i);
        return "\n    const ".concat(hookFnName, " = () => {\n      ").concat(hook.code, "\n    }\n    ").concat(hookFnName, "();");
    })
        .join('');
};
exports.stringifySingleScopeOnMount = stringifySingleScopeOnMount;
