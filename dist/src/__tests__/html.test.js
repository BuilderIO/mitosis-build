"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = require("../generators/html");
var jsx_1 = require("../parsers/jsx");
var stamped = require('./data/blocks/stamped-io.raw');
describe('Html', function () {
    test('Stamped', function () {
        var component = (0, jsx_1.parseJsx)(stamped);
        var html = (0, html_1.componentToHtml)()({ component: component });
        expect(html).toMatchSnapshot();
    });
});
