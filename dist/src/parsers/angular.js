"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.angularToMitosisComponent = void 0;
var compiler_1 = require("@angular/compiler");
var core_1 = require("@babel/core");
var lodash_1 = require("lodash");
var typescript_1 = __importDefault(require("typescript"));
var babel_transform_1 = require("../helpers/babel-transform");
var bindings_1 = require("../helpers/bindings");
var capitalize_1 = require("../helpers/capitalize");
var create_mitosis_component_1 = require("../helpers/create-mitosis-component");
var create_mitosis_node_1 = require("../helpers/create-mitosis-node");
var getTsAST = function (code) {
    return typescript_1.default.createSourceFile('code.ts', code, typescript_1.default.ScriptTarget.Latest, true);
};
var transformBinding = function (binding, _options) {
    return (0, babel_transform_1.babelTransformCode)(binding, {
        Identifier: function (path) {
            var name = path.node.name;
            if ((core_1.types.isObjectProperty(path.parent) && path.parent.key === path.node) ||
                (core_1.types.isMemberExpression(path.parent) && path.parent.property === path.node)) {
                return;
            }
            if (!(name.startsWith('state.') || name === 'event' || name === '$event')) {
                path.replaceWith(core_1.types.identifier("state.".concat(name)));
            }
        },
    });
};
var isElement = function (node) {
    // TODO: theres got to be a better way than this
    return Array.isArray(node.attributes);
};
var isTemplate = function (node) {
    // TODO: theres got to be a better way than this
    return Array.isArray(node.templateAttrs);
};
var isText = function (node) { return typeof node.value === 'string'; };
var isBoundText = function (node) { return typeof node.value === 'object'; };
var angularTemplateNodeToMitosisNode = function (node, options) {
    if (isTemplate(node)) {
        var ngIf = node.templateAttrs.find(function (item) { return item.name === 'ngIf'; });
        if (ngIf) {
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'Show',
                bindings: {
                    when: (0, bindings_1.createSingleBinding)({
                        code: transformBinding(ngIf.value.source, options),
                    }),
                },
                children: [angularTemplateNodeToMitosisNode((0, lodash_1.omit)(node, 'templateAttrs'), options)],
            });
        }
        var ngFor = node.templateAttrs.find(function (item) { return item.name === 'ngFor'; });
        if (ngFor) {
            var value = ngFor.value.source;
            var split = value.split(/let\s|\sof\s/);
            var _let = split[0], itemName = split[1], _of = split[2], expression = split[3];
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'For',
                bindings: {
                    each: (0, bindings_1.createSingleBinding)({ code: transformBinding(expression, options) }),
                },
                scope: {
                    forName: itemName,
                },
                children: [angularTemplateNodeToMitosisNode((0, lodash_1.omit)(node, 'templateAttrs'), options)],
            });
        }
    }
    if (isElement(node)) {
        var properties = {};
        var bindings = {};
        for (var _i = 0, _a = node.inputs; _i < _a.length; _i++) {
            var input = _a[_i];
            bindings[input.name] = (0, bindings_1.createSingleBinding)({
                code: transformBinding(input.value.source, options),
            });
        }
        for (var _b = 0, _c = node.outputs; _b < _c.length; _b++) {
            var output = _c[_b];
            bindings['on' + (0, capitalize_1.capitalize)(output.name)] = (0, bindings_1.createSingleBinding)({
                code: transformBinding(output.handler
                    .source // TODO: proper reference replace
                    .replace(/\$event/g, 'event'), options),
            });
        }
        for (var _d = 0, _e = node.attributes; _d < _e.length; _d++) {
            var attribute = _e[_d];
            properties[attribute.name] = attribute.value;
        }
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: node.name,
            properties: properties,
            bindings: bindings,
            children: node.children.map(function (node) { return angularTemplateNodeToMitosisNode(node, options); }),
        });
    }
    if (isText(node)) {
        return (0, create_mitosis_node_1.createMitosisNode)({
            properties: {
                _text: node.value,
            },
        });
    }
    if (isBoundText(node)) {
        // TODO: handle the bindings
        return (0, create_mitosis_node_1.createMitosisNode)({
            properties: {
                _text: node.value.source,
            },
        });
    }
    throw new Error("Element node type {".concat(node, "} is not supported"));
};
var angularTemplateToMitosisNodes = function (template, options) {
    var ast = (0, compiler_1.parseTemplate)(template, '.');
    var blocks = ast.nodes.map(function (node) { return angularTemplateNodeToMitosisNode(node, options); });
    return blocks;
};
var parseTypescript = function (code, options) {
    var component = (0, create_mitosis_component_1.createMitosisComponent)();
    var ast = getTsAST(code);
    for (var _i = 0, _a = ast.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (typescript_1.default.isClassDeclaration(statement)) {
            var decorators = typescript_1.default.canHaveDecorators(statement) ? typescript_1.default.getDecorators(statement) : undefined;
            if (decorators) {
                for (var _b = 0, decorators_1 = decorators; _b < decorators_1.length; _b++) {
                    var decorator = decorators_1[_b];
                    // TODO: proper reference tracing
                    if (typescript_1.default.isCallExpression(decorator.expression))
                        if (typescript_1.default.isIdentifier(decorator.expression.expression) &&
                            decorator.expression.expression.text === 'Component') {
                            var firstArg = decorator.expression.arguments[0];
                            if (typescript_1.default.isObjectLiteralExpression(firstArg)) {
                                firstArg.properties.find(function (item) {
                                    if (typescript_1.default.isPropertyAssignment(item)) {
                                        if (typescript_1.default.isIdentifier(item.name) && item.name.text === 'template') {
                                            if (typescript_1.default.isTemplateLiteral(item.initializer)) {
                                                var template = item.initializer.getText().trim().slice(1, -1);
                                                component.children = angularTemplateToMitosisNodes(template, options);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                }
            }
        }
    }
    return component;
};
function angularToMitosisComponent(code, options) {
    if (options === void 0) { options = {}; }
    return parseTypescript(code, options);
}
exports.angularToMitosisComponent = angularToMitosisComponent;
