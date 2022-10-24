"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceIdentifiers = void 0;
var core_1 = require("@babel/core");
var babel_transform_1 = require("./babel-transform");
var checkShouldReplaceIdentifier = function (path) {
    // Identifier should not be an (optional) property access - like `foo` in `this.foo` or `this?.foo`
    var isPropertyAccess = (core_1.types.isMemberExpression(path.parent) || core_1.types.isOptionalMemberExpression(path.parent)) &&
        path.parent.property === path.node;
    if (isPropertyAccess) {
        return false;
    }
    // Identifier should not be a function name - like `foo` in `function foo() {}`
    var isFunctionName = core_1.types.isFunctionDeclaration(path.parent) && path.parent.id === path.node;
    if (isFunctionName) {
        return false;
    }
    return true;
};
var replaceIdentifiers = function (_a) {
    var code = _a.code, from = _a.from, to = _a.to;
    return (0, babel_transform_1.babelTransformExpression)(code, {
        Identifier: function (path) {
            var matchesFrom = Array.isArray(from)
                ? from.includes(path.node.name)
                : path.node.name === from;
            if (checkShouldReplaceIdentifier(path) && matchesFrom) {
                path.replaceWith(core_1.types.identifier(typeof to === 'string' ? to : to(path.node.name)));
            }
        },
    });
};
exports.replaceIdentifiers = replaceIdentifiers;
