"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("../generators/vue");
var test_generator_1 = require("./test-generator");
describe('Vue', function () {
    (0, test_generator_1.runTestsForTarget)({ target: 'vue', generator: vue_1.componentToVue3, options: { api: 'composition' } });
});
