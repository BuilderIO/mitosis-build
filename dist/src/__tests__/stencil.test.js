"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stencil_1 = require("../generators/stencil");
var test_generator_1 = require("./test-generator");
describe('Stencil', function () {
    (0, test_generator_1.runTestsForTarget)({
        target: 'stencil',
        generator: stencil_1.componentToStencil,
        options: {},
    });
});
