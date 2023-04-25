"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("../generators/react");
var test_generator_1 = require("./test-generator");
describe('Preact', function () {
    (0, test_generator_1.runTestsForTarget)({
        options: { preact: true },
        target: 'react',
        generator: react_1.componentToReact,
    });
});
