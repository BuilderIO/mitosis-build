"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMountHook = void 0;
var lodash_1 = require("lodash");
var render_update_hooks_1 = require("./render-update-hooks");
function shouldRenderMountHook(json) {
    return json.hooks.onMount !== undefined || (0, render_update_hooks_1.hasWatchHooks)(json);
}
exports.renderMountHook = (0, lodash_1.curry)(function (json, objectString) {
    var _a, _b;
    return shouldRenderMountHook(json)
        ? objectString.replace(/(?:,)?(\s*)(}\s*)$/, ", init() {\n      ".concat((0, render_update_hooks_1.renderWatchHooks)(json), "\n      ").concat((_b = (_a = json.hooks.onMount) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : '', "\n    }$1$2"))
        : objectString;
});
