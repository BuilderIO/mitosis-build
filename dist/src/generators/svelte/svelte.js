"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.componentToSvelte = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var collect_css_1 = require("../../helpers/styles/collect-css");
var helpers_1 = require("../../helpers/styles/helpers");
var fast_clone_1 = require("../../helpers/fast-clone");
var get_props_1 = require("../../helpers/get-props");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var render_imports_1 = require("../../helpers/render-imports");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var plugins_1 = require("../../modules/plugins");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var getters_to_functions_1 = require("../../helpers/getters-to-functions");
var babel_transform_1 = require("../../helpers/babel-transform");
var function_1 = require("fp-ts/lib/function");
var context_1 = require("../helpers/context");
var slots_1 = require("../../helpers/slots");
var json5_1 = __importDefault(require("json5"));
var functions_1 = require("../helpers/functions");
var merge_options_1 = require("../../helpers/merge-options");
var process_code_1 = require("../../helpers/plugins/process-code");
var helpers_2 = require("./helpers");
var blocks_1 = require("./blocks");
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
        var _a = contextSetters[key], ref = _a.ref, value = _a.value, name = _a.name;
        return "setContext(".concat(value ? "".concat(name, ".key") : name, ", ").concat(value
            ? (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((0, get_state_object_string_1.stringifyContextValue)(value))
            : ref
                ? (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(ref)
                : 'undefined', ");");
    })
        .join('\n');
};
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
var DEFAULT_OPTIONS = {
    stateType: 'variables',
    prettier: true,
    plugins: [functions_1.FUNCTION_HACK_PLUGIN],
};
var transformHookCode = function (options) { return function (hookCode) {
    return (0, function_1.pipe)((0, helpers_2.stripStateAndProps)(hookCode, options), babel_transform_1.babelTransformCode);
}; };
var componentToSvelte = function (userProvidedOptions) {
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var component = _a.component;
        var options = (0, merge_options_1.mergeOptions)(DEFAULT_OPTIONS, userProvidedOptions);
        options.plugins = __spreadArray(__spreadArray([], (options.plugins || []), true), [
            (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType) {
                switch (codeType) {
                    case 'hooks':
                        return transformHookCode(options);
                    case 'bindings':
                    case 'hooks-deps':
                    case 'properties':
                        return function (c) { return c; };
                }
            }),
        ], false);
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(component);
        json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        var refs = Array.from((0, get_refs_1.getRefs)(json));
        useBindValue(json, options);
        (0, getters_to_functions_1.gettersToFunctions)(json);
        var props = Array.from((0, get_props_1.getProps)(json)).filter(function (prop) { return !(0, slots_1.isSlotProperty)(prop); });
        json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        var css = (0, collect_css_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: true,
            functions: false,
            getters: false,
            format: options.stateType === 'proxies' ? 'object' : 'variables',
            keyPrefix: options.stateType === 'variables' ? 'let ' : '',
            valueMapper: function (code) { return (0, helpers_2.stripStateAndProps)(code, options); },
        }), babel_transform_1.babelTransformCode);
        var getterString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: true,
            functions: false,
            format: 'variables',
            keyPrefix: '$: ',
            valueMapper: function (code) {
                return (0, function_1.pipe)(code.replace(/^get ([a-zA-Z_\$0-9]+)/, '$1 = ').replace(/\)/, ') => '), function (str) { return (0, helpers_2.stripStateAndProps)(str, options); }, stripThisRefs);
            },
        }), babel_transform_1.babelTransformCode);
        var functionsString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: false,
            functions: true,
            format: 'variables',
            valueMapper: function (code) { return (0, function_1.pipe)((0, helpers_2.stripStateAndProps)(code, options), stripThisRefs); },
        }), babel_transform_1.babelTransformCode);
        var hasData = dataString.length > 4;
        var str = '';
        var tsLangAttribute = options.typescript ? "lang='ts'" : '';
        if (options.typescript && ((_b = json.types) === null || _b === void 0 ? void 0 : _b.length)) {
            str += (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <script context='module' ", ">\n        ", "\n      </script>\n      \n\n      \n\n      "], ["\n      <script context='module' ", ">\n        ", "\n      </script>\n      \\n\n      \\n\n      "])), tsLangAttribute, json.types ? json.types.join('\n\n') + '\n' : '');
        }
        // prepare svelte imports
        var svelteImports = [];
        if ((_d = (_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code) === null || _d === void 0 ? void 0 : _d.length) {
            svelteImports.push('onMount');
        }
        if ((_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.length) {
            svelteImports.push('afterUpdate');
        }
        if ((_g = (_f = json.hooks.onUnMount) === null || _f === void 0 ? void 0 : _f.code) === null || _g === void 0 ? void 0 : _g.length) {
            svelteImports.push('onDestroy');
        }
        if ((0, context_1.hasContext)(component)) {
            svelteImports.push('getContext', 'setContext');
        }
        str += (0, dedent_1.default)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <script ", ">\n      ", "\n      ", "\n\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n      \n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "], ["\n      <script ", ">\n      ", "\n      ", "\n\n      ", "\n      ", "\n      "
            // https://svelte.dev/repl/bd9b56891f04414982517bbd10c52c82?version=3.31.0
            , "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n      \n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "])), tsLangAttribute, !svelteImports.length ? '' : "import { ".concat(svelteImports.sort().join(', '), " } from 'svelte'"), (0, render_imports_1.renderPreComponent)({ component: json, target: 'svelte' }), !hasData || options.stateType === 'variables' ? '' : "import onChange from 'on-change'", props
            .map(function (name) {
            if (name === 'children') {
                return '';
            }
            var propDeclaration = "export let ".concat(name);
            if (options.typescript && json.propsTypeRef && json.propsTypeRef !== 'any') {
                propDeclaration += ": ".concat(json.propsTypeRef.split(' |')[0], "['").concat(name, "']");
            }
            if (json.defaultProps && json.defaultProps.hasOwnProperty(name)) {
                propDeclaration += "=".concat(json5_1.default.stringify(json.defaultProps[name]));
            }
            propDeclaration += ';';
            return propDeclaration;
        })
            .join('\n'), 
        // https://svelte.dev/repl/bd9b56891f04414982517bbd10c52c82?version=3.31.0
        (0, helpers_1.hasStyle)(json)
            ? "\n        function mitosis_styling (node, vars) {\n          Object.entries(vars || {}).forEach(([ p, v ]) => {\n            if (p.startsWith('--')) {\n              node.style.setProperty(p, v);\n            } else {\n              node.style[p] = v;\n            }\n          })\n        }\n      "
            : '', getContextCode(json), setContextCode(json), functionsString.length < 4 ? '' : functionsString, getterString.length < 4 ? '' : getterString, refs.map(function (ref) { return "let ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(ref)); }).join('\n'), options.stateType === 'proxies'
            ? dataString.length < 4
                ? ''
                : "let state = onChange(".concat(dataString, ", () => state = state)")
            : dataString, (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_j = (_h = json.hooks.onInit) === null || _h === void 0 ? void 0 : _h.code) !== null && _j !== void 0 ? _j : ''), !((_k = json.hooks.onMount) === null || _k === void 0 ? void 0 : _k.code) ? '' : "onMount(() => { ".concat(json.hooks.onMount.code, " });"), ((_l = json.hooks.onUpdate) === null || _l === void 0 ? void 0 : _l.map(function (_a, index) {
            var code = _a.code, deps = _a.deps;
            if (!deps) {
                return "afterUpdate(() => { ".concat(code, " });");
            }
            var fnName = "onUpdateFn_".concat(index);
            return "\n              function ".concat(fnName, "() {\n                ").concat(code, "\n              }\n              $: ").concat(fnName, "(...").concat((0, helpers_2.stripStateAndProps)(deps, options), ")\n            ");
        }).join(';')) || '', !((_m = json.hooks.onUnMount) === null || _m === void 0 ? void 0 : _m.code) ? '' : "onDestroy(() => { ".concat(json.hooks.onUnMount.code, " });"), json.children
            .map(function (item) {
            return (0, blocks_1.blockToSvelte)({
                json: item,
                options: options,
                parentComponent: json,
            });
        })
            .join('\n'), !css.trim().length
            ? ''
            : "<style>\n      ".concat(css, "\n    </style>"));
        str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
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
        str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        return str;
    };
};
exports.componentToSvelte = componentToSvelte;
var templateObject_1, templateObject_2;
