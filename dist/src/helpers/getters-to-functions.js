"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gettersToFunctions = void 0;
var traverse_1 = __importDefault(require("traverse"));
/**
 * Map getters like `useStore({ get foo() { ... }})` from `state.foo` to `foo()`
 */
var gettersToFunctions = function (json) {
    var getterKeys = Object.keys(json.state).filter(function (item) { var _a; return ((_a = json.state[item]) === null || _a === void 0 ? void 0 : _a.type) === 'getter'; });
    (0, traverse_1.default)(json).forEach(function (item) {
        // TODO: not all strings are expressions!
        if (typeof item === 'string') {
            var value = item;
            var _loop_1 = function (key) {
                try {
                    value = value.replace(new RegExp("state\\s*\\.\\s*".concat(key, "([^a-z0-9]|$)"), 'gi'), function (match, group1) {
                        if (match.endsWith('?')) {
                            return "".concat(key, "?.()").concat(group1);
                        }
                        return "".concat(key, "()").concat(group1);
                    });
                }
                catch (err) {
                    console.error('Could not update getter ref', err);
                }
            };
            for (var _i = 0, getterKeys_1 = getterKeys; _i < getterKeys_1.length; _i++) {
                var key = getterKeys_1[_i];
                _loop_1(key);
            }
            if (value !== item) {
                this.update(value);
            }
        }
    });
};
exports.gettersToFunctions = gettersToFunctions;
