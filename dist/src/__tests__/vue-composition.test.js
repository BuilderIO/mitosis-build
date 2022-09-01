"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("../generators/vue");
var shared_1 = require("./shared");
describe('Vue', function () {
    (0, shared_1.runTestsForTarget)({ target: 'vue', generator: vue_1.componentToVue3, options: { api: 'composition' } });
});
