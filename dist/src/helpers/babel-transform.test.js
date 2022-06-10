"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var babel_transform_1 = require("./babel-transform");
test('babelTransform', function () {
    var code = "\nconst symbol = symbol;\n\nif (symbol) {\n  getContent({\n    apiKey: builderContext.apiKey!,\n  }).then(response => {\n    content = response;\n  });\n}\n";
    expect((0, babel_transform_1.babelTransformCode)(code)).toMatchSnapshot();
});
