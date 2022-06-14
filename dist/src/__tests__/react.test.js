"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var react_1 = require("../generators/react");
var shared_1 = require("./shared");
var stamped = require('./data/blocks/stamped-io.raw');
describe('React', function () {
    (0, shared_1.runTestsForTarget)('react', (0, react_1.componentToReact)());
    test('stamped', function () {
        var component = (0, __1.parseJsx)(stamped);
        var output = (0, react_1.componentToReact)({
            stylesType: 'styled-components',
            stateType: 'useState',
        })({ component: component });
        expect(output).toMatchSnapshot();
    });
});
