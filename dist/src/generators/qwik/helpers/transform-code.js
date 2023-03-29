"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTypeScriptToJS = void 0;
var babel_transform_1 = require("../../../helpers/babel-transform");
function convertTypeScriptToJS(code) {
    return (0, babel_transform_1.babelTransformExpression)(code, {});
}
exports.convertTypeScriptToJS = convertTypeScriptToJS;
