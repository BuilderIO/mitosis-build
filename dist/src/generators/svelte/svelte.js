"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var function_1 = require("fp-ts/lib/function");
var prettierPluginSvelte = __importStar(require("prettier-plugin-svelte"));
var parser_babel_1 = __importDefault(require("prettier/parser-babel"));
var parser_html_1 = __importDefault(require("prettier/parser-html"));
var parser_postcss_1 = __importDefault(require("prettier/parser-postcss"));
var parser_typescript_1 = __importDefault(require("prettier/parser-typescript"));
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var babel_transform_1 = require("../../helpers/babel-transform");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var get_props_1 = require("../../helpers/get-props");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var getters_to_functions_1 = require("../../helpers/getters-to-functions");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var merge_options_1 = require("../../helpers/merge-options");
var patterns_1 = require("../../helpers/patterns");
var process_code_1 = require("../../helpers/plugins/process-code");
var render_imports_1 = require("../../helpers/render-imports");
var slots_1 = require("../../helpers/slots");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var collect_css_1 = require("../../helpers/styles/collect-css");
var helpers_1 = require("../../helpers/styles/helpers");
var plugins_1 = require("../../modules/plugins");
var context_1 = require("../helpers/context");
var functions_1 = require("../helpers/functions");
var blocks_1 = require("./blocks");
var helpers_2 = require("./helpers");
var getContextCode = function (json) {
    var contextGetters = json.context.get;
    return Object.entries(contextGetters)
        .map(function (_a) {
        var key = _a[0], context = _a[1];
        var name = context.name;
        var contextType = (0, context_1.getContextType)({ component: json, context: context });
        switch (contextType) {
            case 'reactive':
            case 'normal':
                return "let ".concat(key, " = getContext(").concat(name, ".key);");
        }
    })
        .join('\n');
};
var setContextCode = function (_a) {
    var json = _a.json, options = _a.options;
    var processCode = (0, helpers_2.stripStateAndProps)({ json: json, options: options });
    return Object.values(json.context.set)
        .map(function (context) {
        var value = context.value, name = context.name, ref = context.ref;
        var nameIsStringLiteral = (name.startsWith("'") && name.endsWith("'")) ||
            (name.startsWith('"') && name.endsWith('"'));
        var key = nameIsStringLiteral ? name : "".concat(name, ".key");
        var valueStr = value
            ? processCode((0, get_state_object_string_1.stringifyContextValue)(value))
            : ref
                ? processCode(ref)
                : 'undefined';
        var contextType = (0, context_1.getContextType)({ component: json, context: context });
        switch (contextType) {
            case 'normal':
                return "setContext(".concat(key, ", ").concat(valueStr, ");");
            case 'reactive':
                var storeName = "".concat(name, "ContextStoreValue");
                return "\n            const ".concat(storeName, " = writable(").concat(valueStr, ");\n            setContext(").concat(key, ", ").concat(storeName, ");\n          ");
        }
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
var DEFAULT_OPTIONS = {
    stateType: 'variables',
    prettier: true,
    plugins: [functions_1.FUNCTION_HACK_PLUGIN],
};
var componentToSvelte = function (userProvidedOptions) {
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var component = _a.component;
        var options = (0, merge_options_1.initializeOptions)({
            target: 'svelte',
            component: component,
            defaults: DEFAULT_OPTIONS,
            userOptions: userProvidedOptions,
        });
        options.plugins = __spreadArray(__spreadArray([], (options.plugins || []), true), [
            // Strip types from any JS code that ends up in the template, because Svelte does not support TS code in templates.
            (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType) {
                switch (codeType) {
                    case 'bindings':
                    case 'properties':
                        return babel_transform_1.convertTypeScriptToJS;
                    case 'hooks':
                    case 'hooks-deps':
                    case 'state':
                    case 'context-set':
                    case 'dynamic-jsx-elements':
                    case 'types':
                        return function (x) { return x; };
                }
            }),
            (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType) {
                switch (codeType) {
                    case 'hooks':
                        return (0, function_1.flow)((0, helpers_2.stripStateAndProps)({ json: json, options: options }), babel_transform_1.babelTransformCode);
                    case 'bindings':
                    case 'hooks-deps':
                    case 'state':
                        return (0, function_1.flow)((0, helpers_2.stripStateAndProps)({ json: json, options: options }), patterns_1.stripGetter);
                    case 'properties':
                    case 'context-set':
                        return (0, function_1.flow)((0, helpers_2.stripStateAndProps)({ json: json, options: options }));
                    case 'dynamic-jsx-elements':
                    case 'types':
                        return function (x) { return x; };
                }
            }),
        ], false);
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(component);
        json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        useBindValue(json, options);
        (0, getters_to_functions_1.gettersToFunctions)(json);
        var filteredProps = Array.from((0, get_props_1.getProps)(json))
            .filter(function (prop) { return !(0, slots_1.isSlotProperty)(prop); })
            // map $prop to prop for reactive state
            .map(function (x) { return (x.startsWith('$') ? x.slice(1) : x); });
        // this helps make sure we don't have duplicate props
        var props = Array.from(new Set(filteredProps));
        var refs = Array.from((0, get_refs_1.getRefs)(json))
            .map((0, helpers_2.stripStateAndProps)({ json: json, options: options }))
            .filter(function (x) { return !props.includes(x); });
        json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        var css = (0, collect_css_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var usesWritable = false;
        var dataString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: true,
            functions: false,
            getters: false,
            format: options.stateType === 'proxies' ? 'object' : 'variables',
            keyPrefix: options.stateType === 'variables' ? 'let ' : '',
            valueMapper: function (code, _t, _p, key) {
                var _a;
                if (((_a = json.state[key]) === null || _a === void 0 ? void 0 : _a.propertyType) === 'reactive') {
                    usesWritable = true;
                    return "writable(".concat(code, ")");
                }
                return code;
            },
        }), babel_transform_1.babelTransformCode);
        var getterString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: true,
            functions: false,
            format: 'variables',
            keyPrefix: '$: ',
            valueMapper: function (code) {
                return code
                    .trim()
                    .replace(/^([a-zA-Z_\$0-9]+)/, '$1 = ')
                    .replace(/\)/, ') => ');
            },
        }), babel_transform_1.babelTransformCode);
        var functionsString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            data: false,
            getters: false,
            functions: true,
            format: 'variables',
        }), babel_transform_1.babelTransformCode);
        var hasData = dataString.length > 4;
        var str = '';
        var tsLangAttribute = options.typescript ? "lang='ts'" : '';
        if (options.typescript && ((_b = json.types) === null || _b === void 0 ? void 0 : _b.length)) {
            str += (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <script context='module' ", ">\n        ", "\n      </script>\n      \n\n      \n\n      "], ["\n      <script context='module' ", ">\n        ", "\n      </script>\n      \\n\n      \\n\n      "])), tsLangAttribute, json.types ? json.types.join('\n\n') + '\n' : '');
        }
        // prepare svelte imports
        var svelteImports = [];
        var svelteStoreImports = [];
        if ((_d = (_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code) === null || _d === void 0 ? void 0 : _d.length) {
            svelteImports.push('onMount');
        }
        if ((_f = (_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.filter(function (x) { return !x.deps; })) === null || _f === void 0 ? void 0 : _f.length) {
            svelteImports.push('afterUpdate');
        }
        if ((_h = (_g = json.hooks.onUnMount) === null || _g === void 0 ? void 0 : _g.code) === null || _h === void 0 ? void 0 : _h.length) {
            svelteImports.push('onDestroy');
        }
        if ((0, context_1.hasGetContext)(component)) {
            svelteImports.push('getContext');
        }
        if ((0, context_1.hasSetContext)(component)) {
            svelteImports.push('setContext');
        }
        if (usesWritable) {
            svelteStoreImports.push('writable');
        }
        str += (0, dedent_1.dedent)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <script ", ">\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "], ["\n      <script ", ">\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n      "
            // https://svelte.dev/repl/bd9b56891f04414982517bbd10c52c82?version=3.31.0
            , "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      "
            // make sure this is after all other state/code is initialized
            , "\n\n      ", "\n    </script>\n\n    ", "\n\n    ", "\n  "])), tsLangAttribute, !svelteImports.length ? '' : "import { ".concat(svelteImports.sort().join(', '), " } from 'svelte'"), !svelteStoreImports.length
            ? ''
            : "import { ".concat(svelteStoreImports.sort().join(', '), " } from 'svelte/store'"), (0, render_imports_1.renderPreComponent)({ component: json, target: 'svelte' }), !hasData || options.stateType === 'variables' ? '' : "import onChange from 'on-change'", props
            .map(function (name) {
            var _a, _b, _c;
            if (name === 'children') {
                return '';
            }
            var propDeclaration = "export let ".concat(name);
            if (options.typescript && json.propsTypeRef && json.propsTypeRef !== 'any') {
                propDeclaration += ": ".concat(json.propsTypeRef.split(' |')[0], "['").concat(name, "']");
            }
            if ((_b = (_a = json.props) === null || _a === void 0 ? void 0 : _a[name]) === null || _b === void 0 ? void 0 : _b.optional) {
                propDeclaration += "= undefined";
            }
            if (json.defaultProps && json.defaultProps.hasOwnProperty(name)) {
                propDeclaration += "=".concat((_c = json.defaultProps[name]) === null || _c === void 0 ? void 0 : _c.code);
            }
            propDeclaration += ';';
            return propDeclaration;
        })
            .join('\n'), 
        // https://svelte.dev/repl/bd9b56891f04414982517bbd10c52c82?version=3.31.0
        (0, helpers_1.hasStyle)(json)
            ? "\n        function mitosis_styling (node, vars) {\n          Object.entries(vars || {}).forEach(([ p, v ]) => {\n            if (p.startsWith('--')) {\n              node.style.setProperty(p, v);\n            } else {\n              node.style[p] = v;\n            }\n          })\n        }\n      "
            : '', getContextCode(json), functionsString.length < 4 ? '' : functionsString, getterString.length < 4 ? '' : getterString, refs.map(function (ref) { return "let ".concat(ref); }).join('\n'), options.stateType === 'proxies'
            ? dataString.length < 4
                ? ''
                : "let state = onChange(".concat(dataString, ", () => state = state)")
            : dataString, (_k = (_j = json.hooks.onInit) === null || _j === void 0 ? void 0 : _j.code) !== null && _k !== void 0 ? _k : '', !((_l = json.hooks.onMount) === null || _l === void 0 ? void 0 : _l.code) ? '' : "onMount(() => { ".concat(json.hooks.onMount.code, " });"), ((_m = json.hooks.onUpdate) === null || _m === void 0 ? void 0 : _m.map(function (_a, index) {
            var code = _a.code, deps = _a.deps;
            if (!deps) {
                return "afterUpdate(() => { ".concat(code, " });");
            }
            var fnName = "onUpdateFn_".concat(index);
            return "\n              function ".concat(fnName, "(..._args").concat(options.typescript ? ': any[]' : '', ") {\n                ").concat(code, "\n              }\n              $: ").concat(fnName, "(...").concat(deps, ")\n            ");
        }).join(';')) || '', 
        // make sure this is after all other state/code is initialized
        setContextCode({ json: json, options: options }), !((_o = json.hooks.onUnMount) === null || _o === void 0 ? void 0 : _o.code) ? '' : "onDestroy(() => { ".concat(json.hooks.onUnMount.code, " });"), json.children
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
        str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'svelte',
                    plugins: [
                        // To support running in browsers
                        parser_html_1.default,
                        parser_postcss_1.default,
                        parser_babel_1.default,
                        parser_typescript_1.default,
                        prettierPluginSvelte,
                    ],
                });
            }
            catch (err) {
                console.warn('Could not prettify');
                console.warn(str, err);
            }
        }
        str = str.replace(/<script>\n<\/script>/g, '').trim();
        str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        return str;
    };
};
exports.componentToSvelte = componentToSvelte;
var templateObject_1, templateObject_2;
