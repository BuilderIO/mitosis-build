"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsc_1 = require("../generators/rsc");
var test_generator_1 = require("./test-generator");
describe('RSC', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'rsc', generator: rsc_1.componentToRsc });
});
