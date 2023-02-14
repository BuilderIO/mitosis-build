"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var shared_1 = require("./shared");
describe('Angular with Preserve Imports and File Extensions', function () {
    (0, shared_1.runTestsForTarget)({
        options: {
            preserveImports: true,
            preserveFileExtensions: true,
        },
        target: 'angular',
        generator: angular_1.componentToAngular,
    });
});
