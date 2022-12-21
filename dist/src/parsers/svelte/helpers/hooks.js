"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToOnInitHook = void 0;
function addToOnInitHook(json, code) {
    var _a;
    if ((_a = json.hooks.onInit) === null || _a === void 0 ? void 0 : _a.code.length) {
        json.hooks.onInit.code += "\n ".concat(code);
    }
    else {
        json.hooks.onInit = {
            code: code,
        };
    }
}
exports.addToOnInitHook = addToOnInitHook;
