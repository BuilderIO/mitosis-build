"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_1 = require("../parsers/jsx");
var buttonWithMetadata = require('./data/blocks/button-with-metadata.raw');
var image = require('./data/blocks/image.raw');
describe('Parse JSX', function () {
    test('metadata', function () {
        var json = (0, jsx_1.parseJsx)(buttonWithMetadata);
        expect(json).toMatchSnapshot();
    });
    test('Image', function () {
        var json = (0, jsx_1.parseJsx)(image);
        expect(json).toMatchSnapshot();
    });
});
