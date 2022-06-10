"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svelte_1 = require("../generators/context/svelte");
var context_1 = require("../parsers/context");
var svelte_2 = require("../generators/svelte");
var jsx_1 = require("../parsers/jsx");
var basicOnChange = require('./data/basic-onChange.raw');
var onUpdate = require('./data/blocks/onUpdate.raw');
var multipleOUpdate = require('./data/blocks/multiple-onUpdate.raw');
var selfReferencingComponent = require('./data/blocks/self-referencing-component.raw');
var selfReferencingComponentWithChildren = require('./data/blocks/self-referencing-component-with-children.raw');
var builderRenderBlock = require('./data/blocks/builder-render-block.raw');
var rootShow = require('./data/blocks/rootShow.raw');
var simpleExample = require('./data/context/simple.context.lite');
var componentWithContext = require('./data/context/component-with-context.lite');
var renderBlock = require('./data/blocks/builder-render-block.raw');
var text = require('./data/blocks/text.raw');
describe('Svelte', function () {
    test('Basic onChange', function () {
        var component = (0, jsx_1.parseJsx)(basicOnChange);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('onUpdate', function () {
        var component = (0, jsx_1.parseJsx)(onUpdate);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('multipleOnUpdate', function () {
        var component = (0, jsx_1.parseJsx)(multipleOUpdate);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('selfReferencingComponent', function () {
        var component = (0, jsx_1.parseJsx)(selfReferencingComponent);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('selfReferencingComponentWithChildren', function () {
        var component = (0, jsx_1.parseJsx)(selfReferencingComponentWithChildren);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('BuilderRenderBlock', function () {
        var component = (0, jsx_1.parseJsx)(builderRenderBlock);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    test('rootShow', function () {
        var component = (0, jsx_1.parseJsx)(rootShow);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
    describe('Context', function () {
        test('Parse context', function () {
            var component = (0, context_1.parseContext)(simpleExample, { name: 'SimpleExample' });
            if (!component) {
                throw new Error('No parseable context found for simple.context.lite.ts');
            }
            expect(component).toMatchSnapshot();
            var context = (0, svelte_1.contextToSvelte)()({ context: component });
            expect(context).toMatchSnapshot();
        });
        test('Use and set context in components', function () {
            var component = (0, jsx_1.parseJsx)(componentWithContext);
            expect(component).toMatchSnapshot();
            var output = (0, svelte_2.componentToSvelte)()({ component: component });
            expect(output).toMatchSnapshot();
        });
        test('Use and set context in complex components', function () {
            var component = (0, jsx_1.parseJsx)(renderBlock);
            expect(component).toMatchSnapshot();
            var output = (0, svelte_2.componentToSvelte)()({ component: component });
            expect(output).toMatchSnapshot();
        });
    });
    test('Text', function () {
        var component = (0, jsx_1.parseJsx)(text);
        var output = (0, svelte_2.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
});
