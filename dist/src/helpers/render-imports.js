"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPreComponent = exports.renderImports = exports.renderImport = void 0;
var getStarImport = function (theImport) {
    for (var key in theImport.imports) {
        var value = theImport.imports[key];
        if (value === '*') {
            return key;
        }
    }
    return null;
};
var getDefaultImport = function (theImport) {
    for (var key in theImport.imports) {
        var value = theImport.imports[key];
        if (value === 'default') {
            return key;
        }
    }
    return null;
};
var renderImport = function (theImport) {
    var importString = 'import ';
    var starImport = getStarImport(theImport);
    if (starImport) {
        importString += " * as ".concat(starImport, " ");
    }
    else {
        var defaultImport = getDefaultImport(theImport);
        if (defaultImport) {
            importString += " ".concat(defaultImport, ", ");
        }
        importString += ' { ';
        var firstAdded = false;
        for (var key in theImport.imports) {
            var value = theImport.imports[key];
            if (['default', '*'].includes(value)) {
                continue;
            }
            if (firstAdded) {
                importString += ' , ';
            }
            else {
                firstAdded = true;
            }
            importString += " ".concat(value, " ");
            if (key !== value) {
                importString += " as ".concat(key, " ");
            }
        }
        importString += ' } ';
    }
    importString += " from '".concat(theImport.path, "';");
    return importString;
};
exports.renderImport = renderImport;
var renderImports = function (imports) {
    var importString = '';
    for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
        var theImport = imports_1[_i];
        // Remove compile away components
        if (theImport.path === '@builder.io/components') {
            continue;
        }
        // TODO: Mitosis output needs this
        if (theImport.path.startsWith('@builder.io/mitosis')) {
            continue;
        }
        importString += (0, exports.renderImport)(theImport) + '\n';
    }
    return importString;
};
exports.renderImports = renderImports;
var renderPreComponent = function (component) {
    return "\n    ".concat((0, exports.renderImports)(component.imports), "\n    ").concat(component.hooks.preComponent || '', "\n  ");
};
exports.renderPreComponent = renderPreComponent;
