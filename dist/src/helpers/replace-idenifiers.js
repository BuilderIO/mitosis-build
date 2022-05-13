"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceIdentifiers = void 0;
var core_1 = require("@babel/core");
var babel_transform_1 = require("./babel-transform");
var replaceIdentifiers = function (code, from, to) {
    return (0, babel_transform_1.babelTransformExpression)(code, {
        Identifier: function (path) {
            if (
            // This is not an (optional) property access - like `foo` in `this.foo` or `this?.foo`
            !((core_1.types.isMemberExpression(path.parent) ||
                core_1.types.isOptionalMemberExpression(path.parent)) &&
                path.parent.property === path.node) &&
                // This is no the function name - like `foo` in `function foo() {}`
                !(core_1.types.isFunctionDeclaration(path.parent) &&
                    path.parent.id === path.node) &&
                (Array.isArray(from)
                    ? from.includes(path.node.name)
                    : path.node.name === from)) {
                path.replaceWith(core_1.types.identifier(typeof to === 'string' ? to : to(path.node.name)));
            }
        },
    });
};
exports.replaceIdentifiers = replaceIdentifiers;
