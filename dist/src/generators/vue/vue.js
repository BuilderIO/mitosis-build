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
exports.componentToVue3 = exports.componentToVue2 = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var collect_css_1 = require("../../helpers/styles/collect-css");
var fast_clone_1 = require("../../helpers/fast-clone");
var map_refs_1 = require("../../helpers/map-refs");
var render_imports_1 = require("../../helpers/render-imports");
var get_props_1 = require("../../helpers/get-props");
var plugins_1 = require("../../modules/plugins");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var traverse_1 = __importDefault(require("traverse"));
var lodash_1 = require("lodash");
var process_http_requests_1 = require("../../helpers/process-http-requests");
var function_1 = require("fp-ts/lib/function");
var slots_1 = require("../../helpers/slots");
var functions_1 = require("../helpers/functions");
var helpers_1 = require("./helpers");
var optionsApi_1 = require("./optionsApi");
var compositionApi_1 = require("./compositionApi");
var blocks_1 = require("./blocks");
// Transform <foo.bar key="value" /> to <component :is="foo.bar" key="value" />
function processDynamicComponents(json, _options) {
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.name.includes('.')) {
                node.bindings.is = { code: node.name };
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
};
var mergeOptions = function (_a, _b) {
    var _c = _a.plugins, pluginsA = _c === void 0 ? [] : _c, a = __rest(_a, ["plugins"]);
    var _d = _b.plugins, pluginsB = _d === void 0 ? [] : _d, b = __rest(_b, ["plugins"]);
    return (__assign(__assign(__assign({}, a), b), { plugins: __spreadArray(__spreadArray([], pluginsA, true), pluginsB, true) }));
};
var componentToVue = function (userOptions) {
    if (userOptions === void 0) { userOptions = BASE_OPTIONS; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var component = _a.component, path = _a.path;
        var options = mergeOptions(BASE_OPTIONS, userOptions);
        if (options.api === 'options') {
            (_b = options.plugins) === null || _b === void 0 ? void 0 : _b.unshift(onUpdatePlugin);
        }
        else if (options.api === 'composition') {
            (_c = options.plugins) === null || _c === void 0 ? void 0 : _c.unshift(functions_1.FUNCTION_HACK_PLUGIN);
            options.asyncComponentImports = false;
        }
        // Make a copy we can safely mutate, similar to babel's toolchain can be used
        component = (0, fast_clone_1.fastClone)(component);
        (0, process_http_requests_1.processHttpRequests)(component);
        processDynamicComponents(component, options);
        processForKeys(component, options);
        if (options.plugins) {
            component = (0, plugins_1.runPreJsonPlugins)(component, options.plugins);
        }
        if (options.api === 'options') {
            (0, map_refs_1.mapRefs)(component, function (refName) { return "this.$refs.".concat(refName); });
        }
        if (options.plugins) {
            component = (0, plugins_1.runPostJsonPlugins)(component, options.plugins);
        }
        var css = (0, collect_css_1.collectCss)(component, {
            prefix: (_e = (_d = options.cssNamespace) === null || _d === void 0 ? void 0 : _d.call(options)) !== null && _e !== void 0 ? _e : undefined,
        });
        (0, strip_meta_properties_1.stripMetaProperties)(component);
        var template = (0, function_1.pipe)(component.children.map(function (item) { return (0, blocks_1.blockToVue)(item, options, { isRootNode: true }); }).join('\n'), helpers_1.renameMitosisComponentsToKebabCase);
        var onUpdateWithDeps = ((_f = component.hooks.onUpdate) === null || _f === void 0 ? void 0 : _f.filter(function (hook) { var _a; return (_a = hook.deps) === null || _a === void 0 ? void 0 : _a.length; })) || [];
        var onUpdateWithoutDeps = ((_g = component.hooks.onUpdate) === null || _g === void 0 ? void 0 : _g.filter(function (hook) { var _a; return !((_a = hook.deps) === null || _a === void 0 ? void 0 : _a.length); })) || [];
        var getterKeys = Object.keys((0, lodash_1.pickBy)(component.state, function (i) { return (i === null || i === void 0 ? void 0 : i.type) === 'getter'; }));
        var elementProps = Array.from((0, get_props_1.getProps)(component)).filter(function (prop) { return !(0, slots_1.isSlotProperty)(prop); });
        // import from vue
        var vueImports = [];
        if (options.vueVersion >= 3 && options.asyncComponentImports) {
            vueImports.push('defineAsyncComponent');
        }
        if (options.api === 'composition') {
            onUpdateWithDeps.length && vueImports.push('watch');
            ((_h = component.hooks.onMount) === null || _h === void 0 ? void 0 : _h.code) && vueImports.push('onMounted');
            ((_j = component.hooks.onUnMount) === null || _j === void 0 ? void 0 : _j.code) && vueImports.push('onUnMounted');
            onUpdateWithoutDeps.length && vueImports.push('onUpdated');
            (0, lodash_1.size)(getterKeys) && vueImports.push('computed');
            (0, lodash_1.size)(component.context.set) && vueImports.push('provide');
            (0, lodash_1.size)(component.context.get) && vueImports.push('inject');
            (0, lodash_1.size)(Object.keys(component.state).filter(function (key) { var _a; return ((_a = component.state[key]) === null || _a === void 0 ? void 0 : _a.type) === 'property'; })) && vueImports.push('ref');
        }
        var tsLangAttribute = options.typescript ? "lang='ts'" : '';
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    <template>\n      ", "\n    </template>\n\n\n    <script ", " ", ">\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n  "], ["\n    <template>\n      ", "\n    </template>\n\n\n    <script ", " ", ">\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n    </script>\n\n    ", "\n  "])), template, options.api === 'composition' ? 'setup' : '', tsLangAttribute, vueImports.length ? "import { ".concat((0, lodash_1.uniq)(vueImports).sort().join(', '), " } from \"vue\"") : '', (options.typescript && ((_k = component.types) === null || _k === void 0 ? void 0 : _k.join('\n'))) || '', (0, render_imports_1.renderPreComponent)({
            component: component,
            target: 'vue',
            asyncComponentImports: options.asyncComponentImports,
        }), options.api === 'composition'
            ? (0, compositionApi_1.generateCompositionApiScript)(component, options, template, elementProps, onUpdateWithDeps, onUpdateWithoutDeps)
            : (0, optionsApi_1.generateOptionsApiScript)(component, options, path, template, elementProps, onUpdateWithDeps, onUpdateWithoutDeps), !css.trim().length
            ? ''
            : "<style scoped>\n      ".concat(css, "\n    </style>"));
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
        }
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
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        for (var _i = 0, removePatterns_1 = removePatterns; _i < removePatterns_1.length; _i++) {
            var pattern = removePatterns_1[_i];
            str = str.replace(pattern, '');
        }
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
