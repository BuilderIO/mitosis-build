"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babel/core");
var replace_identifiers_1 = require("./replace-identifiers");
var CODE_BLOCK = "\nfunction updateThing() {\n  state.thing1 = props.thing2 + 123;\n\n  state?.fn(props?.abc.foo);\n\n  const x = someRandomObj.state.foo\n  const y = someRandomObj.props.state.foo\n}\n";
var TEST_SPECS = [
    {
        from: 'props',
        to: '$SPECIAL',
        code: CODE_BLOCK,
    },
    {
        from: ['props', 'state'],
        to: null,
        code: CODE_BLOCK,
    },
    {
        from: ['props', 'state'],
        to: 'this',
        code: CODE_BLOCK,
    },
    {
        code: '!state.useLazyLoading() || load',
        from: ['scrollListener', 'imageLoaded', 'setLoaded', 'useLazyLoading', 'isBrowser', 'load'],
        to: function (name) { return "state.".concat(name); },
    },
    {
        code: "state.name = 'PatrickJS onInit' + props.hi;",
        from: ['props'],
        to: function (name) { return "this.".concat(name); },
    },
    {
        code: 'state.lowerCaseName()',
        from: 'state',
        to: function (name) { return (name === 'children' ? '$$slots.default' : name); },
    },
    {
        code: "\n    const x = {\n      foo: bar,\n      test: 123,\n    }\n\n    const foo = x.foo;\n\n    const y = {\n      l: x.foo,\n      m: foo\n    }\n\n    const bar = foo;\n    ",
        from: ['foo', 'test'],
        to: function (name) { return "".concat(name, ".value"); },
    },
];
describe('replaceIdentifiers', function () {
    TEST_SPECS.forEach(function (args, index) {
        test("Check #".concat(index), function () {
            var output = (0, replace_identifiers_1.replaceIdentifiers)(args);
            expect(output).toMatchSnapshot();
        });
    });
});
describe('newReplacer', function () {
    test('Check #1', function () {
        var code = "\n  const [childrenContext] = useState(\n    useTarget({\n      reactNative: {\n        apiKey: props.context.value.apiKey,\n        apiVersion: props.context.value.apiVersion,\n        localState: props.context.value.localState,\n        rootState: props.context.value.rootState,\n        rootSetState: props.context.value.rootSetState,\n        content: props.context.value.content,\n        context: props.context.value.context,\n        registeredComponents: props.context.value.registeredComponents,\n        inheritedStyles: extractTextStyles(\n          getReactNativeBlockStyles({\n            block: state.useBlock,\n            context: props.context.value,\n            blockStyles: state.attributes.style,\n          })\n        ),\n      },\n      default: props.context.value,\n    }),\n    { reactive: true }\n  );\n";
        var thing = core_1.types.memberExpression(core_1.types.memberExpression(core_1.types.identifier('props'), core_1.types.identifier('context')), core_1.types.identifier('value'));
        var to = core_1.types.memberExpression(core_1.types.identifier('props'), core_1.types.identifier('$context'));
        var output = (0, replace_identifiers_1.replaceNodes)({ code: code, nodeMaps: [{ from: thing, to: to }] });
        expect(output).toMatchSnapshot();
    });
});
