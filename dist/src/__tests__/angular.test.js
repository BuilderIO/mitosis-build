"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var jsx_1 = require("../parsers/jsx");
var multipleOnUpdate = require('./data/blocks/multiple-onUpdate.raw');
var onUpdate = require('./data/blocks/onUpdate.raw');
var onMount = require('./data/blocks/onMount.raw');
var onInitonMount = require('./data/blocks/onInit-onMount.raw');
var onInit = require('./data/blocks/onInit.raw');
var basicFor = require('./data/basic-for.raw');
var basicForwardRef = require('./data/basic-forwardRef.raw');
var basicForwardRefMetadata = require('./data/basic-forwardRef-metadata.raw');
var basicRefAssignment = require('./data/basic-ref-assignment.raw');
var basicRefPrevious = require('./data/basic-ref-usePrevious.raw');
var basic = require('./data/basic.raw');
var basicRef = require('./data/basic-ref.raw');
var basicContext = require('./data/basic-context.raw');
var basicChildComponent = require('./data/basic-child-component.raw');
var basicOutputsMeta = require('./data/basic-outputs-meta.raw');
var basicOutputs = require('./data/basic-outputs.raw');
// const basicOnUpdateReturn = require('./data/basic-onUpdate-return.raw');
var contentSlotHtml = require('./data/blocks/content-slot-html.raw');
var contentSlotJsx = require('./data/blocks/content-slot-jsx.raw');
var slotJsx = require('./data/blocks/slot-jsx.raw');
var classNameJsx = require('./data/blocks/classname-jsx.raw');
var text = require('./data/blocks/text.raw');
// const slotHtml = require('./data/blocks/slot-html.raw');
describe('Angular', function () {
    test('Basic', function () {
        var component = (0, jsx_1.parseJsx)(basic);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic Ref', function () {
        var component = (0, jsx_1.parseJsx)(basicRef);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic ForwardRef', function () {
        var component = (0, jsx_1.parseJsx)(basicForwardRef);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic ForwardRef same as meta', function () {
        var component = (0, jsx_1.parseJsx)(basicForwardRef);
        var componentMeta = (0, jsx_1.parseJsx)(basicForwardRefMetadata);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        var outputMeta = (0, angular_1.componentToAngular)()({ component: componentMeta });
        expect(output).toMatch(outputMeta);
    });
    test('Basic Ref Assignment', function () {
        var component = (0, jsx_1.parseJsx)(basicRefAssignment);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic Ref Previous', function () {
        var component = (0, jsx_1.parseJsx)(basicRefPrevious);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    // test('Basic onUpdate return', () => {
    //   const component = parseJsx(basicOnUpdateReturn);
    //   const output = componentToAngular()({ component });
    //   expect(output).toMatchSnapshot();
    // });
    test('Basic Context', function () {
        var component = (0, jsx_1.parseJsx)(basicContext);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Basic Child Component', function () {
        var component = (0, jsx_1.parseJsx)(basicChildComponent);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('basic outputs meta', function () {
        var component = (0, jsx_1.parseJsx)(basicOutputsMeta);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('basic outputs', function () {
        var component = (0, jsx_1.parseJsx)(basicOutputs);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('basic outputs same as meta', function () {
        var component = (0, jsx_1.parseJsx)(basicOutputs);
        var componentMeta = (0, jsx_1.parseJsx)(basicOutputsMeta);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        var outputMeta = (0, angular_1.componentToAngular)()({ component: componentMeta });
        expect(output).toMatch(outputMeta);
    });
    test('multiple onUpdate', function () {
        var component = (0, jsx_1.parseJsx)(multipleOnUpdate);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onUpdate', function () {
        var component = (0, jsx_1.parseJsx)(onUpdate);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onMount', function () {
        var component = (0, jsx_1.parseJsx)(onMount);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onInit and onMount', function () {
        var component = (0, jsx_1.parseJsx)(onInitonMount);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onInit', function () {
        var component = (0, jsx_1.parseJsx)(onInit);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('BasicFor', function () {
        var component = (0, jsx_1.parseJsx)(basicFor);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('ng-content and Slot', function () {
        var component = (0, jsx_1.parseJsx)(contentSlotHtml);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('ng-content and Slot jsx-props', function () {
        var component = (0, jsx_1.parseJsx)(contentSlotJsx);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Slot Jsx', function () {
        var component = (0, jsx_1.parseJsx)(slotJsx);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    // test('Slot Html', () => {
    //   const component = parseJsx(slotHtml);
    //   const output = componentToAngular()({ component });
    //   expect(output).toMatchSnapshot();
    // });
    test('className to class', function () {
        var component = (0, jsx_1.parseJsx)(classNameJsx);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('Text', function () {
        var component = (0, jsx_1.parseJsx)(text);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
});
