"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var solid_1 = require("../generators/solid");
var test_generator_1 = require("./test-generator");
describe('Solid', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'solid', generator: solid_1.componentToSolid });
    (0, test_generator_1.runTestsForTarget)({
        options: { stylesType: 'style-tag' },
        target: 'solid',
        generator: solid_1.componentToSolid,
    });
});
