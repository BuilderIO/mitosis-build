"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var shared_1 = require("./shared");
describe('Angular with Import Mapper Tests', function () {
    (0, shared_1.runTestsForTarget)({
        options: {
            preserveImports: true,
            preserveFileExtensions: true,
            importMapper: function (component, theImport, importedValues, componentsUsed) {
                var importPath = theImport.path;
                for (var _i = 0, _a = componentsUsed || []; _i < _a.length; _i++) {
                    var componentName = _a[_i];
                    if (theImport.imports[componentName]) {
                        importPath = theImport.path + '/angular';
                    }
                }
                var defaultImport = importedValues.defaultImport, namedImports = importedValues.namedImports, starImport = importedValues.starImport;
                var importValue;
                if (starImport) {
                    importValue = " * as ".concat(starImport, " ");
                }
                else {
                    importValue = [defaultImport, namedImports]
                        .filter(Boolean)
                        .map(function (importName) {
                        for (var _i = 0, _a = componentsUsed || []; _i < _a.length; _i++) {
                            var usedComponentName = _a[_i];
                            if ((importName || '').indexOf(usedComponentName) > -1) {
                                return (importName || '').replace(usedComponentName, "".concat(usedComponentName, "Module"));
                            }
                        }
                        return importName;
                    })
                        .join(', ');
                }
                return "import ".concat(importValue, " from '").concat(importPath, "';");
            },
            bootstrapMapper: function (name, componentsUsed, component) {
                return 'bootstrap: [SomeOtherComponent]';
            },
        },
        target: 'angular',
        generator: angular_1.componentToAngular,
    });
});
