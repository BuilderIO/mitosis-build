"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alpine_1 = require("../generators/alpine");
var test_generator_1 = require("./test-generator");
describe('Alpine.js', function () {
    var possibleOptions = [
        {},
        // { inlineState: true },
        // { useShorthandSyntax: true },
        // { inlineState: true, useShorthandSyntax: true },
    ];
    possibleOptions.map(function (options) {
        return (0, test_generator_1.runTestsForTarget)({ options: options, target: 'alpine', generator: alpine_1.componentToAlpine });
    });
});
