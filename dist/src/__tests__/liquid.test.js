"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var liquid_1 = require("../generators/liquid");
var test_generator_1 = require("./test-generator");
describe('Liquid', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'liquid', generator: liquid_1.componentToLiquid });
});
