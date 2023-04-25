"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var test_generator_1 = require("./test-generator");
describe('Angular', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'angular', generator: angular_1.componentToAngular });
    (0, test_generator_1.runTestsForTarget)({
        options: {
            standalone: true,
        },
        target: 'angular',
        generator: angular_1.componentToAngular,
    });
});
