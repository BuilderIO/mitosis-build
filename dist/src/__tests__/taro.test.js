"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var taro_1 = require("../generators/taro");
var shared_1 = require("./shared");
describe('Taro', function () {
    (0, shared_1.runTestsForTarget)({ options: {}, target: 'taro', generator: taro_1.componentToTaro });
});
