"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var solid_1 = require("../generators/solid");
var shared_1 = require("./shared");
describe('Solid', function () {
    (0, shared_1.runTestsForTarget)('solid', (0, solid_1.componentToSolid)());
});
