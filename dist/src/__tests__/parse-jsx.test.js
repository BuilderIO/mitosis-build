"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../parsers/jsx/state");
var jsx_1 = require("../parsers/jsx");
var jsx_json_spec_1 = require("./data/jsx-json.spec");
var test_generator_1 = require("./test-generator");
var button_with_metadata_raw_tsx_raw_1 = __importDefault(require("./data/blocks/button-with-metadata.raw.tsx?raw"));
var basic_props_raw_tsx_raw_1 = __importDefault(require("./data/basic-props.raw.tsx?raw"));
var basic_boolean_attribute_raw_tsx_raw_1 = __importDefault(require("./data/basic-boolean-attribute.raw.tsx?raw"));
var basic_props_destructure_raw_tsx_raw_1 = __importDefault(require("./data/basic-props-destructure.raw.tsx?raw"));
describe('Parse JSX', function () {
    test('parseStateObject', function () {
        var out = (0, state_1.parseStateObjectToMitosisState)(jsx_json_spec_1.SPEC);
        expect(out).toMatchSnapshot();
    });
    test('boolean attribute', function () {
        var out = (0, jsx_1.parseJsx)(basic_boolean_attribute_raw_tsx_raw_1.default);
        expect(out).toMatchSnapshot();
    });
    test('metadata', function () {
        var json = (0, jsx_1.parseJsx)(button_with_metadata_raw_tsx_raw_1.default);
        expect(json).toMatchSnapshot();
    });
    test('custom mitosis package', function () {
        expect((0, jsx_1.parseJsx)(basic_props_raw_tsx_raw_1.default)).toEqual((0, jsx_1.parseJsx)(basic_props_destructure_raw_tsx_raw_1.default));
    });
    (0, test_generator_1.runTestsForJsx)();
});
