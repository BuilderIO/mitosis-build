"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockToSvelte = void 0;
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var jsx_1 = require("../../parsers/jsx");
var is_children_1 = __importDefault(require("../../helpers/is-children"));
var remove_surrounding_block_1 = require("../../helpers/remove-surrounding-block");
var slots_1 = require("../../helpers/slots");
var html_tags_1 = require("../../constants/html_tags");
var is_upper_case_1 = require("../../helpers/is-upper-case");
var for_1 = require("../../helpers/nodes/for");
var helpers_1 = require("./helpers");
var mappers = {
    Fragment: function (_a) {
        var _b;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        if ((_b = json.bindings.innerHTML) === null || _b === void 0 ? void 0 : _b.code) {
            return BINDINGS_MAPPER.innerHTML(json, options);
        }
        else if (json.children.length > 0) {
            return "".concat(json.children
                .map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); })
                .join('\n'));
        }
        else {
            return '';
        }
    },
    For: function (_a) {
        var _b, _c;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        var firstChild = json.children[0];
        var keyValue = firstChild.properties.key || ((_b = firstChild.bindings.key) === null || _b === void 0 ? void 0 : _b.code);
        if (keyValue) {
            // we remove extraneous prop which Svelte does not use
            delete firstChild.properties.key;
            delete firstChild.bindings.key;
        }
        var args = (0, for_1.getForArguments)(json, { excludeCollectionName: true }).join(', ');
        return "\n{#each ".concat((0, helpers_1.stripStateAndProps)((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code, options), " as ").concat(args, " ").concat(keyValue ? "(".concat(keyValue, ")") : '', "}\n").concat(json.children.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n'), "\n{/each}\n");
    },
    Show: function (_a) {
        var _b;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        return "\n{#if ".concat((0, helpers_1.stripStateAndProps)((_b = json.bindings.when) === null || _b === void 0 ? void 0 : _b.code, options), " }\n").concat(json.children.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n'), "\n\n  ").concat(json.meta.else
            ? "\n  {:else}\n  ".concat((0, exports.blockToSvelte)({
                json: json.meta.else,
                options: options,
                parentComponent: parentComponent,
            }), "\n  ")
            : '', "\n{/if}");
    },
    Slot: function (_a) {
        var _b, _c;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        if (!json.bindings.name) {
            var key = Object.keys(json.bindings).find(Boolean);
            if (!key)
                return '<slot />';
            return "\n        <span #".concat(key, ">\n        ").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_b = json.bindings[key]) === null || _b === void 0 ? void 0 : _b.code), "\n        </span>\n      ");
        }
        var strippedTextCode = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.name.code);
        return "<slot name=\"".concat((0, slots_1.stripSlotPrefix)(strippedTextCode).toLowerCase(), "\">").concat((_c = json.children) === null || _c === void 0 ? void 0 : _c.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n'), "</slot>");
    },
};
var BINDINGS_MAPPER = {
    innerHTML: function (json, options) { var _a; return "{@html ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_a = json.bindings.innerHTML) === null || _a === void 0 ? void 0 : _a.code), "}"); },
};
var SVELTE_SPECIAL_TAGS = {
    COMPONENT: 'svelte:component',
    ELEMENT: 'svelte:element',
    SELF: 'svelte:self',
};
var getTagName = function (_a) {
    var json = _a.json, parentComponent = _a.parentComponent;
    if (parentComponent && json.name === parentComponent.name) {
        return SVELTE_SPECIAL_TAGS.SELF;
    }
    var isValidHtmlTag = html_tags_1.VALID_HTML_TAGS.includes(json.name);
    var isSpecialSvelteTag = json.name.startsWith('svelte:');
    // Check if any import matches `json.name`
    var hasMatchingImport = parentComponent.imports.some(function (_a) {
        var imports = _a.imports;
        return Object.keys(imports).some(function (name) { return name === json.name; });
    });
    // TO-DO: no way to decide between <svelte:component> and <svelte:element>...need to do that through metadata
    // overrides for now
    if (!isValidHtmlTag && !isSpecialSvelteTag && !hasMatchingImport) {
        json.bindings.this = { code: json.name };
        return SVELTE_SPECIAL_TAGS.COMPONENT;
    }
    return json.name;
};
var stringifyBinding = function (options) {
    return function (_a) {
        var key = _a[0], binding = _a[1];
        if (key === 'innerHTML' || !binding) {
            return '';
        }
        var code = binding.code, _b = binding.arguments, cusArgs = _b === void 0 ? ['event'] : _b, type = binding.type;
        var useValue = (0, helpers_1.stripStateAndProps)(code, options);
        if (type === 'spread') {
            var spreadValue = key === 'props' ? '$$props' : useValue;
            return " {...".concat(spreadValue, "} ");
        }
        else if (key.startsWith('on')) {
            var event_1 = key.replace('on', '').toLowerCase();
            // TODO: handle quotes in event handler values
            var valueWithoutBlock = (0, remove_surrounding_block_1.removeSurroundingBlock)(useValue);
            if (valueWithoutBlock === key) {
                return " on:".concat(event_1, "={").concat(valueWithoutBlock, "} ");
            }
            else {
                return " on:".concat(event_1, "=\"{").concat(cusArgs.join(','), " => {").concat(valueWithoutBlock, "}}\" ");
            }
        }
        else if (key === 'ref') {
            return " bind:this={".concat(useValue, "} ");
        }
        else {
            return " ".concat(key, "={").concat(useValue, "} ");
        }
    };
};
var blockToSvelte = function (_a) {
    var _b, _c, _d, _e;
    var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
    if (mappers[json.name]) {
        return mappers[json.name]({
            json: json,
            options: options,
            parentComponent: parentComponent,
        });
    }
    var tagName = getTagName({ json: json, parentComponent: parentComponent });
    if ((0, is_children_1.default)(json)) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    var textCode = (_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code;
    if (textCode) {
        var strippedTextCode = (0, helpers_1.stripStateAndProps)(textCode, options);
        if ((0, slots_1.isSlotProperty)(strippedTextCode)) {
            return "<slot name=\"".concat((0, slots_1.stripSlotPrefix)(strippedTextCode).toLowerCase(), "\"/>");
        }
        return "{".concat(strippedTextCode, "}");
    }
    var str = '';
    str += "<".concat(tagName, " ");
    var isComponent = Boolean(tagName[0] && (0, is_upper_case_1.isUpperCase)(tagName[0]));
    if ((((_c = json.bindings.style) === null || _c === void 0 ? void 0 : _c.code) || json.properties.style) && !isComponent) {
        var useValue = (0, helpers_1.stripStateAndProps)(((_d = json.bindings.style) === null || _d === void 0 ? void 0 : _d.code) || json.properties.style, options);
        str += "use:mitosis_styling={".concat(useValue, "}");
        delete json.bindings.style;
        delete json.properties.style;
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    var stringifiedBindings = Object.entries(json.bindings).map(stringifyBinding(options)).join('');
    str += stringifiedBindings;
    // if we have innerHTML, it doesn't matter whether we have closing tags or not, or children or not.
    // we use the innerHTML content as children and don't render the self-closing tag.
    if ((_e = json.bindings.innerHTML) === null || _e === void 0 ? void 0 : _e.code) {
        str += '>';
        str += BINDINGS_MAPPER.innerHTML(json, options);
        str += "</".concat(tagName, ">");
        return str;
    }
    if (jsx_1.selfClosingTags.has(tagName)) {
        return str + ' />';
    }
    str += '>';
    if (json.children) {
        str += json.children
            .map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); })
            .join('');
    }
    str += "</".concat(tagName, ">");
    return str;
};
exports.blockToSvelte = blockToSvelte;
