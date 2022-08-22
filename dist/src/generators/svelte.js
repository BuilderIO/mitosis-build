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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToSvelte = exports.blockToSvelte = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var collect_css_1 = require("../helpers/styles/collect-css");
var helpers_1 = require("../helpers/styles/helpers");
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
var lodash_1 = require("lodash");
var function_literal_prefix_1 = require("../constants/function-literal-prefix");
var method_literal_prefix_1 = require("../constants/method-literal-prefix");
var patterns_1 = require("../helpers/patterns");
var is_upper_case_1 = require("../helpers/is-upper-case");
var json5_1 = __importDefault(require("json5"));
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
        return "\n{#each ".concat(stripStateAndProps((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code, options), " as ").concat(json.scope.For[0]).concat(json.scope.For[1] ? ", ".concat(json.scope.For[1]) : '', " ").concat(keyValue ? "(".concat(keyValue, ")") : '', "}\n").concat(json.children.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n'), "\n{/each}\n");
    },
    Show: function (_a) {
        var _b;
        var json = _a.json, options = _a.options, parentComponent = _a.parentComponent;
        return "\n{#if ".concat(stripStateAndProps((_b = json.bindings.when) === null || _b === void 0 ? void 0 : _b.code, options), " }\n").concat(json.children.map(function (item) { return (0, exports.blockToSvelte)({ json: item, options: options, parentComponent: parentComponent }); }).join('\n'), "\n\n  ").concat(json.meta.else
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
        return "setContext(".concat(name, ".key, ").concat(value ? (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((0, get_state_object_string_1.stringifyContextValue)(value)) : 'undefined', ");");
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
var stripStateAndProps = function (code, options) {
    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
        includeState: options.stateType === 'variables',
    });
};
var blockToSvelte = function (_a) {
    var _b, _c, _d, _e, _f;
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
        return "{".concat(stripStateAndProps(json.bindings._text.code, options), "}");
    }
    var str = '';
    str += "<".concat(tagName, " ");
    if ((_c = json.bindings._spread) === null || _c === void 0 ? void 0 : _c.code) {
        str += "{...".concat(stripStateAndProps(json.bindings._spread.code, options), "}");
    }
    var isComponent = Boolean(tagName[0] && (0, is_upper_case_1.isUpperCase)(tagName[0]));
    if ((((_d = json.bindings.style) === null || _d === void 0 ? void 0 : _d.code) || json.properties.style) && !isComponent) {
        var useValue = stripStateAndProps(((_e = json.bindings.style) === null || _e === void 0 ? void 0 : _e.code) || json.properties.style, options);
        str += "use:mitosis_styling={".concat(useValue, "}");
        delete json.bindings.style;
        delete json.properties.style;
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
        var _g = json.bindings[key], value = _g.code, _h = _g.arguments, cusArgs = _h === void 0 ? ['event'] : _h;
        // TODO: proper babel transform to replace. Util for this
        var useValue = stripStateAndProps(value, options);
        if (key.startsWith('on')) {
            var event_1 = key.replace('on', '').toLowerCase();
            // TODO: handle quotes in event handler values
            str += " on:".concat(event_1, "=\"{").concat(cusArgs.join(','), " => {").concat((0, remove_surrounding_block_1.removeSurroundingBlock)(useValue), "}}\" ");
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
    if ((_f = json.bindings.innerHTML) === null || _f === void 0 ? void 0 : _f.code) {
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
/**
 * Replace
 *    <input value={state.name} onChange={event => state.name = event.target.value}
 * with
 *    <input bind:value={state.name}/>
 * when easily identified, for more idiomatic svelte code
 */
var useBindValue = function (json, options) {
    function normalizeStr(str) {
        return str
            .trim()
            .replace(/\n|\r/g, '')
            .replace(/^{/, '')
            .replace(/}$/, '')
            .replace(/;$/, '')
            .replace(/\s+/g, '');
    }
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            var _a = item.bindings, value = _a.value, onChange = _a.onChange;
            if (value && onChange) {
                var _b = onChange.arguments, cusArgs = _b === void 0 ? ['event'] : _b;
                if (normalizeStr(onChange.code) === "".concat(normalizeStr(value.code), "=").concat(cusArgs[0], ".target.value")) {
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
var FUNCTION_HACK_PLUGIN = function () { return ({
    json: {
        pre: function (json) {
            var _a;
            for (var key in json.state) {
                var value = (_a = json.state[key]) === null || _a === void 0 ? void 0 : _a.code;
                if (typeof value === 'string' && value.startsWith(method_literal_prefix_1.methodLiteralPrefix)) {
                    var strippedValue = value.replace(method_literal_prefix_1.methodLiteralPrefix, '');
                    if (!Boolean(strippedValue.match(patterns_1.GETTER))) {
                        var newValue = "".concat(function_literal_prefix_1.functionLiteralPrefix, " function ").concat(strippedValue);
                        json.state[key] = {
                            code: newValue,
                            type: 'function',
                        };
                    }
                }
            }
        },
    },
}); };
var componentToSvelte = function (_a) {
    if (_a === void 0) { _a = {}; }
    var _b = _a.plugins, plugins = _b === void 0 ? [] : _b, userProvidedOptions = __rest(_a, ["plugins"]);
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h;
        var component = _a.component;
        var options = __assign({ stateType: 'variables', prettier: true, plugins: __spreadArray([FUNCTION_HACK_PLUGIN], plugins, true) }, userProvidedOptions);
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var refs = Array.from((0, get_refs_1.getRefs)(json));
        useBindValue(json, options);
        (0, getters_to_functions_1.gettersToFunctions)(json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        var css = (0, collect_css_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: true,
            functions: false,
            getters: false,
            format: options.stateType === 'proxies' ? 'object' : 'variables',
            keyPrefix: options.stateType === 'variables' ? 'let ' : '',
            valueMapper: function (code) { return stripStateAndProps(code, options); },
        }), babel_transform_1.babelTransformCode);
        var getterString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: true,
            functions: false,
            format: 'variables',
            keyPrefix: '$: ',
            valueMapper: function (code) {
                return (0, function_1.pipe)(stripStateAndProps(code.replace(/^get ([a-zA-Z_\$0-9]+)/, '$1 = ').replace(/\)/, ') => '), options), stripThisRefs);
            },
        }), babel_transform_1.babelTransformCode);
        var functionsString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: false,
            functions: true,
            format: 'variables',
            keyPrefix: 'const ',
            valueMapper: function (code) { return (0, function_1.pipe)(stripStateAndProps(code, options), stripThisRefs); },
        }), babel_transform_1.babelTransformCode);
        var hasData = dataString.length > 4;
        var props = Array.from((0, get_props_1.getProps)(json));
        var transformHookCode = function (hookCode) {
            return (0, function_1.pipe)(stripStateAndProps(hookCode, options), babel_transform_1.babelTransformCode);
        };
        var str = '';
        if ((_b = json.types) === null || _b === void 0 ? void 0 : _b.length) {
            str += (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <script context='module' lang='ts'>\n        ", "\n      </script>\n      \n\n      \n\n      "], ["\n      <script context='module' lang='ts'>\n        ", "\n      </script>\n      \\n\n      \\n\n      "])), json.types ? json.types.join('\n\n') + '\n' : '');
        }
        str += (0, dedent_1.default)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <script lang='ts'>\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "], ["\n      <script lang='ts'>\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "])), !((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code) ? '' : "import { onMount } from 'svelte'", !((_d = json.hooks.onUpdate) === null || _d === void 0 ? void 0 : _d.length) ? '' : "import { afterUpdate } from 'svelte'", !((_e = json.hooks.onUnMount) === null || _e === void 0 ? void 0 : _e.code) ? '' : "import { onDestroy } from 'svelte'", (0, render_imports_1.renderPreComponent)({ component: json, target: 'svelte' }), (0, context_1.hasContext)(component) ? 'import { getContext, setContext } from "svelte";' : '', !hasData || options.stateType === 'variables' ? '' : "import onChange from 'on-change'", (0, lodash_1.uniq)(refs.map(function (ref) { return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(ref); }).concat(props))
            .map(function (name) {
            if (name === 'children') {
                return '';
            }
            var propDeclaration = "export let ".concat(name);
            if (json.propsTypeRef && json.propsTypeRef !== 'any') {
                propDeclaration += ": ".concat(json.propsTypeRef.split(' |')[0], "['").concat(name, "']");
            }
            if (json.defaultProps && json.defaultProps.hasOwnProperty(name)) {
                propDeclaration += "=".concat(json5_1.default.stringify(json.defaultProps[name]));
            }
            propDeclaration += ';';
            return propDeclaration;
        })
            .join('\n'), (0, helpers_1.hasStyle)(json)
            ? "\n        function mitosis_styling (node, vars) {\n          Object.entries(vars).forEach(([ p, v ]) => { node.style[p] = v })\n        }\n      "
            : '', getContextCode(json), setContextCode(json), functionsString.length < 4 ? '' : functionsString, getterString.length < 4 ? '' : getterString, options.stateType === 'proxies'
            ? dataString.length < 4
                ? ''
                : "let state = onChange(".concat(dataString, ", () => state = state)")
            : dataString, !((_f = json.hooks.onMount) === null || _f === void 0 ? void 0 : _f.code)
            ? ''
            : "onMount(() => { ".concat(transformHookCode(json.hooks.onMount.code), " });"), !((_g = json.hooks.onUpdate) === null || _g === void 0 ? void 0 : _g.length)
            ? ''
            : json.hooks.onUpdate
                .map(function (_a, index) {
                var code = _a.code, deps = _a.deps;
                var hookCode = transformHookCode(code);
                if (deps) {
                    var fnName = "onUpdateFn_".concat(index);
                    return "\n                    function ".concat(fnName, "() {\n                      ").concat(hookCode, "\n                    }\n                    $: ").concat(fnName, "(...").concat(stripStateAndProps(deps, options), ")\n                    ");
                }
                else {
                    return "afterUpdate(() => { ".concat(hookCode, " })");
                }
            })
                .join(';'), !((_h = json.hooks.onUnMount) === null || _h === void 0 ? void 0 : _h.code)
            ? ''
            : "onDestroy(() => { ".concat(transformHookCode(json.hooks.onUnMount.code), " });"), json.children
            .map(function (item) {
            return (0, exports.blockToSvelte)({
                json: item,
                options: options,
                parentComponent: json,
            });
        })
            .join('\n'), !css.trim().length
            ? ''
            : "<style>\n      ".concat(css, "\n    </style>"));
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
        }
        if (options.prettier !== false) {
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
                console.warn('Could not prettify');
                console.warn({ string: str }, err);
            }
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        return str;
    };
};
exports.componentToSvelte = componentToSvelte;
var templateObject_1, templateObject_2;
