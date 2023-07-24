"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockToSvelte = void 0;
var html_tags_1 = require("../../constants/html_tags");
var html_tags_2 = require("../../constants/html_tags");
var bindings_1 = require("../../helpers/bindings");
var is_children_1 = __importDefault(require("../../helpers/is-children"));
var is_upper_case_1 = require("../../helpers/is-upper-case");
var for_1 = require("../../helpers/nodes/for");
var remove_surrounding_block_1 = require("../../helpers/remove-surrounding-block");
var slots_1 = require("../../helpers/slots");
var helpers_1 = require("./helpers");
/**
 * blockToSvelte executed after stripStateAndProps,
 * when stripStateAndProps is executed,
 * SLOT_PREFIX from `slot` change to `$$slots.`
 */
var SLOT_PREFIX = '$$slots.';
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
        return "\n{#each ".concat((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code, " as ").concat(args, " ").concat(keyValue ? "(".concat(keyValue, ")") : '', "}\n").concat(json.children.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n'), "\n{/each}\n");
    },
    Show: function (_a) {
        var _b;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        return "\n{#if ".concat((_b = json.bindings.when) === null || _b === void 0 ? void 0 : _b.code, " }\n").concat(json.children.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n'), "\n\n  ").concat(json.meta.else
            ? "\n  {:else}\n  ".concat((0, exports.blockToSvelte)({
                json: json.meta.else,
                options: options,
                parentComponent: parentComponent,
            }), "\n  ")
            : '', "\n{/if}");
    },
    Slot: function (_a) {
        var _b, _c, _d;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        var slotName = ((_b = json.bindings.name) === null || _b === void 0 ? void 0 : _b.code) || json.properties.name;
        var renderChildren = function () {
            var _a;
            return (_a = json.children) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n');
        };
        if (!slotName) {
            var key = Object.keys(json.bindings).find(Boolean);
            if (!key) {
                if (!((_c = json.children) === null || _c === void 0 ? void 0 : _c.length)) {
                    return '<slot/>';
                }
                return "<slot>".concat(renderChildren(), "</slot>");
            }
            return "\n        <span #".concat(key, ">\n        ").concat((_d = json.bindings[key]) === null || _d === void 0 ? void 0 : _d.code, "\n        </span>\n      ");
        }
        return "<slot name=\"".concat((0, slots_1.stripSlotPrefix)(slotName, SLOT_PREFIX).toLowerCase(), "\">").concat(renderChildren(), "</slot>");
    },
};
var BINDINGS_MAPPER = {
    innerHTML: function (json, options) { var _a; return "{@html ".concat((_a = json.bindings.innerHTML) === null || _a === void 0 ? void 0 : _a.code, "}"); },
};
var SVELTE_SPECIAL_TAGS = {
    COMPONENT: 'svelte:component',
    ELEMENT: 'svelte:element',
    SELF: 'svelte:self',
};
var getTagName = function (_a) {
    var json = _a.json, parentComponent = _a.parentComponent, options = _a.options;
    if (parentComponent && json.name === parentComponent.name) {
        return SVELTE_SPECIAL_TAGS.SELF;
    }
    /**
     * These are special HTML tags that svelte requires `<svelte:element this={TAG}>`
     */
    var SPECIAL_HTML_TAGS = ['style', 'script', 'template'];
    if (SPECIAL_HTML_TAGS.includes(json.name)) {
        json.bindings.this = (0, bindings_1.createSingleBinding)({
            code: json.name === 'style'
                ? // We have to obfuscate `"style"` due to a limitation in the svelte-preprocessor plugin.
                    // https://github.com/sveltejs/vite-plugin-svelte/issues/315#issuecomment-1109000027
                    "\"sty\" + \"le\""
                : "\"".concat(json.name, "\""),
        });
        return SVELTE_SPECIAL_TAGS.ELEMENT;
    }
    var isValidHtmlTag = html_tags_2.VALID_HTML_TAGS.includes(json.name);
    var isSpecialSvelteTag = json.name.startsWith('svelte:');
    // Check if any import matches `json.name`
    var hasMatchingImport = parentComponent.imports.some(function (_a) {
        var imports = _a.imports;
        return Object.keys(imports).some(function (name) { return name === json.name; });
    });
    // If none of these are true, then we have some type of dynamic tag name
    if (!isValidHtmlTag && !isSpecialSvelteTag && !hasMatchingImport) {
        json.bindings.this = (0, bindings_1.createSingleBinding)({
            code: (0, helpers_1.stripStateAndProps)({ json: parentComponent, options: options })(json.name),
        });
        // TO-DO: no way to perfectly decide between <svelte:component> and <svelte:element> for dynamic
        // values...need to do that through metadata overrides for now.
        return SVELTE_SPECIAL_TAGS.COMPONENT;
    }
    return json.name;
};
var stringifyBinding = function (node, options) {
    return function (_a) {
        var key = _a[0], binding = _a[1];
        if (key === 'innerHTML' || !binding) {
            return '';
        }
        var code = binding.code, _b = binding.arguments, cusArgs = _b === void 0 ? ['event'] : _b, type = binding.type;
        var isValidHtmlTag = html_tags_2.VALID_HTML_TAGS.includes(node.name);
        if (type === 'spread') {
            var spreadValue = key === 'props' ? '$$props' : code;
            return " {...".concat(spreadValue, "} ");
        }
        else if (key.startsWith('on') && isValidHtmlTag) {
            // handle html native on[event] props
            var event_1 = key.replace('on', '').toLowerCase();
            // TODO: handle quotes in event handler values
            var valueWithoutBlock = (0, remove_surrounding_block_1.removeSurroundingBlock)(code);
            if (valueWithoutBlock === key) {
                return " on:".concat(event_1, "={").concat(valueWithoutBlock, "} ");
            }
            else {
                return " on:".concat(event_1, "=\"{").concat(cusArgs.join(','), " => {").concat(valueWithoutBlock, "}}\" ");
            }
        }
        else if (key.startsWith('on')) {
            // handle on[custom event] props
            var valueWithoutBlock = (0, remove_surrounding_block_1.removeSurroundingBlock)(code);
            if (valueWithoutBlock === key) {
                return " ".concat(key, "={").concat(valueWithoutBlock, "} ");
            }
            else {
                return " ".concat(key, "={(").concat(cusArgs.join(','), ") => ").concat(valueWithoutBlock, "}");
            }
        }
        else if (key === 'ref') {
            return " bind:this={".concat(code, "} ");
        }
        else {
            return " ".concat(key, "={").concat(code, "} ");
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
    var tagName = getTagName({ json: json, parentComponent: parentComponent, options: options });
    if ((0, is_children_1.default)({ node: json, extraMatches: ['$$slots.default'] })) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    var textCode = (_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code;
    if (textCode) {
        if ((0, slots_1.isSlotProperty)(textCode, SLOT_PREFIX)) {
            return "<slot name=\"".concat((0, slots_1.stripSlotPrefix)(textCode, SLOT_PREFIX).toLowerCase(), "\"/>");
        }
        return "{".concat(textCode, "}");
    }
    var str = '';
    str += "<".concat(tagName, " ");
    var isComponent = Boolean(tagName[0] && (0, is_upper_case_1.isUpperCase)(tagName[0]));
    if ((((_c = json.bindings.style) === null || _c === void 0 ? void 0 : _c.code) || json.properties.style) && !isComponent) {
        var useValue = ((_d = json.bindings.style) === null || _d === void 0 ? void 0 : _d.code) || json.properties.style;
        str += "use:mitosis_styling={".concat(useValue, "}");
        delete json.bindings.style;
        delete json.properties.style;
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    var stringifiedBindings = Object.entries(json.bindings)
        .map(stringifyBinding(json, options))
        .join('');
    str += stringifiedBindings;
    // if we have innerHTML, it doesn't matter whether we have closing tags or not, or children or not.
    // we use the innerHTML content as children and don't render the self-closing tag.
    if ((_e = json.bindings.innerHTML) === null || _e === void 0 ? void 0 : _e.code) {
        str += '>';
        str += BINDINGS_MAPPER.innerHTML(json, options);
        str += "</".concat(tagName, ">");
        return str;
    }
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(tagName)) {
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
