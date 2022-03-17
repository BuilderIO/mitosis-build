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
var mappers = {
    Fragment: function (json, options) {
        return "".concat(json.children
            .map(function (item) { return (0, exports.blockToSvelte)(item, options); })
            .join('\n'));
    },
};
var blockToSvelte = function (json, options) {
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    if ((0, is_children_1.default)(json)) {
        return "<slot></slot>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        return "{".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._text, {
            includeState: options.stateType === 'variables',
        }), "}");
    }
    var str = '';
    if (json.name === 'For') {
        str += "{#each ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.each, {
            includeState: options.stateType === 'variables',
        }), " as ").concat(json.properties._forName, " }");
        str += json.children.map(function (item) { return (0, exports.blockToSvelte)(item, options); }).join('\n');
        str += "{/each}";
    }
    else if (json.name === 'Show') {
        str += "{#if ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.when, {
            includeState: options.stateType === 'variables',
        }), " }");
        str += json.children.map(function (item) { return (0, exports.blockToSvelte)(item, options); }).join('\n');
        str += "{/if}";
    }
    else {
        str += "<".concat(json.name, " ");
        if (json.bindings._spread) {
            str += "{...".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._spread, {
                includeState: options.stateType === 'variables',
            }), "}");
        }
        for (var key in json.properties) {
            var value = json.properties[key];
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        for (var key in json.bindings) {
            if (key === '_spread') {
                continue;
            }
            var value = json.bindings[key];
            // TODO: proper babel transform to replace. Util for this
            var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value, {
                includeState: options.stateType === 'variables',
            });
            if (key.startsWith('on')) {
                var event_1 = key.replace('on', '').toLowerCase();
                // TODO: handle quotes in event handler values
                str += " on:".concat(event_1, "=\"{event => ").concat((0, remove_surrounding_block_1.removeSurroundingBlock)(useValue), "}\" ");
            }
            else if (key === 'ref') {
                str += " bind:this={".concat(useValue, "} ");
            }
            else {
                str += " ".concat(key, "={").concat(useValue, "} ");
            }
        }
        if (jsx_1.selfClosingTags.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children
                .map(function (item) { return (0, exports.blockToSvelte)(item, options); })
                .join('\n');
        }
        str += "</".concat(json.name, ">");
    }
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
                if (onChange.replace(/\s+/g, '') ===
                    "".concat(value, "=event.target.value")) {
                    delete item.bindings.value;
                    delete item.bindings.onChange;
                    item.bindings['bind:value'] = value;
                }
            }
        }
    });
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
        if (useOptions.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, useOptions.plugins);
        }
        var css = (0, collect_styles_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
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
        });
        var getterString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: true,
            functions: false,
            format: 'variables',
            keyPrefix: '$: ',
            valueMapper: function (code) {
                return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code
                    .replace(/^get ([a-zA-Z_\$0-9]+)/, '$1 = ')
                    .replace(/\)/, ') => '), {
                    includeState: useOptions.stateType === 'variables',
                });
            },
        });
        var functionsString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: false,
            functions: true,
            format: 'variables',
            keyPrefix: 'function ',
            valueMapper: function (code) {
                return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
                    includeState: useOptions.stateType === 'variables',
                });
            },
        });
        var hasData = dataString.length > 4;
        var props = Array.from((0, get_props_1.getProps)(json));
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <script>\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "], ["\n    <script>\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "])), !((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ? '' : "import { onMount } from 'svelte'", !((_c = json.hooks.onUpdate) === null || _c === void 0 ? void 0 : _c.code) ? '' : "import { afterUpdate } from 'svelte'", !((_d = json.hooks.onUnMount) === null || _d === void 0 ? void 0 : _d.code) ? '' : "import { onDestroy } from 'svelte'", (0, render_imports_1.renderPreComponent)(json), !hasData || useOptions.stateType === 'variables'
            ? ''
            : "import onChange from 'on-change'", refs
            .concat(props)
            .map(function (name) { return "export let ".concat(name, ";"); })
            .join('\n'), functionsString.length < 4 ? '' : functionsString, getterString.length < 4 ? '' : getterString, useOptions.stateType === 'proxies'
            ? dataString.length < 4
                ? ''
                : "let state = onChange(".concat(dataString, ", () => state = state)")
            : dataString, !((_e = json.hooks.onMount) === null || _e === void 0 ? void 0 : _e.code)
            ? ''
            : "onMount(() => { ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.hooks.onMount.code, {
                includeState: useOptions.stateType === 'variables',
            }), " });"), !((_f = json.hooks.onUpdate) === null || _f === void 0 ? void 0 : _f.code)
            ? ''
            : "afterUpdate(() => { ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.hooks.onUpdate.code, {
                includeState: useOptions.stateType === 'variables',
            }), " });"), !((_g = json.hooks.onUnMount) === null || _g === void 0 ? void 0 : _g.code)
            ? ''
            : "onDestroy(() => { ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.hooks.onUnMount.code, {
                includeState: useOptions.stateType === 'variables',
            }), " });"), json.children.map(function (item) { return (0, exports.blockToSvelte)(item, useOptions); }).join('\n'), !css.trim().length
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
