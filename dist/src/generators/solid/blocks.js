"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockToSolid = void 0;
var core_1 = require("@babel/core");
var lodash_1 = require("lodash");
var html_tags_1 = require("../../constants/html_tags");
var babel_transform_1 = require("../../helpers/babel-transform");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var typescript_1 = require("../../helpers/typescript");
var mitosis_node_1 = require("../../types/mitosis-node");
var styles_1 = require("./helpers/styles");
var ATTTRIBUTE_MAPPERS = {
    for: 'htmlFor',
};
var transformAttributeName = function (name) {
    if ((0, typescript_1.objectHasKey)(ATTTRIBUTE_MAPPERS, name))
        return ATTTRIBUTE_MAPPERS[name];
    return name;
};
var blockToSolid = function (_a) {
    var _b, _c;
    var json = _a.json, options = _a.options, component = _a.component;
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code) {
        return "{".concat(json.bindings._text.code, "}");
    }
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        var needsWrapper = json.children.length !== 1;
        // The SolidJS `<For>` component has a special index() signal function.
        // https://www.solidjs.com/docs/latest#%3Cfor%3E
        return "<For each={".concat((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code, "}>\n    {(").concat(json.scope.forName, ", _index) => {\n      const ").concat(json.scope.indexName || 'index', " = _index();\n      return ").concat(needsWrapper ? '<>' : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (child) { return (0, exports.blockToSolid)({ component: component, json: child, options: options }); }), "}}\n      ").concat(needsWrapper ? '</>' : '', "\n    </For>");
    }
    var str = '';
    if (json.name === 'Fragment') {
        str += '<';
    }
    else {
        str += "<".concat(json.name, " ");
    }
    if (json.name === 'Show' && json.meta.else) {
        str += "fallback={".concat((0, exports.blockToSolid)({ component: component, json: json.meta.else, options: options }), "}");
    }
    var classString = (0, styles_1.collectClassString)(json, options);
    if (classString) {
        str += " class=".concat(classString, " ");
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        var newKey = transformAttributeName(key);
        str += " ".concat(newKey, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        var _d = json.bindings[key], code = _d.code, _e = _d.arguments, cusArg = _e === void 0 ? ['event'] : _e, type = _d.type;
        if (!code)
            continue;
        if (type === 'spread') {
            str += " {...(".concat(code, ")} ");
        }
        else if (key.startsWith('on')) {
            var useKey = key === 'onChange' && json.name === 'input' ? 'onInput' : key;
            str += " ".concat(useKey, "={(").concat(cusArg.join(','), ") => ").concat(code, "} ");
        }
        else if (key === 'ref' && options.typescript) {
            str += " ".concat(key, "={").concat(code, "!} ");
        }
        else {
            var useValue = code;
            if (key === 'style') {
                // Convert camelCase keys to kebab-case
                // TODO: support more than top level objects, may need
                // a runtime helper for expressions that are not a direct
                // object literal, such as ternaries and other expression
                // types
                useValue = (0, babel_transform_1.babelTransformExpression)(code, {
                    ObjectExpression: function (path) {
                        // TODO: limit to top level objects only
                        for (var _i = 0, _a = path.node.properties; _i < _a.length; _i++) {
                            var property = _a[_i];
                            if (core_1.types.isObjectProperty(property)) {
                                if (core_1.types.isIdentifier(property.key) || core_1.types.isStringLiteral(property.key)) {
                                    var key_1 = core_1.types.isIdentifier(property.key)
                                        ? property.key.name
                                        : property.key.value;
                                    property.key = core_1.types.stringLiteral((0, lodash_1.kebabCase)(key_1));
                                }
                            }
                        }
                    },
                });
            }
            var newKey = transformAttributeName(key);
            str += " ".concat(newKey, "={").concat(useValue, "} ");
        }
    }
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
        return str + ' />';
    }
    str += '>';
    if (json.children) {
        str += json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, exports.blockToSolid)({ component: component, json: item, options: options }); })
            .join('\n');
    }
    if (json.name === 'Fragment') {
        str += '</>';
    }
    else {
        str += "</".concat(json.name, ">");
    }
    return str;
};
exports.blockToSolid = blockToSolid;
