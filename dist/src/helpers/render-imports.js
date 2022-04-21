"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPreComponent = void 0;
var getStarImport = function (_a) {
    var theImport = _a.theImport;
    for (var key in theImport.imports) {
        var value = theImport.imports[key];
        if (value === '*') {
            return key;
        }
    }
    return null;
};
var getDefaultImport = function (_a) {
    var theImport = _a.theImport;
    for (var key in theImport.imports) {
        var value = theImport.imports[key];
        if (value === 'default') {
            return key;
        }
    }
    return null;
};
var renderImport = function (_a) {
    var theImport = _a.theImport, target = _a.target;
    var importString = 'import ';
    var starImport = getStarImport({ theImport: theImport });
    if (starImport) {
        importString += " * as ".concat(starImport, " ");
    }
    else {
        var defaultImport = getDefaultImport({ theImport: theImport });
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
    var path = target === 'svelte' && theImport.path.endsWith('.lite')
        ? theImport.path.replace('.lite', '.svelte')
        : theImport.path;
    importString += " from '".concat(path, "';");
    return importString;
};
var renderImports = function (_a) {
    var imports = _a.imports, target = _a.target;
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
        importString += renderImport({ theImport: theImport, target: target }) + '\n';
    }
    return importString;
};
var renderPreComponent = function (component, target) { return "\n    ".concat(renderImports({ imports: component.imports, target: target }), "\n    ").concat(component.hooks.preComponent || '', "\n  "); };
exports.renderPreComponent = renderPreComponent;
