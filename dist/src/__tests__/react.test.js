"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var react_1 = require("../generators/react");
var shared_1 = require("./shared");
var stamped_io_raw_tsx_raw_1 = __importDefault(require("./data/blocks/stamped-io.raw.tsx?raw"));
describe('React', function () {
    (0, shared_1.runTestsForTarget)({ options: {}, target: 'react', generator: react_1.componentToReact });
    test('stamped (useState)', function () {
        var component = (0, __1.parseJsx)(stamped_io_raw_tsx_raw_1.default);
        var output = (0, react_1.componentToReact)({
            stylesType: 'style-tag',
            stateType: 'useState',
        })({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('stamped (mobx)', function () {
        var component = (0, __1.parseJsx)(stamped_io_raw_tsx_raw_1.default);
        var output = (0, react_1.componentToReact)({
            stylesType: 'style-tag',
            stateType: 'mobx',
        })({ component: component });
        expect(output).toMatchSnapshot();
    });
});
