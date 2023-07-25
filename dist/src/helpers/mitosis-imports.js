"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapImportDeclarationToMitosisImport = void 0;
var babel = __importStar(require("@babel/core"));
var types = babel.types;
var mapImportDeclarationToMitosisImport = function (node) {
    var importObject = {
        imports: {},
        path: node.source.value,
        importKind: node.importKind,
    };
    for (var _i = 0, _a = node.specifiers; _i < _a.length; _i++) {
        var specifier = _a[_i];
        if (types.isImportSpecifier(specifier)) {
            importObject.imports[specifier.local.name] = specifier.imported.name;
        }
        else if (types.isImportDefaultSpecifier(specifier)) {
            importObject.imports[specifier.local.name] = 'default';
        }
        else if (types.isImportNamespaceSpecifier(specifier)) {
            importObject.imports[specifier.local.name] = '*';
        }
    }
    return importObject;
};
exports.mapImportDeclarationToMitosisImport = mapImportDeclarationToMitosisImport;
