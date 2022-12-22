"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        to: function (name) {
            console.log({ name: name });
            return "".concat(name, ".value");
        },
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
