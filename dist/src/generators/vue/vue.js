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
exports.componentToVue3 = exports.componentToVue2 = void 0;
var function_1 = require("fp-ts/lib/function");
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var babel_transform_1 = require("../../helpers/babel-transform");
var bindings_1 = require("../../helpers/bindings");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var get_props_1 = require("../../helpers/get-props");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var map_refs_1 = require("../../helpers/map-refs");
var merge_options_1 = require("../../helpers/merge-options");
var process_code_1 = require("../../helpers/plugins/process-code");
var process_http_requests_1 = require("../../helpers/process-http-requests");
var render_imports_1 = require("../../helpers/render-imports");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var slots_1 = require("../../helpers/slots");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var collect_css_1 = require("../../helpers/styles/collect-css");
var plugins_1 = require("../../modules/plugins");
var functions_1 = require("../helpers/functions");
var blocks_1 = require("./blocks");
var compositionApi_1 = require("./compositionApi");
var helpers_1 = require("./helpers");
var optionsApi_1 = require("./optionsApi");
// Transform <foo.bar key="value" /> to <component :is="foo.bar" key="value" />
function processDynamicComponents(json, _options) {
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.name.includes('.')) {
                node.bindings.is = (0, bindings_1.createSingleBinding)({ code: node.name });
                node.name = 'component';
            }
        }
    });
}
function processForKeys(json, _options) {
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.name === 'For') {
                var firstChild = node.children[0];
                if (firstChild && firstChild.bindings.key) {
                    node.bindings.key = firstChild.bindings.key;
                    delete firstChild.bindings.key;
                }
            }
        }
    });
}
/**
 * This plugin handle `onUpdate` code that watches dependencies.
 * We need to apply this workaround to be able to watch specific dependencies in Vue 2: https://stackoverflow.com/a/45853349
 *
 * We add a `computed` property for the dependencies, and a matching `watch` function for the `onUpdate` code
 */
var onUpdatePlugin = function (options) { return ({
    json: {
        post: function (component) {
            if (component.hooks.onUpdate) {
                component.hooks.onUpdate
                    .filter(function (hook) { var _a; return (_a = hook.deps) === null || _a === void 0 ? void 0 : _a.length; })
                    .forEach(function (hook, index) {
                    var _a;
                    var code = "get ".concat((0, helpers_1.getOnUpdateHookName)(index), " () {\n            return {\n              ").concat((_a = hook.deps) === null || _a === void 0 ? void 0 : _a.slice(1, -1).split(',').map(function (dep, k) {
                        var val = dep.trim();
                        return "".concat(k, ": ").concat(val);
                    }).join(','), "\n            }\n          }");
                    component.state[(0, helpers_1.getOnUpdateHookName)(index)] = {
                        code: code,
                        type: 'getter',
                    };
                });
            }
        },
    },
}); };
var BASE_OPTIONS = {
    plugins: [],
    vueVersion: 2,
    api: 'options',
    defineComponent: true,
};
var componentToVue = function (userOptions) {
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h;
        var _component = _a.component, path = _a.path;
        // Make a copy we can safely mutate, similar to babel's toolchain can be used
        var component = (0, fast_clone_1.fastClone)(_component);
        var options = (0, merge_options_1.initializeOptions)({
            target: (userOptions === null || userOptions === void 0 ? void 0 : userOptions.vueVersion) === 2 ? 'vue2' : 'vue3',
            component: component,
            defaults: BASE_OPTIONS,
            userOptions: userOptions,
        });
        options.plugins.unshift((0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType) {
            if (options.api === 'composition') {
                switch (codeType) {
                    case 'hooks':
                        return function (code) { return (0, helpers_1.processBinding)({ code: code, options: options, json: component }); };
                    case 'state':
                        return function (code) { return (0, helpers_1.processBinding)({ code: code, options: options, json: component }); };
                    case 'bindings':
                        return (0, function_1.flow)(
                        // Strip types from any JS code that ends up in the template, because Vue does not support TS code in templates.
                        babel_transform_1.convertTypeScriptToJS, function (code) { return (0, helpers_1.processBinding)({ code: code, options: options, json: component, codeType: codeType }); });
                    case 'context-set':
                        return function (code) {
                            return (0, helpers_1.processBinding)({ code: code, options: options, json: component, preserveGetter: true });
                        };
                    case 'hooks-deps':
                        return (0, replace_identifiers_1.replaceStateIdentifier)(null);
                    case 'properties':
                    case 'dynamic-jsx-elements':
                    case 'types':
                        return function (c) { return c; };
                }
            }
            else {
                switch (codeType) {
                    case 'hooks':
                        return function (code) { return (0, helpers_1.processBinding)({ code: code, options: options, json: component }); };
                    case 'bindings':
                        return (0, function_1.flow)(
                        // Strip types from any JS code that ends up in the template, because Vue does not support TS code in templates.
                        babel_transform_1.convertTypeScriptToJS, function (code) { return (0, helpers_1.processBinding)({ code: code, options: options, json: component, codeType: codeType }); });
                    case 'properties':
                    case 'dynamic-jsx-elements':
                    case 'hooks-deps':
                    case 'types':
                        return function (c) { return c; };
                    case 'state':
                        return function (c) { return (0, helpers_1.processBinding)({ code: c, options: options, json: component }); };
                    case 'context-set':
                        return function (code) {
                            return (0, helpers_1.processBinding)({
                                code: code,
                                options: options,
                                json: component,
                                thisPrefix: '_this',
                                preserveGetter: true,
                            });
                        };
                }
            }
        }));
        if (options.api === 'options') {
            options.plugins.unshift(onUpdatePlugin);
        }
        else if (options.api === 'composition') {
            options.plugins.unshift(functions_1.FUNCTION_HACK_PLUGIN);
            options.asyncComponentImports = false;
        }
        (0, process_http_requests_1.processHttpRequests)(component);
        processDynamicComponents(component, options);
        processForKeys(component, options);
        component = (0, plugins_1.runPreJsonPlugins)({ json: component, plugins: options.plugins });
        if (options.api === 'options') {
            (0, map_refs_1.mapRefs)(component, function (refName) { return "this.$refs.".concat(refName); });
        }
        // need to run this before we process the component's code
        var props = Array.from((0, get_props_1.getProps)(component));
        var elementProps = props.filter(function (prop) { return !(0, slots_1.isSlotProperty)(prop); });
        var slotsProps = props.filter(function (prop) { return (0, slots_1.isSlotProperty)(prop); });
        component = (0, plugins_1.runPostJsonPlugins)({ json: component, plugins: options.plugins });
        var css = (0, collect_css_1.collectCss)(component, {
            prefix: (_c = (_b = options.cssNamespace) === null || _b === void 0 ? void 0 : _b.call(options)) !== null && _c !== void 0 ? _c : undefined,
        });
        (0, strip_meta_properties_1.stripMetaProperties)(component);
        var template = (0, function_1.pipe)(component.children.map(function (item) { return (0, blocks_1.blockToVue)(item, options, { isRootNode: true }); }).join('\n'), helpers_1.renameMitosisComponentsToKebabCase);
        var onUpdateWithDeps = ((_d = component.hooks.onUpdate) === null || _d === void 0 ? void 0 : _d.filter(function (hook) { var _a; return (_a = hook.deps) === null || _a === void 0 ? void 0 : _a.length; })) || [];
        var onUpdateWithoutDeps = ((_e = component.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.filter(function (hook) { var _a; return !((_a = hook.deps) === null || _a === void 0 ? void 0 : _a.length); })) || [];
        var getterKeys = Object.keys((0, lodash_1.pickBy)(component.state, function (i) { return (i === null || i === void 0 ? void 0 : i.type) === 'getter'; }));
        // import from vue
        var vueImports = [];
        if (options.vueVersion >= 3 && options.asyncComponentImports) {
            vueImports.push('defineAsyncComponent');
        }
        if (options.api === 'options' && options.defineComponent) {
            vueImports.push('defineComponent');
        }
        if (options.api === 'composition') {
            onUpdateWithDeps.length && vueImports.push('watch');
            ((_f = component.hooks.onMount) === null || _f === void 0 ? void 0 : _f.code) && vueImports.push('onMounted');
            ((_g = component.hooks.onUnMount) === null || _g === void 0 ? void 0 : _g.code) && vueImports.push('onUnmounted');
            onUpdateWithoutDeps.length && vueImports.push('onUpdated');
            (0, lodash_1.size)(getterKeys) && vueImports.push('computed');
            (0, lodash_1.size)(component.context.set) && vueImports.push('provide');
            (0, lodash_1.size)(component.context.get) && vueImports.push('inject');
            (0, lodash_1.size)(Object.keys(component.state).filter(function (key) { var _a; return ((_a = component.state[key]) === null || _a === void 0 ? void 0 : _a.type) === 'property'; })) && vueImports.push('ref');
            (0, lodash_1.size)(slotsProps) && vueImports.push('useSlots');
        }
        var tsLangAttribute = options.typescript ? "lang='ts'" : '';
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n\n    <script ", " ", ">\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n  "], ["\n    ", "\n\n\n    <script ", " ", ">\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n  "])), template.trim().length > 0
            ? "<template>\n      ".concat(template, "\n    </template>")
            : '', options.api === 'composition' ? 'setup' : '', tsLangAttribute, vueImports.length ? "import { ".concat((0, lodash_1.uniq)(vueImports).sort().join(', '), " } from \"vue\"") : '', (0, render_imports_1.renderPreComponent)({
            component: component,
            target: 'vue',
            asyncComponentImports: options.asyncComponentImports,
        }), (options.typescript && ((_h = component.types) === null || _h === void 0 ? void 0 : _h.join('\n'))) || '', options.api === 'composition'
            ? (0, compositionApi_1.generateCompositionApiScript)(component, options, template, elementProps, onUpdateWithDeps, onUpdateWithoutDeps)
            : (0, optionsApi_1.generateOptionsApiScript)(component, options, path, template, elementProps, onUpdateWithDeps, onUpdateWithoutDeps), !css.trim().length
            ? ''
            : "<style scoped>\n      ".concat(css, "\n    </style>"));
        str = (0, plugins_1.runPreCodePlugins)({
            json: component,
            code: str,
            plugins: options.plugins,
            options: { json: component },
        });
        if (true || options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'vue',
                    plugins: [
                        // To support running in browsers
                        require('prettier/parser-typescript'),
                        require('prettier/parser-html'),
                        require('prettier/parser-postcss'),
                        require('prettier/parser-babel'),
                    ],
                });
            }
            catch (err) {
                console.warn('Could not prettify', { string: str }, err);
            }
        }
        str = (0, plugins_1.runPostCodePlugins)({ json: component, code: str, plugins: options.plugins });
        for (var _i = 0, removePatterns_1 = removePatterns; _i < removePatterns_1.length; _i++) {
            var pattern = removePatterns_1[_i];
            str = str.replace(pattern, '').trim();
        }
        str = str.replace(/<script(.*)>\n?<\/script>/g, '').trim();
        return str;
    };
};
var componentToVue2 = function (vueOptions) {
    return componentToVue(__assign(__assign({}, vueOptions), { vueVersion: 2 }));
};
exports.componentToVue2 = componentToVue2;
var componentToVue3 = function (vueOptions) {
    return componentToVue(__assign(__assign({}, vueOptions), { vueVersion: 3 }));
};
exports.componentToVue3 = componentToVue3;
// Remove unused artifacts like empty script or style tags
var removePatterns = [
    "<script>\nexport default {};\n</script>",
    "<style>\n</style>",
];
var templateObject_1;
