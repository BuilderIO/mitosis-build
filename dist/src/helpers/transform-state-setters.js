"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformStateSetters = void 0;
var core_1 = require("@babel/core");
var babel_transform_1 = require("./babel-transform");
/**
 * Finds instances of state being set in `value`, and transforms them using the
 * provided `transformer`.
 */
var transformStateSetters = function (_a) {
    var value = _a.value, transformer = _a.transformer;
    return (0, babel_transform_1.babelTransformExpression)(value, {
        AssignmentExpression: function (path) {
            var node = path.node;
            if (core_1.types.isMemberExpression(node.left) &&
                core_1.types.isIdentifier(node.left.object) &&
                // TODO: utillity to properly trace this reference to the beginning
                node.left.object.name === 'state') {
                // TODO: ultimately support other property access like strings
                var propertyName = node.left.property.name;
                var newExpression = transformer({ path: path, propertyName: propertyName });
                path.replaceWith(newExpression);
            }
        },
    });
};
exports.transformStateSetters = transformStateSetters;
