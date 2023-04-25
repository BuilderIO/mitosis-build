"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var taro_1 = require("../generators/taro");
var test_generator_1 = require("./test-generator");
describe('Taro', function () {
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'taro', generator: taro_1.componentToTaro });
});
