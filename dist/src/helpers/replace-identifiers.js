"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceIdentifiers = void 0;
var core_1 = require("@babel/core");
var generator_1 = __importDefault(require("@babel/generator"));
var function_1 = require("fp-ts/lib/function");
var babel_transform_1 = require("./babel-transform");
/**
 * Given a `to` function given by the user, figure out the best argument to provide to the `to` function.
 * This function makes a best guess based on the AST structure it's dealing with.
 */
var getToParam = function (path) {
    if (core_1.types.isMemberExpression(path.node) || core_1.types.isOptionalMemberExpression(path.node)) {
        if (core_1.types.isIdentifier(path.node.property)) {
            // if simple member expression e.g. `props.foo`, returns `foo`
            var propertyName = path.node.property.name;
            return propertyName;
        }
        else {
            // if nested member expression e.g. `props.foo.bar.baz`, returns `foo.bar.baz`
            var x = (0, generator_1.default)(path.node.property).code;
            return x;
        }
    }
    else {
        // if naked identifier e.g. `foo`, returns `foo`
        var nodeName = path.node.name;
        return nodeName;
    }
};
var _replaceIdentifiers = function (path, _a) {
    var _b, _c;
    var from = _a.from, to = _a.to;
    var memberExpressionObject = core_1.types.isIdentifier(path.node) ? path.node : path.node.object;
    var normalizedFrom = Array.isArray(from) ? from : [from];
    if (!core_1.types.isIdentifier(memberExpressionObject) ||
        ((_c = (_b = path.node) === null || _b === void 0 ? void 0 : _b._builder_meta) === null || _c === void 0 ? void 0 : _c.newlyGenerated)) {
        return;
    }
    var matchesFrom = normalizedFrom.includes(memberExpressionObject.name);
    if (matchesFrom) {
        if (to) {
            // `props.foo` to `state`, e.g. `state.foo`
            if (typeof to === 'string') {
                var cleanedIdentifier = (0, function_1.pipe)(
                // Remove trailing `.` if it exists in the user-provided string, as the dot is generated
                // by babel from the AST
                to.endsWith('.') ? to.substring(0, to.length - 1) : to, core_1.types.identifier);
                if (core_1.types.isIdentifier(path.node)) {
                    path.replaceWith(cleanedIdentifier);
                }
                else {
                    path.replaceWith(core_1.types.memberExpression(cleanedIdentifier, path.node.property));
                }
                // `props.foo` to (name) => `state.${name}.bar`, e.g. `state.foo.bar`
            }
            else {
                try {
                    var newMemberExpression = (0, function_1.pipe)(getToParam(path), to, function (expression) {
                        var _a = expression.split('.'), head = _a[0], tail = _a.slice(1);
                        return [head, tail.join('.')];
                    }, function (_a) {
                        var obj = _a[0], prop = _a[1];
                        var objIdentifier = core_1.types.identifier(obj);
                        if (prop === '') {
                            return objIdentifier;
                        }
                        else {
                            return core_1.types.memberExpression(objIdentifier, core_1.types.identifier(prop));
                        }
                    });
                    /**
                     * If both `path` and `newMemberExpression` are equal nodes, do nothing.
                     * This is to prevent infinite loops when the user-provided `to` function returns the same identifier.
                     *
                     * The infinite loop probably happens because we end up traversing the new `Identifier` node again?
                     */
                    if ((0, generator_1.default)(path.node).code === (0, generator_1.default)(newMemberExpression).code) {
                        return;
                    }
                    newMemberExpression._builder_meta = { newlyGenerated: true };
                    path.replaceWith(newMemberExpression);
                }
                catch (err) {
                    console.debug('Could not replace node.');
                    // throw err;
                }
            }
        }
        else {
            if (core_1.types.isIdentifier(path.node)) {
                console.debug("Could not replace Identifier with nothing.");
            }
            else {
                // if we're looking at a member expression, e.g. `props.foo` and no `to` was provided, then we want to strip out
                // the identifier and end up with `foo`. So we replace the member expression with just its `property` value.
                path.replaceWith(path.node.property);
            }
        }
    }
};
var replaceIdentifiers = function (_a) {
    var code = _a.code, from = _a.from, to = _a.to;
    try {
        return (0, function_1.pipe)((0, babel_transform_1.babelTransformExpression)(code, {
            MemberExpression: function (path) {
                _replaceIdentifiers(path, { from: from, to: to });
            },
            OptionalMemberExpression: function (path) {
                _replaceIdentifiers(path, { from: from, to: to });
            },
            Identifier: function (path) {
                // we only want to ignore certain identifiers:
                if (
                // (optional) member expressions are already handled in other visitors
                !core_1.types.isMemberExpression(path.parent) &&
                    !core_1.types.isOptionalMemberExpression(path.parent) &&
                    // function declaration identifiers shouldn't be transformed
                    !core_1.types.isFunctionDeclaration(path.parent)
                // variable declaration identifiers shouldn't be transformed
                // !(types.isVariableDeclarator(path.parent) && path.parent.id === path.node)
                ) {
                    _replaceIdentifiers(path, { from: from, to: to });
                }
            },
        }), 
        // merely running `babel.transform` will add spaces around the code, even if we don't end up replacing anything.
        // we have some other code downstream that cannot have untrimmed spaces, so we need to trim the output.
        function (code) { return code.trim(); });
    }
    catch (err) {
        // console.error('could not replace identifiers for ', {
        //   code,
        //   from: from.toString(),
        //   to: to?.toString(),
        // });
        throw err;
    }
};
exports.replaceIdentifiers = replaceIdentifiers;
