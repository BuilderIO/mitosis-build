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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockToReact = void 0;
var lodash_1 = require("lodash");
var html_tags_1 = require("../../constants/html_tags");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var is_children_1 = __importDefault(require("../../helpers/is-children"));
var is_root_text_node_1 = require("../../helpers/is-root-text-node");
var is_valid_attribute_name_1 = require("../../helpers/is-valid-attribute-name");
var for_1 = require("../../helpers/nodes/for");
var slots_1 = require("../../helpers/slots");
var mitosis_node_1 = require("../../types/mitosis-node");
var helpers_1 = require("./helpers");
var state_1 = require("./state");
var NODE_MAPPERS = {
    Slot: function (json, options, component, parentSlots) {
        var _a, _b;
        var slotName = ((_a = json.bindings.name) === null || _a === void 0 ? void 0 : _a.code) || json.properties.name;
        var hasChildren = json.children.length;
        var renderChildren = function () {
            var _a;
            var childrenStr = (_a = json.children) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (0, exports.blockToReact)(item, options, component); }).join('\n').trim();
            /**
             * Ad-hoc way of figuring out if the children defaultProp is:
             * - a JSX element, e.g. `<div>foo</div>`
             * - a JS expression, e.g. `true`, `false`
             * - a string, e.g. `'Default text'`
             *
             * and correctly wrapping it in quotes when appropriate.
             */
            if (childrenStr.startsWith("<") && childrenStr.endsWith(">")) {
                return childrenStr;
            }
            else if (['false', 'true', 'null', 'undefined'].includes(childrenStr)) {
                return childrenStr;
            }
            else {
                return "\"".concat(childrenStr, "\"");
            }
        };
        if (!slotName) {
            // TODO: update MitosisNode for simple code
            var key = Object.keys(json.bindings).find(Boolean);
            if (key && parentSlots) {
                var propKey = (0, lodash_1.camelCase)('Slot' + key[0].toUpperCase() + key.substring(1));
                parentSlots.push({ key: propKey, value: (_b = json.bindings[key]) === null || _b === void 0 ? void 0 : _b.code });
                return '';
            }
            var children = (0, helpers_1.processBinding)('props.children', options);
            return "{".concat(children, " ").concat(hasChildren ? "|| (".concat(renderChildren(), ")") : '', "}");
        }
        var slotProp = (0, helpers_1.processBinding)(slotName, options).replace('name=', '');
        if (!slotProp.startsWith('props.slot')) {
            slotProp = "props.slot".concat((0, lodash_1.upperFirst)((0, lodash_1.camelCase)(slotProp)));
        }
        return "{".concat(slotProp, " ").concat(hasChildren ? "|| (".concat(renderChildren(), ")") : '', "}");
    },
    Fragment: function (json, options, component) {
        var wrap = (0, helpers_1.wrapInFragment)(json);
        return "".concat(wrap ? (0, helpers_1.getFragment)('open', options) : '').concat(json.children
            .map(function (item) { return (0, exports.blockToReact)(item, options, component); })
            .join('\n')).concat(wrap ? (0, helpers_1.getFragment)('close', options) : '');
    },
    For: function (_json, options, component) {
        var _a;
        var json = _json;
        var wrap = (0, helpers_1.wrapInFragment)(json);
        var forArguments = (0, for_1.getForArguments)(json).join(', ');
        return "{".concat((0, helpers_1.processBinding)((_a = json.bindings.each) === null || _a === void 0 ? void 0 : _a.code, options), "?.map((").concat(forArguments, ") => (\n      ").concat(wrap ? (0, helpers_1.openFrag)(options) : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, exports.blockToReact)(item, options, component); })
            .join('\n')).concat(wrap ? (0, helpers_1.closeFrag)(options) : '', "\n    ))}");
    },
    Show: function (json, options, component) {
        var _a;
        var wrap = (0, helpers_1.wrapInFragment)(json) || (0, is_root_text_node_1.isRootTextNode)(json);
        var wrapElse = json.meta.else &&
            ((0, helpers_1.wrapInFragment)(json.meta.else) || (0, mitosis_node_1.checkIsForNode)(json.meta.else));
        return "{".concat((0, helpers_1.processBinding)((_a = json.bindings.when) === null || _a === void 0 ? void 0 : _a.code, options), " ? (\n      ").concat(wrap ? (0, helpers_1.openFrag)(options) : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, exports.blockToReact)(item, options, component); })
            .join('\n')).concat(wrap ? (0, helpers_1.closeFrag)(options) : '', "\n    ) : ").concat(!json.meta.else
            ? 'null'
            : (wrapElse ? (0, helpers_1.openFrag)(options) : '') +
                (0, exports.blockToReact)(json.meta.else, options, component) +
                (wrapElse ? (0, helpers_1.closeFrag)(options) : ''), "}");
    },
};
var ATTTRIBUTE_MAPPERS = {
    spellcheck: 'spellCheck',
    autocapitalize: 'autoCapitalize',
    autocomplete: 'autoComplete',
    for: 'htmlFor',
};
// TODO: Maybe in the future allow defining `string | function` as values
var BINDING_MAPPERS = __assign({ ref: function (ref, value, options) {
        if (options === null || options === void 0 ? void 0 : options.preact) {
            return [ref, value];
        }
        var regexp = /(.+)?props\.(.+)( |\)|;|\()?$/m;
        if (regexp.test(value)) {
            var match = regexp.exec(value);
            var prop = match === null || match === void 0 ? void 0 : match[2];
            if (prop) {
                return [ref, prop];
            }
        }
        return [ref, value];
    }, innerHTML: function (_key, value) {
        return ['dangerouslySetInnerHTML', "{__html: ".concat(value.replace(/\s+/g, ' '), "}")];
    } }, ATTTRIBUTE_MAPPERS);
var blockToReact = function (json, options, component, parentSlots) {
    var _a, _b, _c;
    if (NODE_MAPPERS[json.name]) {
        return NODE_MAPPERS[json.name](json, options, component, parentSlots);
    }
    if (json.properties._text) {
        var text = json.properties._text;
        if (options.type === 'native' && text.trim().length) {
            return "<Text>".concat(text, "</Text>");
        }
        return text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        var processed = (0, helpers_1.processBinding)(json.bindings._text.code, options);
        if (options.type === 'native' &&
            !(0, is_children_1.default)({ node: json }) &&
            !(0, slots_1.isSlotProperty)(json.bindings._text.code.split('.')[1] || '')) {
            return "<Text>{".concat(processed, "}</Text>");
        }
        return "{".concat(processed, "}");
    }
    var str = '';
    str += "<".concat(json.name, " ");
    for (var key in json.properties) {
        var value = (json.properties[key] || '').replace(/"/g, '&quot;').replace(/\n/g, '\\n');
        if (key === 'class') {
            str = "".concat(str.trim(), " className=\"").concat(value, "\" ");
        }
        else if (BINDING_MAPPERS[key]) {
            var mapper = BINDING_MAPPERS[key];
            if (typeof mapper === 'function') {
                var _d = mapper(key, value, options), newKey = _d[0], newValue = _d[1];
                str += " ".concat(newKey, "={").concat(newValue, "} ");
            }
            else {
                str += " ".concat(BINDING_MAPPERS[key], "=\"").concat(value, "\" ");
            }
        }
        else {
            if ((0, is_valid_attribute_name_1.isValidAttributeName)(key)) {
                str += " ".concat(key, "=\"").concat(value.replace(/"/g, '&quot;'), "\" ");
            }
        }
    }
    for (var key in json.bindings) {
        var value = String((_b = json.bindings[key]) === null || _b === void 0 ? void 0 : _b.code);
        if (key === 'css' && value.trim() === '{}') {
            continue;
        }
        var useBindingValue = (0, helpers_1.processBinding)(value, options);
        if (((_c = json.bindings[key]) === null || _c === void 0 ? void 0 : _c.type) === 'spread') {
            str += " {...(".concat(value, ")} ");
        }
        else if (key.startsWith('on')) {
            var _e = json.bindings[key].arguments, cusArgs = _e === void 0 ? ['event'] : _e;
            str += " ".concat(key, "={(").concat(cusArgs.join(','), ") => ").concat((0, state_1.updateStateSettersInCode)(useBindingValue, options), " } ");
        }
        else if (key.startsWith('slot')) {
            // <Component slotProjected={<AnotherComponent />} />
            str += " ".concat(key, "={").concat(value, "} ");
        }
        else if (key === 'class') {
            str += " className={".concat(useBindingValue, "} ");
        }
        else if (BINDING_MAPPERS[key]) {
            var mapper = BINDING_MAPPERS[key];
            if (typeof mapper === 'function') {
                var _f = mapper(key, useBindingValue, options), newKey = _f[0], newValue = _f[1];
                str += " ".concat(newKey, "={").concat(newValue, "} ");
            }
            else {
                str += " ".concat(BINDING_MAPPERS[key], "={").concat(useBindingValue, "} ");
            }
        }
        else if (key === 'style' && options.type === 'native' && json.name === 'ScrollView') {
            // React Native's ScrollView has a different prop for styles: `contentContainerStyle`
            str += " contentContainerStyle={".concat(useBindingValue, "} ");
        }
        else {
            if ((0, is_valid_attribute_name_1.isValidAttributeName)(key)) {
                str += " ".concat(key, "={").concat(useBindingValue, "} ");
            }
        }
    }
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
        return str + ' />';
    }
    // Self close by default if no children
    if (!json.children.length) {
        str += ' />';
        return str;
    }
    // TODO: update MitosisNode for simple code
    var needsToRenderSlots = [];
    var childrenNodes = '';
    if (json.children) {
        childrenNodes = json.children
            .map(function (item) { return (0, exports.blockToReact)(item, options, component, needsToRenderSlots); })
            .join('\n');
    }
    if (needsToRenderSlots.length) {
        needsToRenderSlots.forEach(function (_a) {
            var key = _a.key, value = _a.value;
            str += " ".concat(key, "={").concat(value, "} ");
        });
    }
    str = str.trim() + '>';
    if (json.children) {
        str += childrenNodes;
    }
    return str + "</".concat(json.name, ">");
};
exports.blockToReact = blockToReact;
