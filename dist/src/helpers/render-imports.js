"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderExportAndLocal = exports.renderPreComponent = exports.renderImports = exports.renderImport = void 0;
var DEFAULT_IMPORT = 'default';
var STAR_IMPORT = '*';
var getStarImport = function (_a) {
    var theImport = _a.theImport;
    for (var key in theImport.imports) {
        var value = theImport.imports[key];
        if (value === STAR_IMPORT) {
            return key;
        }
    }
    return null;
};
var getDefaultImport = function (_a) {
    var theImport = _a.theImport;
    for (var key in theImport.imports) {
        var value = theImport.imports[key];
        if (value === DEFAULT_IMPORT) {
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
        case 'vue2':
        case 'vue3':
            return '.vue';
        // these `.lite` extensions are handled in the `transpile` step of the CLI.
        // TO-DO: consolidate file-extension renaming to one place.
        default:
            return '.lite';
    }
};
var checkIsComponentImport = function (theImport) {
    return theImport.path.endsWith('.lite') && !theImport.path.endsWith('.context.lite');
};
var transformImportPath = function (theImport, target) {
    // We need to drop the `.lite` from context files, because the context generator does so as well.
    if (theImport.path.endsWith('.context.lite')) {
        return theImport.path.replace('.lite', '');
    }
    if (checkIsComponentImport(theImport)) {
        return theImport.path.replace('.lite', getFileExtensionForTarget(target));
    }
    return theImport.path;
};
var getNamedImports = function (_a) {
    var theImport = _a.theImport;
    var namedImports = Object.entries(theImport.imports)
        .filter(function (_a) {
        var value = _a[1];
        return ![DEFAULT_IMPORT, STAR_IMPORT].includes(value);
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        return key !== value ? "".concat(value, " as ").concat(key) : value;
    });
    if (namedImports.length > 0) {
        return "{ ".concat(namedImports.join(', '), " }");
    }
    else {
        return null;
    }
};
var getImportedValues = function (_a) {
    var theImport = _a.theImport;
    var starImport = getStarImport({ theImport: theImport });
    var defaultImport = getDefaultImport({ theImport: theImport });
    var namedImports = getNamedImports({ theImport: theImport });
    return { starImport: starImport, defaultImport: defaultImport, namedImports: namedImports };
};
var getImportValue = function (_a) {
    var defaultImport = _a.defaultImport, namedImports = _a.namedImports, starImport = _a.starImport;
    if (starImport) {
        return " * as ".concat(starImport, " ");
    }
    else {
        return [defaultImport, namedImports].filter(Boolean).join(', ');
    }
};
var renderImport = function (_a) {
    var theImport = _a.theImport, target = _a.target, asyncComponentImports = _a.asyncComponentImports;
    var importedValues = getImportedValues({ theImport: theImport });
    var path = transformImportPath(theImport, target);
    var importValue = getImportValue(importedValues);
    var isComponentImport = checkIsComponentImport(theImport);
    var shouldBeAsyncImport = asyncComponentImports && isComponentImport;
    if (shouldBeAsyncImport) {
        var isVueImport = target === 'vue';
        if (isVueImport && importedValues.namedImports) {
            console.warn('Vue: Async Component imports cannot include named imports. Dropping async import. This might break your code.');
        }
        else {
            return "const ".concat(importValue, " = () => import('").concat(path, "')");
        }
    }
    return importValue ? "import ".concat(importValue, " from '").concat(path, "';") : "import '".concat(path, "';");
};
exports.renderImport = renderImport;
var renderImports = function (_a) {
    var imports = _a.imports, target = _a.target, asyncComponentImports = _a.asyncComponentImports;
    return imports
        .filter(function (theImport) {
        if (
        // Remove compile away components
        theImport.path === '@builder.io/components' ||
            // TODO: Mitosis output needs this
            theImport.path.startsWith('@builder.io/mitosis')) {
            return false;
        }
        else if (target === 'angular' && theImport.path.includes('.lite')) {
            return false;
        }
        else {
            return true;
        }
    })
        .map(function (theImport) { return (0, exports.renderImport)({ theImport: theImport, target: target, asyncComponentImports: asyncComponentImports }); })
        .join('\n');
};
exports.renderImports = renderImports;
var renderPreComponent = function (_a) {
    var component = _a.component, target = _a.target, _b = _a.asyncComponentImports, asyncComponentImports = _b === void 0 ? false : _b;
    return "\n    ".concat((0, exports.renderImports)({
        imports: component.imports,
        target: target,
        asyncComponentImports: asyncComponentImports,
    }), "\n    ").concat((0, exports.renderExportAndLocal)(component), "\n    ").concat(component.hooks.preComponent || '', "\n  ");
};
exports.renderPreComponent = renderPreComponent;
var renderExportAndLocal = function (component) {
    return Object.keys(component.exports || {})
        .map(function (key) { return component.exports[key].code; })
        .join('\n');
};
exports.renderExportAndLocal = renderExportAndLocal;
