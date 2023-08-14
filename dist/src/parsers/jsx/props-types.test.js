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
var typescript_project_1 = require("../../helpers/typescript-project");
var props_types_1 = require("./props-types");
describe(props_types_1.findOptionalProps.name, function () {
    /**
     * We can piggyback on the `core` project's TS config, since we are allowed to reference `@builder.io/mitosis`
     * recursively inside of itself.
     * This avoids the need to create a mock TS project just for testing.
     */
    var tsProject = (0, typescript_project_1.createTypescriptProject)(__dirname + '/../../../tsconfig.json');
    test('types', function () {
        var code = "\n    type Kaboom = {\n      foo?: string\n    }\n    \n    type Props = Kaboom & {\n      normal: string;\n      bar: boolean\n      id?: number;\n    }\n    \n    export default function InlinedStyles(props: Props) {\n      return props;\n    }\n    ";
        tsProject.project.createSourceFile('src/testing.tsx', code, { overwrite: true });
        var result = (0, props_types_1.findOptionalProps)(__assign({ filePath: 'src/testing.tsx' }, tsProject));
        expect(result).toMatchSnapshot();
    });
    test('interfaces', function () {
        var code = "\n    type Kaboom = {\n      foo?: string\n    }\n    \n    interface Props extends Kaboom {\n      styles: string;\n      id?: string;\n    }\n    \n    export default function InlinedStyles(props: Props) {\n      return props;\n    }\n    ";
        tsProject.project.createSourceFile('src/testing.tsx', code, { overwrite: true });
        var result = (0, props_types_1.findOptionalProps)(__assign({ filePath: 'src/testing.tsx' }, tsProject));
        expect(result).toMatchSnapshot();
    });
    test('type extending interface', function () {
        var code = "\n    interface Kaboom {\n      foo?: string\n    }\n    \n    type Props = Kaboom & {\n      styles: string;\n      id?: string;\n    }\n    \n    export default function InlinedStyles(props: Props) {\n      return props;\n    }\n    ";
        tsProject.project.createSourceFile('src/testing.tsx', code, { overwrite: true });
        var result = (0, props_types_1.findOptionalProps)(__assign({ filePath: 'src/testing.tsx' }, tsProject));
        expect(result).toMatchSnapshot();
    });
});
