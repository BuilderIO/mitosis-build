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
exports.parseElement = void 0;
var astring_1 = require("astring");
var lodash_1 = require("lodash");
var children_1 = require("../helpers/children");
var mitosis_node_1 = require("../helpers/mitosis-node");
var string_1 = require("../helpers/string");
var actions_1 = require("./actions");
var bindings_1 = require("../../../helpers/bindings");
var SPECIAL_ELEMENTS = new Set(['svelte:component', 'svelte:element']);
function parseElement(json, node) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var mitosisNode = (0, mitosis_node_1.createMitosisNode)();
    mitosisNode.name = node.name;
    var useReference = function () {
        var nodeReference = (0, string_1.uniqueName)(Object.keys(json.refs), node.name);
        if (!Object.keys(json.refs).includes(nodeReference)) {
            json.refs[nodeReference] = { argument: '', typeParameter: '' };
            mitosisNode.bindings.ref = (0, bindings_1.createSingleBinding)({ code: nodeReference });
        }
        return nodeReference;
    };
    /*
      Parse special elements such as svelte:component and svelte:element
    */
    if (SPECIAL_ELEMENTS.has(node.name)) {
        var expression = (0, astring_1.generate)(node.expression || node.tag);
        var prefix = 'state';
        if (json.props[expression]) {
            prefix = 'props';
        }
        mitosisNode.name = "".concat(prefix, ".").concat(expression);
    }
    if ((_b = node.attributes) === null || _b === void 0 ? void 0 : _b.length) {
        for (var _i = 0, _v = node.attributes; _i < _v.length; _i++) {
            var attribute = _v[_i];
            switch (attribute.type) {
                case 'Attribute': {
                    switch ((_c = attribute.value[0]) === null || _c === void 0 ? void 0 : _c.type) {
                        case 'Text': {
                            var value = attribute.value[0];
                            // if there are already conditional class declarations
                            // add class names defined here to the bindings code as well
                            if (attribute.name === 'class' && ((_e = (_d = mitosisNode.bindings.class) === null || _d === void 0 ? void 0 : _d.code) === null || _e === void 0 ? void 0 : _e.length)) {
                                mitosisNode.bindings.class.code = (0, string_1.insertAt)(mitosisNode.bindings.class.code, " ".concat(value.data, " "), 1);
                            }
                            else {
                                mitosisNode.properties[attribute.name] = value.data;
                            }
                            break;
                        }
                        case 'MustacheTag': {
                            var value = attribute.value[0];
                            var expression = value.expression;
                            var code = (0, astring_1.generate)(expression);
                            if (attribute.name === 'class') {
                                code = ((_g = (_f = mitosisNode.bindings.class) === null || _f === void 0 ? void 0 : _f.code) === null || _g === void 0 ? void 0 : _g.length)
                                    ? (0, string_1.insertAt)(mitosisNode.bindings.class.code, ' ${' + code + '}', mitosisNode.bindings.class.code.length - 1)
                                    : '`${' + code + '}`';
                            }
                            mitosisNode.bindings[attribute.name] = (0, bindings_1.createSingleBinding)({ code: code });
                            break;
                        }
                        case 'AttributeShorthand': {
                            // e.g. <input {value}/>
                            var value = attribute.value[0];
                            var code = value.expression.name;
                            mitosisNode.bindings[code] = (0, bindings_1.createSingleBinding)({ code: code });
                            break;
                        }
                        default: {
                            var name_1 = attribute.name;
                            mitosisNode.bindings[name_1] = (0, bindings_1.createSingleBinding)({
                                code: attribute.value.toString(),
                            });
                        }
                    }
                    break;
                }
                case 'Spread': {
                    var expression = attribute.expression;
                    mitosisNode.bindings[expression.name] = {
                        code: expression.name,
                        type: 'spread',
                        spreadType: 'normal',
                    };
                    break;
                }
                case 'EventHandler': {
                    var object = {
                        code: '',
                        arguments: [],
                    };
                    if (((_h = attribute.expression) === null || _h === void 0 ? void 0 : _h.type) === 'ArrowTypeFunction') {
                        var expression = attribute.expression;
                        var code = (0, astring_1.generate)(expression.body);
                        object = {
                            code: code,
                            arguments: (_k = (_j = expression.body) === null || _j === void 0 ? void 0 : _j.arguments) === null || _k === void 0 ? void 0 : _k.map(function (a) { var _a; return (_a = a.name) !== null && _a !== void 0 ? _a : []; }),
                        };
                    }
                    else if (attribute.expression) {
                        var code = (0, astring_1.generate)(attribute.expression);
                        if (((_l = attribute.expression.body) === null || _l === void 0 ? void 0 : _l.type) === 'CallExpression') {
                            code = (0, astring_1.generate)(attribute.expression.body);
                        }
                        if (!code.startsWith(')') && !code.endsWith(')')) {
                            code += '()';
                        }
                        if (!((_m = attribute.expression.arguments) === null || _m === void 0 ? void 0 : _m.length) &&
                            !((_p = (_o = attribute.expression.body) === null || _o === void 0 ? void 0 : _o.arguments) === null || _p === void 0 ? void 0 : _p.length)) {
                            code = code.replace(/\(\)/g, '(event)');
                        }
                        var args = undefined;
                        if (attribute.expression.type === 'ArrowFunctionExpression') {
                            args = (_r = (_q = attribute.expression.params) === null || _q === void 0 ? void 0 : _q.map(function (arg) { return (0, astring_1.generate)(arg); })) !== null && _r !== void 0 ? _r : [];
                        }
                        else if (attribute.expression.type === 'CallExpression' &&
                            attribute.expression.arguments.length) {
                            args = [];
                        }
                        object = {
                            code: code,
                            arguments: args,
                        };
                    }
                    else {
                        object = {
                            code: "props.on".concat((0, lodash_1.upperFirst)(attribute.name), "(event)"),
                            arguments: ['event'],
                        };
                    }
                    mitosisNode.bindings["on".concat((0, lodash_1.upperFirst)(attribute.name))] = (0, bindings_1.createSingleBinding)(object);
                    // add event handlers as props (e.g. props.onClick)
                    json.props = __assign(__assign({}, json.props), (_a = {}, _a["on".concat((0, lodash_1.upperFirst)(attribute.name))] = { default: function () { return ({}); } }, _a));
                    break;
                }
                case 'Binding': {
                    /*
                      adding onChange handlers for bind:group and bind:property is done during post processing
                      same goes for replacing the group binding with checked
                      see helpers/post-process.ts
                    */
                    var expression = attribute.expression;
                    var binding = expression.name;
                    var name_2 = attribute.name;
                    // template ref
                    if (attribute.name === 'this') {
                        name_2 = 'ref';
                        json.refs[binding] = {
                            argument: 'null',
                            typeParameter: 'any',
                        };
                        if (Object.prototype.hasOwnProperty.call(json.state, binding)) {
                            delete json.state[binding];
                        }
                    }
                    if (name_2 !== 'ref' && name_2 !== 'group' && name_2 !== 'this') {
                        var onChangeCode = "".concat(binding, " = event.target.value");
                        mitosisNode.bindings['onChange'] = (0, bindings_1.createSingleBinding)({
                            code: onChangeCode,
                            arguments: ['event'],
                        });
                    }
                    mitosisNode.bindings[name_2] = (0, bindings_1.createSingleBinding)({
                        code: binding,
                    });
                    break;
                }
                case 'Class': {
                    var expression = attribute.expression;
                    // conditional classes (e.g. class:disabled or class:disabled={disabled})
                    var binding = "".concat((0, astring_1.generate)(expression), " ? '").concat(attribute.name, "'  : ''");
                    var code = '';
                    // if there are existing class declarations
                    // add them here instead and remove them from properties
                    // to avoid duplicate class declarations in certain frameworks
                    if ((_t = (_s = mitosisNode.properties) === null || _s === void 0 ? void 0 : _s.class) === null || _t === void 0 ? void 0 : _t.length) {
                        code = "".concat(mitosisNode.properties.class, " ");
                        delete mitosisNode.properties.class;
                    }
                    // if class code is already defined (meaning there is more than 1 conditional class declaration)
                    // append it to the string instead of assigning it
                    if (mitosisNode.bindings.class &&
                        Object.prototype.hasOwnProperty.call(mitosisNode.bindings.class, 'code') &&
                        ((_u = mitosisNode.bindings.class) === null || _u === void 0 ? void 0 : _u.code.length)) {
                        code = (0, string_1.insertAt)(mitosisNode.bindings.class.code, ' ${' + binding + '}', mitosisNode.bindings.class.code.length - 1);
                        mitosisNode.bindings.class = (0, bindings_1.createSingleBinding)({ code: code });
                    }
                    else {
                        // otherwise just assign
                        code = '`' + code + '${' + binding + '}`';
                        mitosisNode.bindings.class = (0, bindings_1.createSingleBinding)({ code: code });
                    }
                    break;
                }
                case 'Action': {
                    (0, actions_1.parseAction)(json, useReference(), attribute);
                    break;
                }
                // No default
            }
        }
    }
    var filteredChildren = [];
    if (node.children) {
        filteredChildren = (0, children_1.filterChildren)(node.children);
    }
    if (filteredChildren.length === 1 && filteredChildren[0].type === 'RawMustacheTag') {
        var child = filteredChildren[0];
        mitosisNode.children = [];
        mitosisNode.bindings.innerHTML = (0, bindings_1.createSingleBinding)({
            code: (0, astring_1.generate)(child.expression),
        });
    }
    else {
        mitosisNode.children = (0, children_1.parseChildren)(json, node);
    }
    return mitosisNode;
}
exports.parseElement = parseElement;
