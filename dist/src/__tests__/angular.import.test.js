"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var shared_1 = require("./shared");
describe('Angular with Preserve Imports', function () {
    (0, shared_1.runTestsForTarget)({
        options: {
            preserveImports: true,
        },
        target: 'angular',
        generator: angular_1.componentToAngular,
    });
});
