"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svelte_1 = require("../generators/svelte");
var test_generator_1 = require("./test-generator");
describe('Svelte', function () {
    (0, test_generator_1.runTestsForTarget)({ target: 'svelte', generator: svelte_1.componentToSvelte, options: {} });
});
