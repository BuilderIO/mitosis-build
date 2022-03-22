"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stencil_1 = require("../generators/stencil");
var jsx_1 = require("../parsers/jsx");
var basic = require('./data/basic.raw');
var submitButtonBlock = require('./data/blocks/submit-button.raw');
var inputBlock = require('./data/blocks/input.raw');
var selectBlock = require('./data/blocks/select.raw');
var formBlock = require('./data/blocks/form.raw');
var button = require('./data/blocks/button.raw');
var textarea = require('./data/blocks/textarea.raw');
var img = require('./data/blocks/img.raw');
var video = require('./data/blocks/video.raw');
var section = require('./data/blocks/section.raw');
var text = require('./data/blocks/text.raw');
var rawText = require('./data/blocks/raw-text.raw');
var customCode = require('./data/blocks/custom-code.raw');
var embed = require('./data/blocks/embed.raw');
var image = require('./data/blocks/image.raw');
var columns = require('./data/blocks/columns.raw');
describe('Solid', function () {
    test('Basic', function () {
        var component = (0, jsx_1.parseJsx)(basic);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Input block', function () {
        var component = (0, jsx_1.parseJsx)(inputBlock);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Submit button block', function () {
        var component = (0, jsx_1.parseJsx)(submitButtonBlock);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Select block', function () {
        var component = (0, jsx_1.parseJsx)(selectBlock);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Form block', function () {
        var component = (0, jsx_1.parseJsx)(formBlock);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Button', function () {
        var component = (0, jsx_1.parseJsx)(button);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Textarea', function () {
        var component = (0, jsx_1.parseJsx)(textarea);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Img', function () {
        var component = (0, jsx_1.parseJsx)(img);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Video', function () {
        var component = (0, jsx_1.parseJsx)(video);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Section', function () {
        var component = (0, jsx_1.parseJsx)(section);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Text', function () {
        var component = (0, jsx_1.parseJsx)(text);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('RawText', function () {
        var component = (0, jsx_1.parseJsx)(rawText);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('CustomCode', function () {
        var component = (0, jsx_1.parseJsx)(customCode);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Embed', function () {
        var component = (0, jsx_1.parseJsx)(customCode);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Image', function () {
        var component = (0, jsx_1.parseJsx)(image);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Columns', function () {
        var component = (0, jsx_1.parseJsx)(columns);
        var output = (0, stencil_1.componentToStencil)()({ component: component });
        expect(output).toMatchSnapshot();
    });
});
