"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("../generators/react");
var shared_1 = require("./shared");
describe('Preact', function () {
    (0, shared_1.runTestsForTarget)({
        options: { preact: true },
        target: 'react',
        generator: react_1.componentToReact,
    });
});
