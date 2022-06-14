"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var shared_1 = require("./shared");
describe('Angular', function () {
    (0, shared_1.runTestsForTarget)('angular', (0, angular_1.componentToAngular)());
});
