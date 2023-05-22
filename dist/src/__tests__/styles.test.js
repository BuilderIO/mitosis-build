"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_1 = require("../parsers/jsx");
var class_and_className_raw_tsx_raw_1 = __importDefault(require("./data/styles/class-and-className.raw.tsx?raw"));
var class_raw_tsx_raw_1 = __importDefault(require("./data/styles/class.raw.tsx?raw"));
var className_raw_tsx_raw_1 = __importDefault(require("./data/styles/className.raw.tsx?raw"));
describe('Styles', function () {
    test('class and className are equivalent', function () {
        expect((0, jsx_1.parseJsx)(class_raw_tsx_raw_1.default)).toEqual((0, jsx_1.parseJsx)(className_raw_tsx_raw_1.default));
    });
    test('class and CSS are merged', function () {
        var component = (0, jsx_1.parseJsx)(class_raw_tsx_raw_1.default);
        expect(component).toMatchSnapshot();
    });
    test('className and CSS are merged', function () {
        var component = (0, jsx_1.parseJsx)(className_raw_tsx_raw_1.default);
        expect(component).toMatchSnapshot();
    });
    test('class and className are merged', function () {
        var component = (0, jsx_1.parseJsx)(class_and_className_raw_tsx_raw_1.default);
        expect(component).toMatchSnapshot();
    });
});
