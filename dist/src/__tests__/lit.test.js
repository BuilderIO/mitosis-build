"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lit_1 = require("../generators/lit");
var test_generator_1 = require("./test-generator");
describe('Lit', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'lit', generator: lit_1.componentToLit });
});
