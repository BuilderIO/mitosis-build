"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("../generators/context/react");
var react_2 = require("../generators/react");
var react_native_1 = require("../generators/react-native");
var context_1 = require("../parsers/context");
var jsx_1 = require("../parsers/jsx");
var builder_render_block_raw_tsx_raw_1 = __importDefault(require("./data/blocks/builder-render-block.raw.tsx?raw"));
var component_with_context_raw_tsx_raw_1 = __importDefault(require("./data/context/component-with-context.raw.tsx?raw"));
var simple_context_lite_ts_raw_1 = __importDefault(require("./data/context/simple.context.lite.ts?raw"));
describe('Context', function () {
    test('Parse context', function () {
        var component = (0, context_1.parseContext)(simple_context_lite_ts_raw_1.default, { name: 'SimpleExample' });
        if (!component) {
            throw new Error('No parseable context found for simple.context.lite.ts');
        }
        expect(component).toMatchSnapshot();
        var reactContext = (0, react_1.contextToReact)()({ context: component });
        expect(reactContext).toMatchSnapshot();
    });
    test('Use and set context in components', function () {
        var component = (0, jsx_1.parseJsx)(component_with_context_raw_tsx_raw_1.default);
        expect(component).toMatchSnapshot();
        var reactComponent = (0, react_2.componentToReact)()({ component: component });
        expect(reactComponent).toMatchSnapshot();
        var reactNativeComponent = (0, react_native_1.componentToReactNative)()({ component: component });
        expect(reactNativeComponent).toMatchSnapshot();
    });
    test('Use and set context in complex components', function () {
        var component = (0, jsx_1.parseJsx)(builder_render_block_raw_tsx_raw_1.default);
        expect(component).toMatchSnapshot();
        var reactComponent = (0, react_2.componentToReact)()({ component: component });
        expect(reactComponent).toMatchSnapshot();
    });
});
