"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var liquid_1 = require("../generators/liquid");
var shared_1 = require("./shared");
describe('Liquid', function () {
    (0, shared_1.runTestsForTarget)('liquid', (0, liquid_1.componentToLiquid)());
});
