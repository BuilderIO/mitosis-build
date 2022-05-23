"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.componentToSvelte = exports.blockToSvelte = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var collect_styles_1 = require("../helpers/collect-styles");
var fast_clone_1 = require("../helpers/fast-clone");
var get_props_1 = require("../helpers/get-props");
var get_refs_1 = require("../helpers/get-refs");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var render_imports_1 = require("../helpers/render-imports");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var jsx_1 = require("../parsers/jsx");
var plugins_1 = require("../modules/plugins");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var getters_to_functions_1 = require("../helpers/getters-to-functions");
var babel_transform_1 = require("../helpers/babel-transform");
var function_1 = require("fp-ts/lib/function");
var context_1 = require("./helpers/context");
var html_tags_1 = require("../constants/html_tags");
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
        var _b;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        return "\n{#each ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code, {
            includeState: options.stateType === 'variables',
        }), " as ").concat(json.properties._forName, ", index }\n").concat(json.children
            .map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); })
            .join('\n'), "\n{/each}\n");
    },
    Show: function (_a) {
        var _b;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        return "\n{#if ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_b = json.bindings.when) === null || _b === void 0 ? void 0 : _b.code, {
            includeState: options.stateType === 'variables',
        }), " }\n").concat(json.children
            .map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); })
            .join('\n'), "\n\n  ").concat(json.meta.else
            ? "\n  {:else}\n  ".concat((0, exports.blockToSvelte)({
                json: json.meta.else,
                options: options,
                parentComponent: parentComponent,
            }), "\n  ")
            : '', "\n{/if}");
    },
};
var getContextCode = function (json) {
    var contextGetters = json.context.get;
    return Object.keys(contextGetters)
        .map(function (key) { return "let ".concat(key, " = getContext(").concat(contextGetters[key].name, ".key);"); })
        .join('\n');
};
var setContextCode = function (json) {
    var contextSetters = json.context.set;
    return Object.keys(contextSetters)
        .map(function (key) {
        var _a = contextSetters[key], value = _a.value, name = _a.name;
        return "setContext(".concat(name, ".key, ").concat(value
            ? (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((0, get_state_object_string_1.getMemberObjectString)(value))
            : 'undefined', ");");
    })
        .join('\n');
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
var blockToSvelte = function (_a) {
    var _b, _c, _d;
    var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
    if (mappers[json.name]) {
        return mappers[json.name]({ json: json, options: options, parentComponent: parentComponent });
    }
    var tagName = getTagName({ json: json, parentComponent: parentComponent });
    if ((0, is_children_1.default)(json)) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code) {
        return "{".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._text.code, {
            includeState: options.stateType === 'variables',
        }), "}");
    }
    var str = '';
    str += "<".concat(tagName, " ");
    if ((_c = json.bindings._spread) === null || _c === void 0 ? void 0 : _c.code) {
        str += "{...".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._spread.code, {
            includeState: options.stateType === 'variables',
        }), "}");
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        if (key === 'innerHTML') {
            continue;
        }
        if (key === '_spread') {
            continue;
        }
        var _e = json.bindings[key], value = _e.code, _f = _e.arguments, cusArgs = _f === void 0 ? ['event'] : _f;
        // TODO: proper babel transform to replace. Util for this
        var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value, {
            includeState: options.stateType === 'variables',
        });
        if (key.startsWith('on')) {
            var event_1 = key.replace('on', '').toLowerCase();
            // TODO: handle quotes in event handler values
            str += " on:".concat(event_1, "=\"{").concat(cusArgs.join(','), " => ").concat((0, remove_surrounding_block_1.removeSurroundingBlock)(useValue), "}\" ");
        }
        else if (key === 'ref') {
            str += " bind:this={".concat(useValue, "} ");
        }
        else {
            str += " ".concat(key, "={").concat(useValue, "} ");
        }
    }
    // if we have innerHTML, it doesn't matter whether we have closing tags or not, or children or not.
    // we use the innerHTML content as children and don't render the self-closing tag.
    if ((_d = json.bindings.innerHTML) === null || _d === void 0 ? void 0 : _d.code) {
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
            .join('\n');
    }
    str += "</".concat(tagName, ">");
    return str;
};
exports.blockToSvelte = blockToSvelte;
/**
 * Replace
 *    <input value={state.name} onChange={event => state.name = event.target.value}
 * with
 *    <input bind:value={state.name}/>
 * when easily identified, for more idiomatic svelte code
 */
var useBindValue = function (json, options) {
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            var _a = item.bindings, value = _a.value, onChange = _a.onChange;
            if (value && onChange) {
                if (onChange.code.replace(/\s+/g, '') ===
                    "".concat(value.code, "=event.target.value")) {
                    delete item.bindings.value;
                    delete item.bindings.onChange;
                    item.bindings['bind:value'] = value;
                }
            }
        }
    });
};
/**
 * Removes all `this.` references.
 */
var stripThisRefs = function (str) {
    return str.replace(/this\.([a-zA-Z_\$0-9]+)/g, '$1');
};
var componentToSvelte = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g;
        var component = _a.component;
        var useOptions = __assign(__assign({}, options), { stateType: 'variables' });
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(component);
        if (useOptions.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, useOptions.plugins);
        }
        var refs = Array.from((0, get_refs_1.getRefs)(json));
        useBindValue(json, useOptions);
        (0, getters_to_functions_1.gettersToFunctions)(json);
        if (useOptions.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, useOptions.plugins);
        }
        var css = (0, collect_styles_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: true,
            functions: false,
            getters: false,
            format: useOptions.stateType === 'proxies' ? 'object' : 'variables',
            keyPrefix: useOptions.stateType === 'variables' ? 'let ' : '',
            valueMapper: function (code) {
                return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
                    includeState: useOptions.stateType === 'variables',
                });
            },
        }), babel_transform_1.babelTransformCode);
        var getterString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: true,
            functions: false,
            format: 'variables',
            keyPrefix: '$: ',
            valueMapper: function (code) {
                return (0, function_1.pipe)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code
                    .replace(/^get ([a-zA-Z_\$0-9]+)/, '$1 = ')
                    .replace(/\)/, ') => '), {
                    includeState: useOptions.stateType === 'variables',
                }), stripThisRefs);
            },
        }), babel_transform_1.babelTransformCode);
        var functionsString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: false,
            functions: true,
            format: 'variables',
            keyPrefix: 'function ',
            valueMapper: function (code) {
                return (0, function_1.pipe)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
                    includeState: useOptions.stateType === 'variables',
                }), stripThisRefs);
            },
        }), babel_transform_1.babelTransformCode);
        var hasData = dataString.length > 4;
        var props = Array.from((0, get_props_1.getProps)(json));
        var transformHookCode = function (hookCode) {
            return (0, function_1.pipe)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(hookCode, {
                includeState: useOptions.stateType === 'variables',
            }), babel_transform_1.babelTransformCode);
        };
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <script>\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n      \n      ", "\n      ", "\n\n      ", "\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "], ["\n    <script>\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n      \n      ", "\n      ", "\n\n      ", "\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "])), !((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ? '' : "import { onMount } from 'svelte'", !((_c = json.hooks.onUpdate) === null || _c === void 0 ? void 0 : _c.length)
            ? ''
            : "import { afterUpdate } from 'svelte'", !((_d = json.hooks.onUnMount) === null || _d === void 0 ? void 0 : _d.code) ? '' : "import { onDestroy } from 'svelte'", (0, render_imports_1.renderPreComponent)(json, 'svelte'), (0, context_1.hasContext)(component)
            ? 'import { getContext, setContext } from "svelte";'
            : '', !hasData || useOptions.stateType === 'variables'
            ? ''
            : "import onChange from 'on-change'", refs
            .concat(props)
            .map(function (name) {
            if (name === 'children') {
                return '';
            }
            return "export let ".concat(name, ";");
        })
            .join('\n'), functionsString.length < 4 ? '' : functionsString, getterString.length < 4 ? '' : getterString, getContextCode(json), setContextCode(json), useOptions.stateType === 'proxies'
            ? dataString.length < 4
                ? ''
                : "let state = onChange(".concat(dataString, ", () => state = state)")
            : dataString, !((_e = json.hooks.onMount) === null || _e === void 0 ? void 0 : _e.code)
            ? ''
            : "onMount(() => { ".concat(transformHookCode(json.hooks.onMount.code), " });"), !((_f = json.hooks.onUpdate) === null || _f === void 0 ? void 0 : _f.length)
            ? ''
            : json.hooks.onUpdate
                .map(function (hook) {
                return "afterUpdate(() => { ".concat(transformHookCode(hook.code), " })");
            })
                .join(';'), !((_g = json.hooks.onUnMount) === null || _g === void 0 ? void 0 : _g.code)
            ? ''
            : "onDestroy(() => { ".concat(transformHookCode(json.hooks.onUnMount.code), " });"), json.children
            .map(function (item) {
            return (0, exports.blockToSvelte)({
                json: item,
                options: useOptions,
                parentComponent: json,
            });
        })
            .join('\n'), !css.trim().length
            ? ''
            : "<style>\n      ".concat(css, "\n    </style>"));
        if (useOptions.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, useOptions.plugins);
        }
        if (useOptions.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'svelte',
                    plugins: [
                        // To support running in browsers
                        require('prettier/parser-html'),
                        require('prettier/parser-postcss'),
                        require('prettier/parser-babel'),
                        require('prettier/parser-typescript'),
                        require('prettier-plugin-svelte'),
                    ],
                });
            }
            catch (err) {
                console.warn('Could not prettify', { string: str }, err);
            }
        }
        if (useOptions.plugins) {
            str = (0, plugins_1.runPostCodePlugins)(str, useOptions.plugins);
        }
        return str;
    };
};
exports.componentToSvelte = componentToSvelte;
var templateObject_1;
