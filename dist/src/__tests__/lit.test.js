"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lit_1 = require("../generators/lit");
var shared_1 = require("./shared");
describe('Lit', function () {
    (0, shared_1.runTestsForTarget)('lit', (0, lit_1.componentToLit)());
});
