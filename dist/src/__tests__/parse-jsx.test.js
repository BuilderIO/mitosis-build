"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../parsers/jsx/state");
var jsx_1 = require("../parsers/jsx");
var jsx_json_spec_1 = require("./data/jsx-json.spec");
var shared_1 = require("./shared");
var buttonWithMetadata = require('./data/blocks/button-with-metadata.raw');
var basicPropsRaw = require('./data/basic-props.raw');
var basicBooleanAttribute = require('./data/basic-boolean-attribute.raw');
var basicPropsDestructureRaw = require('./data/basic-props-destructure.raw');
describe('Parse JSX', function () {
    test('parseStateObject', function () {
        var out = (0, state_1.parseStateObjectToMitosisState)(jsx_json_spec_1.SPEC);
        expect(out).toMatchSnapshot();
    });
    test('boolean attribute', function () {
        var out = (0, jsx_1.parseJsx)(basicBooleanAttribute);
        expect(out).toMatchSnapshot();
    });
    test('metadata', function () {
        var json = (0, jsx_1.parseJsx)(buttonWithMetadata);
        expect(json).toMatchSnapshot();
    });
    test('custom mitosis package', function () {
        expect((0, jsx_1.parseJsx)(basicPropsRaw)).toEqual((0, jsx_1.parseJsx)(basicPropsDestructureRaw));
    });
    (0, shared_1.runTestsForJsx)();
});
