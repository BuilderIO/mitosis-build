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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMitosisComponent = void 0;
var createMitosisComponent = function (options) {
    var _a = options || {}, name = _a.name, hooks = _a.hooks, remainingOpts = __rest(_a, ["name", "hooks"]);
    var _b = hooks || {}, _c = _b.onEvent, onEvent = _c === void 0 ? [] : _c, _d = _b.onMount, onMount = _d === void 0 ? [] : _d, remainingHooks = __rest(_b, ["onEvent", "onMount"]);
    return __assign({ '@type': '@builder.io/mitosis/component', imports: [], exports: {}, inputs: [], meta: {}, refs: {}, state: {}, children: [], context: { get: {}, set: {} }, subComponents: [], name: name || 'MyComponent', hooks: __assign({ onMount: onMount, onEvent: onEvent }, remainingHooks) }, remainingOpts);
};
exports.createMitosisComponent = createMitosisComponent;
