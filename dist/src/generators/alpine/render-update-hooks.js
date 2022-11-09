"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWatchHooks = exports.hasWatchHooks = exports.renderUpdateHooks = exports.hasRootUpdateHook = void 0;
var lodash_1 = require("lodash");
var extractCode = function (hook) { return hook.code; };
function renderRootUpdateHook(hooks, output) {
    if (hooks.length === 0) {
        return output;
    }
    var str = "onUpdate() {\n        ".concat(hooks.map(extractCode).join('\n'), "\n    }");
    return output.replace(/,?(\s*})$/, ",\n".concat(str, "$1"));
}
function getRootUpdateHooks(json) {
    var _a;
    return ((_a = json.hooks.onUpdate) !== null && _a !== void 0 ? _a : []).filter(function (hook) { return hook.deps == ''; });
}
function hasRootUpdateHook(json) {
    return getRootUpdateHooks(json).length > 0;
}
exports.hasRootUpdateHook = hasRootUpdateHook;
exports.renderUpdateHooks = (0, lodash_1.curry)(function (json, output) {
    return renderRootUpdateHook(getRootUpdateHooks(json), output);
});
function getWatchHooks(json) {
    var _a;
    return ((_a = json.hooks.onUpdate) !== null && _a !== void 0 ? _a : []).filter(function (hook) { var _a; return (_a = hook.deps) === null || _a === void 0 ? void 0 : _a.match(/state|this/); });
}
var hasWatchHooks = function (json) {
    return getWatchHooks(json).length > 0;
};
exports.hasWatchHooks = hasWatchHooks;
function renderWatchHook(hook) {
    var _a, _b;
    var deps = (_b = ((_a = hook.deps) !== null && _a !== void 0 ? _a : '')) === null || _b === void 0 ? void 0 : _b.slice(1).slice(0, -1).split(', ').filter(function (dep) { return dep.match(/state|this/); });
    return deps
        .map(function (dep) {
        return "this.$watch('".concat(dep.replace(/(state|this)\./, ''), "', (value, oldValue) => { ").concat(hook.code, " });");
    })
        .join('\n');
}
var renderWatchHooks = function (json) {
    return (0, exports.hasWatchHooks)(json) ? getWatchHooks(json).map(renderWatchHook).join('\n') : '';
};
exports.renderWatchHooks = renderWatchHooks;
