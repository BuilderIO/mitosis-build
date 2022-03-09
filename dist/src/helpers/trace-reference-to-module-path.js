"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceReferenceToModulePath = void 0;
function traceReferenceToModulePath(imports, name) {
    var response = null;
    for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
        var importInfo = imports_1[_i];
        if (name in importInfo.imports) {
            return "".concat(importInfo.path, ":").concat(importInfo.imports[name]);
        }
    }
    return response;
}
exports.traceReferenceToModulePath = traceReferenceToModulePath;
