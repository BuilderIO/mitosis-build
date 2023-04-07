"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var shared_1 = require("./shared");
describe('Angular', function () {
    (0, shared_1.runTestsForTarget)({ options: {}, target: 'angular', generator: angular_1.componentToAngular });
    (0, shared_1.runTestsForTarget)({
        options: {
            standalone: true,
        },
        target: 'angular',
        generator: angular_1.componentToAngular,
    });
});
