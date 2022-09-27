"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svelte_1 = require("../generators/svelte");
var shared_1 = require("./shared");
describe('Svelte', function () {
    (0, shared_1.runTestsForTarget)('svelte', (0, svelte_1.componentToSvelte)());
});
