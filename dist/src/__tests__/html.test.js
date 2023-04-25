"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = require("../generators/html");
var test_generator_1 = require("./test-generator");
describe('Html', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'html', generator: html_1.componentToHtml });
});
