"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var test_generator_1 = require("./test-generator");
describe('Angular with Preserve Imports and File Extensions', function () {
    (0, test_generator_1.runTestsForTarget)({
        options: {
            preserveImports: true,
            preserveFileExtensions: true,
        },
        target: 'angular',
        generator: angular_1.componentToAngular,
    });
});
