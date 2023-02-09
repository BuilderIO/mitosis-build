"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var alpine_1 = require("../generators/alpine");
var shared_1 = require("./shared");
describe('Alpine.js', function () {
    var possibleOptions = [
        {},
        // { inlineState: true },
        // { useShorthandSyntax: true },
        // { inlineState: true, useShorthandSyntax: true },
    ];
    possibleOptions.map(function (options) {
        return (0, shared_1.runTestsForTarget)({ options: options, target: 'alpine', generator: alpine_1.componentToAlpine });
    });
});
