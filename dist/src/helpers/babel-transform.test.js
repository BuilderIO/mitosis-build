"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var babel_transform_1 = require("./babel-transform");
var SPECS = [
    "\nconst symbol = symbol;\n\nif (symbol) {\n  getContent({\n    apiKey: builderContext.apiKey!,\n  }).then(response => {\n    content = response;\n  });\n}\n",
    "state.tortilla === 'Plain'",
    "state.tortilla = event.target.value",
];
describe('babelTransform', function () {
    SPECS.forEach(function (args, index) {
        test("Check #".concat(index), function () {
            var output = (0, babel_transform_1.babelTransformCode)(args);
            expect(output).toMatchSnapshot();
        });
    });
});
describe('babelTransformExpression', function () {
    SPECS.forEach(function (args, index) {
        test("Check #".concat(index), function () {
            var output = (0, babel_transform_1.babelTransformExpression)(args, {});
            expect(output).toMatchSnapshot();
        });
    });
});
