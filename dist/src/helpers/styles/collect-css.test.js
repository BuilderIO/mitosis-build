"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_1 = require("../../parsers/jsx");
var collect_css_1 = require("./collect-css");
var class_raw_tsx_raw_1 = __importDefault(require("../../__tests__/data/styles/class.raw.tsx?raw"));
var classState_raw_tsx_raw_1 = __importDefault(require("../../__tests__/data/styles/classState.raw.tsx?raw"));
describe('Styles', function () {
    test('class property and CSS are merged', function () {
        var component = (0, jsx_1.parseJsx)(class_raw_tsx_raw_1.default);
        var output = (0, collect_css_1.collectCss)(component);
        expect({ component: component, output: output }).toMatchSnapshot();
    });
    test('class binding and CSS are merged', function () {
        var component = (0, jsx_1.parseJsx)(classState_raw_tsx_raw_1.default);
        var output = (0, collect_css_1.collectCss)(component);
        expect({ component: component, output: output }).toMatchSnapshot();
    });
});
