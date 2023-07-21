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
exports.componentToSolid = void 0;
var Array_1 = require("fp-ts/lib/Array");
var S = __importStar(require("fp-ts/string"));
var hash_sum_1 = __importDefault(require("hash-sum"));
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var bindings_1 = require("../../helpers/bindings");
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var get_components_used_1 = require("../../helpers/get-components-used");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var is_root_text_node_1 = require("../../helpers/is-root-text-node");
var merge_options_1 = require("../../helpers/merge-options");
var nullable_1 = require("../../helpers/nullable");
var process_code_1 = require("../../helpers/plugins/process-code");
var render_imports_1 = require("../../helpers/render-imports");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var collect_css_1 = require("../../helpers/styles/collect-css");
var helpers_1 = require("../../helpers/styles/helpers");
var plugins_1 = require("../../modules/plugins");
var context_1 = require("../helpers/context");
var blocks_1 = require("./blocks");
var state_1 = require("./state");
var helpers_2 = require("./state/helpers");
// Transform <foo.bar key={value} /> to <Dynamic compnent={foo.bar} key={value} />
function processDynamicComponents(json, options) {
    var found = false;
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.name.includes('.') && !node.name.endsWith('.Provider')) {
                node.bindings.component = (0, bindings_1.createSingleBinding)({ code: node.name });
                node.name = 'Dynamic';
                found = true;
            }
        }
    });
    return found;
}
function getContextString(component, options) {
    var str = '';
    for (var key in component.context.get) {
        str += "\n      const ".concat(key, " = useContext(").concat(component.context.get[key].name, ");\n    ");
    }
    return str;
}
var getRefsString = function (json, options) {
    return Array.from((0, get_refs_1.getRefs)(json))
        .map(function (ref) {
        var _a;
        var typeParameter = (options.typescript && ((_a = json['refs'][ref]) === null || _a === void 0 ? void 0 : _a.typeParameter)) || '';
        return "let ".concat(ref).concat(typeParameter ? ': ' + typeParameter : '', ";");
    })
        .join('\n');
};
function addProviderComponents(json, options) {
    for (var key in json.context.set) {
        var _a = json.context.set[key], name_1 = _a.name, value = _a.value, ref = _a.ref;
        var bindingValue = value
            ? (0, bindings_1.createSingleBinding)({ code: (0, get_state_object_string_1.stringifyContextValue)(value) })
            : ref
                ? (0, bindings_1.createSingleBinding)({ code: ref })
                : undefined;
        json.children = [
            (0, create_mitosis_node_1.createMitosisNode)(__assign({ name: "".concat(name_1, ".Provider"), children: json.children }, (bindingValue && { bindings: { value: bindingValue } }))),
        ];
    }
}
var DEFAULT_OPTIONS = {
    state: 'signals',
    stylesType: 'styled-components',
    plugins: [],
};
var componentToSolid = function (passedOptions) {
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h;
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        var options = (0, merge_options_1.initializeOptions)({
            target: 'solid',
            component: component,
            defaults: DEFAULT_OPTIONS,
            userOptions: passedOptions,
        });
        options.plugins = __spreadArray(__spreadArray([], (options.plugins || []), true), [
            (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType) {
                switch (codeType) {
                    case 'state':
                    case 'context-set':
                    case 'dynamic-jsx-elements':
                    case 'types':
                        return function (c) { return c; };
                    case 'bindings':
                    case 'hooks':
                    case 'hooks-deps':
                    case 'properties':
                        return (0, helpers_2.updateStateCode)({
                            component: json,
                            options: options,
                            updateSetters: codeType === 'properties' ? false : true,
                        });
                }
            }),
        ], false);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        addProviderComponents(json, options);
        var componentHasStyles = (0, helpers_1.hasCss)(json);
        var hasCustomStyles = !!((_b = json.style) === null || _b === void 0 ? void 0 : _b.length);
        var shouldInjectCustomStyles = hasCustomStyles && options.stylesType === 'styled-components';
        var addWrapper = json.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes).length !== 1 ||
            options.stylesType === 'style-tag' ||
            shouldInjectCustomStyles ||
            (0, is_root_text_node_1.isRootTextNode)(json);
        // we need to run this before we run the code processor plugin, so the dynamic component variables are transformed
        var foundDynamicComponents = processDynamicComponents(json, options);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var css = options.stylesType === 'style-tag' && (0, collect_css_1.collectCss)(json, { prefix: (0, hash_sum_1.default)(json) });
        var state = (0, state_1.getState)({ json: json, options: options });
        var componentsUsed = (0, get_components_used_1.getComponentsUsed)(json);
        var hasShowComponent = componentsUsed.has('Show');
        var hasForComponent = componentsUsed.has('For');
        var solidJSImports = (0, Array_1.uniq)(S.Eq)(__spreadArray(__spreadArray([
            (0, context_1.hasGetContext)(json) ? 'useContext' : undefined,
            hasShowComponent ? 'Show' : undefined,
            hasForComponent ? 'For' : undefined,
            ((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code) ? 'onMount' : undefined
        ], (((_d = json.hooks.onUpdate) === null || _d === void 0 ? void 0 : _d.length) ? ['on', 'createEffect'] : []), true), ((_e = state === null || state === void 0 ? void 0 : state.import.solidjs) !== null && _e !== void 0 ? _e : []), true).filter(nullable_1.checkIsDefined));
        var storeImports = (_f = state === null || state === void 0 ? void 0 : state.import.store) !== null && _f !== void 0 ? _f : [];
        var propType = json.propsTypeRef || 'any';
        var propsArgs = "props".concat(options.typescript ? ":".concat(propType) : '');
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    function ", "(", ") {\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      return (", "\n        ", "\n        ", "\n        ", "\n        ", ")\n    }\n\n    export default ", ";\n  "], ["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    function ", "(", ") {\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      return (", "\n        ", "\n        ", "\n        ", "\n        ", ")\n    }\n\n    export default ", ";\n  "])), solidJSImports.length > 0 ? "import { ".concat(solidJSImports.join(', '), " } from 'solid-js';") : '', !foundDynamicComponents ? '' : "import { Dynamic } from 'solid-js/web';", storeImports.length > 0 ? "import { ".concat(storeImports.join(', '), " } from 'solid-js/store';") : '', !componentHasStyles && options.stylesType === 'styled-components'
            ? ''
            : "import { css } from \"solid-styled-components\";", json.types && options.typescript ? json.types.join('\n') : '', (0, render_imports_1.renderPreComponent)({ component: json, target: 'solid' }), json.name, propsArgs, (_g = state === null || state === void 0 ? void 0 : state.str) !== null && _g !== void 0 ? _g : '', getRefsString(json, options), getContextString(json, options), !((_h = json.hooks.onMount) === null || _h === void 0 ? void 0 : _h.code) ? '' : "onMount(() => { ".concat(json.hooks.onMount.code, " })"), json.hooks.onUpdate
            ? json.hooks.onUpdate
                .map(function (hook, index) {
                if (hook.deps) {
                    var hookName = "onUpdateFn_".concat(index);
                    return "\n                    function ".concat(hookName, "() { ").concat(hook.code, " };\n                    createEffect(on(() => ").concat(hook.deps, ", ").concat(hookName, "));\n                  ");
                }
                else {
                    // TO-DO: support `onUpdate` without `deps`
                    return '';
                }
            })
                .join('\n')
            : '', addWrapper ? '<>' : '', json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, blocks_1.blockToSolid)({ component: component, json: item, options: options }); })
            .join('\n'), options.stylesType === 'style-tag' && css && css.trim().length > 4
            ? // We add the jsx attribute so prettier formats this nicely
                "<style jsx>{`".concat(css, "`}</style>")
            : '', shouldInjectCustomStyles ? "<style>{`".concat(json.style, "`}</style>") : '', addWrapper ? '</>' : '', json.name);
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            str = (0, standalone_1.format)(str, {
                parser: 'typescript',
                plugins: [require('prettier/parser-typescript'), require('prettier/parser-postcss')],
            });
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToSolid = componentToSolid;
var templateObject_1;
