"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stencil_1 = require("../generators/stencil");
var shared_1 = require("./shared");
describe('Stencil', function () {
    (0, shared_1.runTestsForTarget)({
        target: 'stencil',
        generator: stencil_1.componentToStencil,
        options: {},
    });
});
