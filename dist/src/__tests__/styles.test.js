"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_1 = require("../parsers/jsx");
var classRaw = require('./data/styles/class.raw');
var className = require('./data/styles/className.raw');
var classAndClassName = require('./data/styles/class-and-className.raw');
describe('Styles', function () {
    test('class and className are equivalent', function () {
        expect((0, jsx_1.parseJsx)(classRaw)).toMatchSnapshot(className);
    });
    test('class and className are merged', function () {
        var component = (0, jsx_1.parseJsx)(classAndClassName);
        expect(component).toMatchSnapshot();
    });
});
