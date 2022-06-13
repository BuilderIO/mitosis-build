"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderExportAndLocal = exports.renderPreComponent = exports.renderImports = exports.renderImport = void 0;
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
var getFileExtensionForTarget = function (target) {
    switch (target) {
        case 'svelte':
            return '.svelte';
        case 'solid':
            return '.jsx';
        case 'vue':
            return '.vue';
        // these `.lite` extensions are handled in the `transpile` step of the CLI.
        // TO-DO: consolidate file-extension renaming to one place.
        default:
            return '.lite';
    }
};
var transformImportPath = function (theImport, target) {
    // We need to drop the `.lite` from context files, because the context generator does so as well.
    if (theImport.path.endsWith('.context.lite')) {
        return theImport.path.replace('.lite', '');
    }
    if (theImport.path.endsWith('.lite')) {
        return theImport.path.replace('.lite', getFileExtensionForTarget(target));
    }
    return theImport.path;
};
var getImportedValues = function (_a) {
    var theImport = _a.theImport;
    var importString = '';
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
    return importString;
};
var renderImport = function (_a) {
    var theImport = _a.theImport, target = _a.target;
    var importedValues = getImportedValues({ theImport: theImport });
    var path = transformImportPath(theImport, target);
    return "import ".concat(importedValues, " from '").concat(path, "';");
};
exports.renderImport = renderImport;
var renderImports = function (_a) {
    var imports = _a.imports, target = _a.target;
    return imports
        .filter(function (theImport) {
        if (
        // Remove compile away components
        theImport.path === '@builder.io/components' ||
            // TODO: Mitosis output needs this
            theImport.path.startsWith('@builder.io/mitosis')) {
            return false;
        }
        else {
            return true;
        }
    })
        .map(function (theImport) { return (0, exports.renderImport)({ theImport: theImport, target: target }); })
        .join('\n');
};
exports.renderImports = renderImports;
var renderPreComponent = function (component, target) { return "\n    ".concat((0, exports.renderImports)({ imports: component.imports, target: target }), "\n    ").concat((0, exports.renderExportAndLocal)(component), "\n    ").concat(component.hooks.preComponent || '', "\n  "); };
exports.renderPreComponent = renderPreComponent;
var renderExportAndLocal = function (component) {
    return Object.keys(component.exports || {})
        .map(function (key) { return component.exports[key].code; })
        .join('\n');
};
exports.renderExportAndLocal = renderExportAndLocal;
