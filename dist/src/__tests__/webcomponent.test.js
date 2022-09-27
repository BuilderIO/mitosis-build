"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var html_1 = require("../generators/html");
var shared_1 = require("./shared");
var shadowDom = require('./data/blocks/shadow-dom.raw');
describe('webcomponent', function () {
    var generator = (0, html_1.componentToCustomElement)();
    (0, shared_1.runTestsForTarget)('webcomponent', generator);
    test('Shadow DOM', function () {
        var component = (0, __1.parseJsx)(shadowDom);
        var html = generator({ component: component });
        expect(html).toMatchSnapshot();
    });
});
