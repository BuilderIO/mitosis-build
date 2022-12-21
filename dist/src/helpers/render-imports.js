"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderExportAndLocal = exports.renderPreComponent = exports.renderImports = exports.renderImport = exports.checkIsComponentImport = void 0;
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
        case 'marko':
            return '.marko';
        case 'lit':
            return '.js';
        case 'angular':
            return '';
        // these `.lite` extensions are handled in the `transpile` step of the CLI.
        // TO-DO: consolidate file-extension renaming to this file, and remove `.lite` replaces from the CLI `transpile`. (outdated) ?
        // Bit team wanted to make sure React and Angular behaved the same in regards to imports - ALU 10/05/22
        default:
            return '.lite';
    }
};
var checkIsComponentImport = function (theImport) {
    return theImport.path.endsWith('.lite') && !theImport.path.endsWith('.context.lite');
};
exports.checkIsComponentImport = checkIsComponentImport;
var transformImportPath = function (theImport, target, preserveFileExtensions) {
    // We need to drop the `.lite` from context files, because the context generator does so as well.
    if (theImport.path.endsWith('.context.lite')) {
        return theImport.path.replace('.lite', '.js');
    }
    if ((0, exports.checkIsComponentImport)(theImport) && !preserveFileExtensions) {
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
    var theImport = _a.theImport, target = _a.target, asyncComponentImports = _a.asyncComponentImports, _b = _a.preserveFileExtensions, preserveFileExtensions = _b === void 0 ? false : _b, _c = _a.component, component = _c === void 0 ? undefined : _c, _d = _a.componentsUsed, componentsUsed = _d === void 0 ? [] : _d, importMapper = _a.importMapper;
    var importedValues = getImportedValues({ theImport: theImport });
    var path = transformImportPath(theImport, target, preserveFileExtensions);
    var importValue = getImportValue(importedValues);
    var isComponentImport = (0, exports.checkIsComponentImport)(theImport);
    var shouldBeAsyncImport = asyncComponentImports && isComponentImport;
    // For lit (components) we just want to do a plain import
    // https://lit.dev/docs/components/rendering/#composing-templates
    if (isComponentImport && target === 'lit') {
        return "import '".concat(path, "';");
    }
    if (shouldBeAsyncImport) {
        var isVueImport = target === 'vue';
        if (isVueImport && importedValues.namedImports) {
            console.warn('Vue: Async Component imports cannot include named imports. Dropping async import. This might break your code.');
        }
        else {
            return "const ".concat(importValue, " = () => import('").concat(path, "')\n      .then(x => x.default)\n      .catch(err => { \n        console.error('Error while attempting to dynamically import component ").concat(importValue, " at ").concat(path, "', err);\n        throw err;\n      });");
        }
    }
    if (importMapper) {
        return importMapper(component, theImport, importedValues, componentsUsed);
    }
    return importValue ? "import ".concat(importValue, " from '").concat(path, "';") : "import '".concat(path, "';");
};
exports.renderImport = renderImport;
var renderImports = function (_a) {
    var imports = _a.imports, target = _a.target, asyncComponentImports = _a.asyncComponentImports, excludeMitosisComponents = _a.excludeMitosisComponents, _b = _a.preserveFileExtensions, preserveFileExtensions = _b === void 0 ? false : _b, component = _a.component, componentsUsed = _a.componentsUsed, importMapper = _a.importMapper;
    return imports
        .filter(function (theImport) {
        if (
        // Remove compile away components
        theImport.path === '@builder.io/components' ||
            // TODO: Mitosis output needs this
            theImport.path.startsWith('@builder.io/mitosis')) {
            return false;
        }
        else if (excludeMitosisComponents && theImport.path.includes('.lite')) {
            return false;
        }
        else {
            return true;
        }
    })
        .map(function (theImport) {
        return (0, exports.renderImport)({
            theImport: theImport,
            target: target,
            asyncComponentImports: asyncComponentImports,
            preserveFileExtensions: preserveFileExtensions,
            component: component,
            componentsUsed: componentsUsed,
            importMapper: importMapper,
        });
    })
        .join('\n');
};
exports.renderImports = renderImports;
var renderPreComponent = function (_a) {
    var _b;
    var component = _a.component, target = _a.target, excludeMitosisComponents = _a.excludeMitosisComponents, _c = _a.asyncComponentImports, asyncComponentImports = _c === void 0 ? false : _c, _d = _a.preserveFileExtensions, preserveFileExtensions = _d === void 0 ? false : _d, _e = _a.componentsUsed, componentsUsed = _e === void 0 ? [] : _e, importMapper = _a.importMapper;
    return "\n    ".concat((0, exports.renderImports)({
        imports: component.imports,
        target: target,
        asyncComponentImports: asyncComponentImports,
        excludeMitosisComponents: excludeMitosisComponents,
        preserveFileExtensions: preserveFileExtensions,
        component: component,
        componentsUsed: componentsUsed,
        importMapper: importMapper,
    }), "\n    ").concat((0, exports.renderExportAndLocal)(component), "\n    ").concat(((_b = component.hooks.preComponent) === null || _b === void 0 ? void 0 : _b.code) || '', "\n  ");
};
exports.renderPreComponent = renderPreComponent;
var renderExportAndLocal = function (component) {
    return Object.keys(component.exports || {})
        .map(function (key) { return component.exports[key].code; })
        .join('\n');
};
exports.renderExportAndLocal = renderExportAndLocal;
