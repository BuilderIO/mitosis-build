"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMountHook = void 0;
var lodash_1 = require("lodash");
var on_mount_1 = require("../helpers/on-mount");
var render_update_hooks_1 = require("./render-update-hooks");
function shouldRenderMountHook(json) {
    return json.hooks.onMount.length > 0 || (0, render_update_hooks_1.hasWatchHooks)(json);
}
exports.renderMountHook = (0, lodash_1.curry)(function (json, objectString) {
    return shouldRenderMountHook(json)
        ? objectString.replace(/(?:,)?(\s*)(}\s*)$/, ", init() {\n      ".concat((0, render_update_hooks_1.renderWatchHooks)(json), "\n      ").concat((0, on_mount_1.stringifySingleScopeOnMount)(json), "\n    }$1$2"))
        : objectString;
});
