"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var html_1 = require("../generators/html");
var test_generator_1 = require("./test-generator");
var shadow_dom_raw_tsx_raw_1 = __importDefault(require("./data/blocks/shadow-dom.raw.tsx?raw"));
describe('webcomponent', function () {
    var generator = html_1.componentToCustomElement;
    (0, test_generator_1.runTestsForTarget)({ options: {}, target: 'webcomponent', generator: generator });
    test('Shadow DOM', function () {
        var component = (0, __1.parseJsx)(shadow_dom_raw_tsx_raw_1.default);
        var html = generator()({ component: component });
        expect(html).toMatchSnapshot();
    });
});
