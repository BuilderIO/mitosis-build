"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collect_css_1 = require("./collect-css");
var jsx_1 = require("../../parsers/jsx");
var classRaw = require('../../__tests__/data/styles/class.raw');
var classState = require('../../__tests__/data/styles/classState.raw');
describe('Styles', function () {
    test('class property and CSS are merged', function () {
        var component = (0, jsx_1.parseJsx)(classRaw);
        var output = (0, collect_css_1.collectCss)(component);
        expect({ component: component, output: output }).toMatchSnapshot();
    });
    test('class binding and CSS are merged', function () {
        var component = (0, jsx_1.parseJsx)(classState);
        var output = (0, collect_css_1.collectCss)(component);
        expect({ component: component, output: output }).toMatchSnapshot();
    });
});
