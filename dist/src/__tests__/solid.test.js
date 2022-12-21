"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var solid_1 = require("../generators/solid");
var shared_1 = require("./shared");
describe('Solid', function () {
    (0, shared_1.runTestsForTarget)({ options: {}, target: 'solid', generator: solid_1.componentToSolid });
    (0, shared_1.runTestsForTarget)({
        options: { stylesType: 'style-tag' },
        target: 'solid',
        generator: solid_1.componentToSolid,
    });
});
