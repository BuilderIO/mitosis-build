"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = require("../generators/html");
var shared_1 = require("./shared");
describe('Html', function () {
    (0, shared_1.runTestsForTarget)('html', (0, html_1.componentToHtml)());
});
