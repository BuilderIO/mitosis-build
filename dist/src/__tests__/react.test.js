"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("../generators/react");
var jsx_1 = require("../parsers/jsx");
var basic = require('./data/basic.raw');
var basicMitosis = require('./data/basic-custom-mitosis-package.raw');
var basicChildComponent = require('./data/basic-child-component.raw');
var basicFor = require('./data/basic-for.raw');
var basicRef = require('./data/basic-ref.raw');
var basicForwardRef = require('./data/basic-forwardRef.raw');
var basicForwardRefMetadata = require('./data/basic-forwardRef-metadata.raw');
var basicRefPrevious = require('./data/basic-ref-usePrevious.raw');
var basicRefAssignment = require('./data/basic-ref-assignment.raw');
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
var stamped = require('./data/blocks/stamped-io.raw');
var customCode = require('./data/blocks/custom-code.raw');
var embed = require('./data/blocks/embed.raw');
var image = require('./data/blocks/image.raw');
var columns = require('./data/blocks/columns.raw');
var onUpdate = require('./data/blocks/onUpdate.raw');
var onInit = require('./data/blocks/onInit.raw');
var onUpdateWithDeps = require('./data/blocks/onUpdateWithDeps.raw');
var multipleOnUpdate = require('./data/blocks/multiple-onUpdate.raw');
var multipleOnUpdateWithDeps = require('./data/blocks/multiple-onUpdateWithDeps.raw');
var onMount = require('./data/blocks/onMount.raw');
var rootShow = require('./data/blocks/rootShow.raw');
var contentSlotHtml = require('./data/blocks/content-slot-html.raw');
var contentSlotJsx = require('./data/blocks/content-slot-jsx.raw');
var slotJsx = require('./data/blocks/slot-jsx.raw');
var slotHtml = require('./data/blocks/slot-html.raw');
var propsType = require('./data/types/component-props-type.raw');
var propsInterface = require('./data/types/component-props-interface.raw');
var preserveTyping = require('./data/types/preserve-typing.raw');
describe('React', function () {
    test('Remove Internal mitosis package', function () {
        var component = (0, jsx_1.parseJsx)(basicMitosis, {
            compileAwayPackages: ['@dummy/custom-mitosis'],
        });
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('ContentSlotJSX', function () {
        var component = (0, jsx_1.parseJsx)(contentSlotJsx);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('ContentSlotHtml', function () {
        var component = (0, jsx_1.parseJsx)(contentSlotHtml);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('SlotJsx', function () {
        var component = (0, jsx_1.parseJsx)(slotJsx);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('SlotHtml', function () {
        var component = (0, jsx_1.parseJsx)(slotHtml);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic', function () {
        var component = (0, jsx_1.parseJsx)(basic);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic Ref', function () {
        var component = (0, jsx_1.parseJsx)(basicRef);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic ForwardRef', function () {
        var component = (0, jsx_1.parseJsx)(basicForwardRef);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic ForwardRef same as meta', function () {
        var component = (0, jsx_1.parseJsx)(basicForwardRef);
        var componentMeta = (0, jsx_1.parseJsx)(basicForwardRefMetadata);
        var output = (0, react_1.componentToReact)()({ component: component });
        var outputMeta = (0, react_1.componentToReact)()({ component: componentMeta });
        expect(output).toMatch(outputMeta);
    });
    test('Basic Ref Previous', function () {
        var component = (0, jsx_1.parseJsx)(basicRefPrevious);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic Ref Assignment', function () {
        var component = (0, jsx_1.parseJsx)(basicRefAssignment);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic Child Component', function () {
        var component = (0, jsx_1.parseJsx)(basicChildComponent);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('BasicFor', function () {
        var component = (0, jsx_1.parseJsx)(basicFor);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Input block', function () {
        var component = (0, jsx_1.parseJsx)(inputBlock);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Submit button block', function () {
        var component = (0, jsx_1.parseJsx)(submitButtonBlock);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Select block', function () {
        var component = (0, jsx_1.parseJsx)(selectBlock);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Form block', function () {
        var component = (0, jsx_1.parseJsx)(formBlock);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Button', function () {
        var component = (0, jsx_1.parseJsx)(button);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Textarea', function () {
        var component = (0, jsx_1.parseJsx)(textarea);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Img', function () {
        var component = (0, jsx_1.parseJsx)(img);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Video', function () {
        var component = (0, jsx_1.parseJsx)(video);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Section', function () {
        var component = (0, jsx_1.parseJsx)(section);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Text', function () {
        var component = (0, jsx_1.parseJsx)(text);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('RawText', function () {
        var component = (0, jsx_1.parseJsx)(rawText);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Stamped.io', function () {
        var component = (0, jsx_1.parseJsx)(stamped);
        var output = (0, react_1.componentToReact)({
            stylesType: 'styled-components',
            stateType: 'useState',
        })({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('CustomCode', function () {
        var component = (0, jsx_1.parseJsx)(customCode);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Embed', function () {
        var component = (0, jsx_1.parseJsx)(customCode);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Image', function () {
        var component = (0, jsx_1.parseJsx)(image);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Columns', function () {
        var component = (0, jsx_1.parseJsx)(columns);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onUpdate', function () {
        var component = (0, jsx_1.parseJsx)(onUpdate);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onInit', function () {
        var component = (0, jsx_1.parseJsx)(onInit);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onUpdateWithDeps', function () {
        var component = (0, jsx_1.parseJsx)(onUpdateWithDeps);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('multipleOnUpdate', function () {
        var component = (0, jsx_1.parseJsx)(multipleOnUpdate);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('multipleOnnUpdateWithDeps', function () {
        var component = (0, jsx_1.parseJsx)(multipleOnUpdateWithDeps);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onMount & onUnMount', function () {
        var component = (0, jsx_1.parseJsx)(onMount);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('rootShow', function () {
        var component = (0, jsx_1.parseJsx)(rootShow);
        var output = (0, react_1.componentToReact)({ prettier: false })({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('propsType', function () {
        var component = (0, jsx_1.parseJsx)(propsType);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('propsInterface', function () {
        var component = (0, jsx_1.parseJsx)(propsInterface);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('preserveTyping', function () {
        var component = (0, jsx_1.parseJsx)(preserveTyping);
        var output = (0, react_1.componentToReact)()({ component: component });
        expect(output).toMatchSnapshot();
    });
});
