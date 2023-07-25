"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var signals_1 = require("../../helpers/signals");
var typescript_project_1 = require("../../helpers/typescript-project");
var signals_2 = require("./signals");
var code = "\nimport { Signal, useState, useContext, createContext } from '@builder.io/mitosis';\n\nconst FooContext = createContext({ foo: 'bar' }, { reactive: true });\nconst NormalContext = createContext({ foo: 'bar' });\n\ntype K = Signal<string>;\n\ntype Props = {\n  k: K;\n  another: Signal<number>\n};\n    \nexport default function MyComponent(props: Props) {\n  const [n] = useState(123, { reactive: true });\n\n  const context = useContext(FooContext)\n  const normalContext = useContext(NormalContext)\n\n  console.log(\n    n, \n    n.value, \n    props.k, \n    props.k.value,\n    context,\n    context.value.foo,\n    normalContext,\n    normalContext.value.foo,\n    );\n\n  return <RenderBlock \n    a={props.k} \n    b={props.k.value} \n    c={n} \n    d={n.value} \n    e={context}\n    f={context.value.foo}\n    g={normalContext}\n    h={normalContext.value.foo}\n    />;\n};\n";
describe('Signals type parsing', function () {
    /**
     * We can piggyback on the `core` project's TS config, since we are allowed to reference `@builder.io/mitosis`
     * recursively inside of itself.
     * This avoids the need to create a mock TS project just for testing.
     */
    var tsProject = (0, typescript_project_1.createTypescriptProject)(__dirname + '/../../../tsconfig.json');
    test(signals_2.findSignals.name, function () {
        var result = (0, signals_2.findSignals)(__assign({ code: code }, tsProject));
        expect(result).toMatchSnapshot();
    });
    describe(signals_1.mapSignalType.name, function () {
        test('svelte', function () {
            var result = (0, signals_1.mapSignalType)(__assign({ target: 'svelte', code: code }, tsProject));
            expect(result).toMatchSnapshot();
        });
        test('react', function () {
            var result = (0, signals_1.mapSignalType)(__assign({ target: 'react', code: code }, tsProject));
            expect(result).toMatchSnapshot();
        });
    });
});
