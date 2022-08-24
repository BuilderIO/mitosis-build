"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("../generators/react");
var shared_1 = require("./shared");
describe('Preact', function () {
    (0, shared_1.runTestsForTarget)('react', (0, react_1.componentToReact)({ preact: true }));
});
