"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rsc_1 = require("../generators/rsc");
var shared_1 = require("./shared");
describe('RSC', function () {
    (0, shared_1.runTestsForTarget)({ options: {}, target: 'rsc', generator: rsc_1.componentToRsc });
});
