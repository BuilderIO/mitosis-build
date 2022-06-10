"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = require("../generators/html");
var jsx_1 = require("../parsers/jsx");
var basic = require('./data/basic.raw');
var basicFor = require('./data/basic-for.raw');
var className = require('./data/blocks/classname-jsx.raw');
var submitButtonBlock = require('./data/blocks/submit-button.raw');
var inputBlock = require('./data/blocks/input.raw');
var selectBlock = require('./data/blocks/select.raw');
// const formBlock = require('./data/blocks/form.raw');
var button = require('./data/blocks/button.raw');
var textarea = require('./data/blocks/textarea.raw');
var img = require('./data/blocks/img.raw');
var video = require('./data/blocks/video.raw');
var section = require('./data/blocks/section.raw');
var sectionState = require('./data/blocks/section-state.raw');
var text = require('./data/blocks/text.raw');
var image = require('./data/blocks/image.raw');
var imageState = require('./data/blocks/img-state.raw');
var columns = require('./data/blocks/columns.raw');
var onUpdate = require('./data/blocks/onUpdate.raw');
var onUpdateWithDeps = require('./data/blocks/onUpdateWithDeps.raw');
var multipleOnUpdate = require('./data/blocks/multiple-onUpdate.raw');
var multipleOnUpdateWithDeps = require('./data/blocks/multiple-onUpdateWithDeps.raw');
var onMount = require('./data/blocks/onMount.raw');
var stamped = require('./data/blocks/stamped-io.raw');
var shadowDom = require('./data/blocks/shadow-dom.raw');
describe('Html', function () {
    test('className', function () {
        var component = (0, jsx_1.parseJsx)(className);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic', function () {
        var component = (0, jsx_1.parseJsx)(basic);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('BasicFor', function () {
        var component = (0, jsx_1.parseJsx)(basicFor);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Input block', function () {
        var component = (0, jsx_1.parseJsx)(inputBlock);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Submit button block', function () {
        var component = (0, jsx_1.parseJsx)(submitButtonBlock);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Select block', function () {
        var component = (0, jsx_1.parseJsx)(selectBlock);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    // test('Form block', () => {
    //   const component = parseJsx(formBlock);
    //   const output = componentToHtml()({ component });
    //   expect(output).toMatchSnapshot();
    // });
    test('Button', function () {
        var component = (0, jsx_1.parseJsx)(button);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Textarea', function () {
        var component = (0, jsx_1.parseJsx)(textarea);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Img', function () {
        var component = (0, jsx_1.parseJsx)(img);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('ImageState', function () {
        var component = (0, jsx_1.parseJsx)(imageState);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Video', function () {
        var component = (0, jsx_1.parseJsx)(video);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Section', function () {
        var component = (0, jsx_1.parseJsx)(section);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('SectionState', function () {
        var component = (0, jsx_1.parseJsx)(sectionState);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Text', function () {
        var component = (0, jsx_1.parseJsx)(text);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Image', function () {
        var component = (0, jsx_1.parseJsx)(image);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Columns', function () {
        var component = (0, jsx_1.parseJsx)(columns);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onUpdate', function () {
        var component = (0, jsx_1.parseJsx)(onUpdate);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onUpdateWithDeps', function () {
        var component = (0, jsx_1.parseJsx)(onUpdateWithDeps);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('multipleOnUpdate', function () {
        var component = (0, jsx_1.parseJsx)(multipleOnUpdate);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('multipleOnnUpdateWithDeps', function () {
        var component = (0, jsx_1.parseJsx)(multipleOnUpdateWithDeps);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onMount & onUnMount', function () {
        var component = (0, jsx_1.parseJsx)(onMount);
        var output = (0, html_1.componentToHtml)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Stamped', function () {
        var component = (0, jsx_1.parseJsx)(stamped);
        var html = (0, html_1.componentToHtml)()({ component: component });
        expect(html).toMatchSnapshot();
    });
    test('Shadow DOM', function () {
        var component = (0, jsx_1.parseJsx)(shadowDom);
        var html = (0, html_1.componentToHtml)()({ component: component });
        expect(html).toMatchSnapshot();
    });
});
