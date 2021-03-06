"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_1 = require("../parsers/jsx");
var buttonWithMetadata = require('./data/blocks/button-with-metadata.raw');
var image = require('./data/blocks/image.raw');
var basicOnUpdateReturn = require('./data/basic-onUpdate-return.raw');
var basicMitosis = require('./data/basic-custom-mitosis-package.raw');
var basicRef = require('./data/basic-ref.raw');
var basicPropsRaw = require('./data/basic-props.raw');
var basicPropsDestructureRaw = require('./data/basic-props-destructure.raw');
describe('Parse JSX', function () {
    test('metadata', function () {
        var json = (0, jsx_1.parseJsx)(buttonWithMetadata);
        expect(json).toMatchSnapshot();
    });
    test('Image', function () {
        var json = (0, jsx_1.parseJsx)(image);
        expect(json).toMatchSnapshot();
    });
    test('onUpdate return', function () {
        var json = (0, jsx_1.parseJsx)(basicOnUpdateReturn);
        expect(json).toMatchSnapshot();
    });
    test('useRef', function () {
        var json = (0, jsx_1.parseJsx)(basicRef);
        expect(json).toMatchSnapshot();
    });
    test('custom mitosis package', function () {
        var json = (0, jsx_1.parseJsx)(basicMitosis, {
            compileAwayPackages: ['@dummy/custom-mitosis'],
        });
        expect(json).toMatchSnapshot();
    });
    test('custom mitosis package', function () {
        expect((0, jsx_1.parseJsx)(basicPropsRaw)).toEqual((0, jsx_1.parseJsx)(basicPropsDestructureRaw));
    });
});
