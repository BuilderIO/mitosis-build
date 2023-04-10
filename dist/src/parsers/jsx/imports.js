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
exports.handleImportDeclaration = void 0;
var babel = __importStar(require("@babel/core"));
var types = babel.types;
var handleImportDeclaration = function (_a) {
    var options = _a.options, path = _a.path, context = _a.context;
    // @builder.io/mitosis or React imports compile away
    var customPackages = (options === null || options === void 0 ? void 0 : options.compileAwayPackages) || [];
    if (__spreadArray(['react', '@builder.io/mitosis', '@emotion/react'], customPackages, true).includes(path.node.source.value)) {
        path.remove();
        return;
    }
    var importObject = {
        imports: {},
        path: path.node.source.value,
    };
    for (var _i = 0, _b = path.node.specifiers; _i < _b.length; _i++) {
        var specifier = _b[_i];
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
    context.builder.component.imports.push(importObject);
    path.remove();
};
exports.handleImportDeclaration = handleImportDeclaration;
