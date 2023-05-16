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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getState = void 0;
var function_1 = require("fp-ts/lib/function");
var get_state_object_string_1 = require("../../../helpers/get-state-object-string");
var state_1 = require("../../../helpers/state");
var helpers_1 = require("./helpers");
var signals_1 = require("./signals");
var store_1 = require("./store");
var getState = function (_a) {
    var json = _a.json, options = _a.options;
    var hasState = (0, state_1.checkHasState)(json);
    if (!hasState) {
        return undefined;
    }
    // unbundle state in case the user provides a type override of one of the state values
    var _b = Object.entries(json.state).reduce(function (acc, _a) {
        var _b, _c, _d;
        var key = _a[0], value = _a[1];
        var stateType = (0, helpers_1.getStateTypeForValue)({ value: key, component: json, options: options });
        switch (stateType) {
            case 'mutable':
                return __assign(__assign({}, acc), { mutable: __assign(__assign({}, acc.mutable), (_b = {}, _b[key] = value, _b)) });
            case 'signals':
                return __assign(__assign({}, acc), { signal: __assign(__assign({}, acc.signal), (_c = {}, _c[key] = value, _c)) });
            case 'store':
                return __assign(__assign({}, acc), { store: __assign(__assign({}, acc.store), (_d = {}, _d[key] = value, _d)) });
        }
    }, { mutable: {}, signal: {}, store: {} }), mutable = _b.mutable, signal = _b.signal, store = _b.store;
    var hasMutableState = Object.keys(mutable).length > 0;
    var hasSignalState = Object.keys(signal).length > 0;
    var hasStoreState = Object.keys(store).length > 0;
    var mutableStateStr = hasMutableState
        ? (0, function_1.pipe)(mutable, get_state_object_string_1.getMemberObjectString, function (str) { return "const state = createMutable(".concat(str, ");"); })
        : '';
    var signalStateStr = hasSignalState ? (0, signals_1.getSignalsCode)({ json: json, options: options, state: signal }) : '';
    var storeStateStr = hasStoreState ? (0, store_1.getStoreCode)({ json: json, options: options, state: store }) : '';
    var stateStr = "\n  ".concat(mutableStateStr, "\n  ").concat(signalStateStr, "\n  ").concat(storeStateStr, "\n  ");
    var importObj = {
        store: __spreadArray(__spreadArray([], (hasMutableState ? ['createMutable'] : []), true), (hasStoreState ? ['createStore', 'reconcile'] : []), true),
        solidjs: __spreadArray(__spreadArray([], (hasSignalState ? ['createSignal'] : []), true), (hasStoreState ? ['createEffect', 'on'] : []), true),
    };
    return {
        str: stateStr,
        import: importObj,
    };
};
exports.getState = getState;
