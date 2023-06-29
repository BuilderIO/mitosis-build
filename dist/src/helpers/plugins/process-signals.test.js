"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babel/core");
var capitalize_1 = require("../capitalize");
var process_signals_1 = require("./process-signals");
describe(process_signals_1.replaceSignalSetters.name, function () {
    test('should replace signal setters', function () {
        var code = "\n    props.builderContextSignal.value.content = {\n      ...builderContextSignal.content,\n      ...newContent,\n      data: {     \n        ...builderContextSignal.content?.data, \n        ...newContent?.data },\n        meta: {\n          ...builderContextSignal.content?.meta,\n          ...newContent?.meta,\n          breakpoints:\n          newContent?.meta?.breakpoints ||\n          builderContextSignal.content?.meta?.breakpoints,\n        }\n        };\n        \n    builderContextSignal.value.rootState = newRootState;\n    ";
        var propName = 'builderContextSignal';
        var output = (0, process_signals_1.replaceSignalSetters)({
            code: code,
            nodeMaps: [
                {
                    from: core_1.types.memberExpression(core_1.types.memberExpression(core_1.types.identifier('props'), core_1.types.identifier(propName)), core_1.types.identifier('value')),
                    setTo: core_1.types.memberExpression(core_1.types.identifier('props'), core_1.types.identifier('set' + (0, capitalize_1.capitalize)(propName))),
                },
                {
                    from: core_1.types.memberExpression(core_1.types.identifier(propName), core_1.types.identifier('value')),
                    setTo: core_1.types.identifier('set' + (0, capitalize_1.capitalize)(propName)),
                },
            ],
        });
        expect(output).toMatchSnapshot();
    });
});
