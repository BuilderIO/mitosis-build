"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_1 = require("../parsers/jsx");
var react_1 = require("../generators/context/react");
var context_1 = require("../parsers/context");
var react_2 = require("../generators/react");
var react_native_1 = require("../generators/react-native");
var simpleExample = require('./data/context/simple.context.lite');
var componentWithContext = require('./data/context/component-with-context.lite');
var renderBlock = require('./data/blocks/builder-render-block.raw');
describe('Context', function () {
    test('Parse context', function () {
        var component = (0, context_1.parseContext)(simpleExample, { name: 'SimpleExample' });
        if (!component) {
            throw new Error('No parseable context found for simple.context.lite.ts');
        }
        expect(component).toMatchSnapshot();
        var reactContext = (0, react_1.contextToReact)()({ context: component });
        expect(reactContext).toMatchSnapshot();
    });
    test('Use and set context in components', function () {
        var component = (0, jsx_1.parseJsx)(componentWithContext);
        expect(component).toMatchSnapshot();
        var reactComponent = (0, react_2.componentToReact)()({ component: component });
        expect(reactComponent).toMatchSnapshot();
        var reactNativeComponent = (0, react_native_1.componentToReactNative)()({ component: component });
        expect(reactNativeComponent).toMatchSnapshot();
    });
    test('Use and set context in complex components', function () {
        var component = (0, jsx_1.parseJsx)(renderBlock);
        expect(component).toMatchSnapshot();
        var reactComponent = (0, react_2.componentToReact)()({ component: component });
        expect(reactComponent).toMatchSnapshot();
    });
});
