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
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var helpers_1 = require("../../helpers/styles/helpers");
var get_refs_1 = require("../../helpers/get-refs");
var render_imports_1 = require("../../helpers/render-imports");
var plugins_1 = require("../../modules/plugins");
var fast_clone_1 = require("../../helpers/fast-clone");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var get_components_used_1 = require("../../helpers/get-components-used");
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var state_1 = require("./state");
var nullable_1 = require("../../helpers/nullable");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var collect_css_1 = require("../../helpers/styles/collect-css");
var hash_sum_1 = __importDefault(require("hash-sum"));
var Array_1 = require("fp-ts/lib/Array");
var S = __importStar(require("fp-ts/string"));
var helpers_2 = require("./state/helpers");
var merge_options_1 = require("../../helpers/merge-options");
var process_code_1 = require("../../helpers/plugins/process-code");
var context_1 = require("../helpers/context");
var blocks_1 = require("./blocks");
var bindings_1 = require("../../helpers/bindings");
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
        var _a = json.context.set[key], name_1 = _a.name, value = _a.value;
        json.children = [
            (0, create_mitosis_node_1.createMitosisNode)(__assign({ name: "".concat(name_1, ".Provider"), children: json.children }, (value && {
                bindings: {
                    value: (0, bindings_1.createSingleBinding)({ code: (0, get_state_object_string_1.stringifyContextValue)(value) }),
                },
            }))),
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
        var _b, _c, _d, _e, _f, _g;
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        var options = (0, merge_options_1.mergeOptions)(DEFAULT_OPTIONS, passedOptions);
        options.plugins = __spreadArray(__spreadArray([], (options.plugins || []), true), [
            (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType) {
                switch (codeType) {
                    case 'state':
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
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        addProviderComponents(json, options);
        var componentHasStyles = (0, helpers_1.hasCss)(json);
        var addWrapper = json.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes).length !== 1 || options.stylesType === 'style-tag';
        // we need to run this before we run the code processor plugin, so the dynamic component variables are transformed
        var foundDynamicComponents = processDynamicComponents(json, options);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
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
            ((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ? 'onMount' : undefined
        ], (((_c = json.hooks.onUpdate) === null || _c === void 0 ? void 0 : _c.length) ? ['on', 'createEffect'] : []), true), ((_d = state === null || state === void 0 ? void 0 : state.import.solidjs) !== null && _d !== void 0 ? _d : []), true).filter(nullable_1.checkIsDefined));
        var storeImports = (_e = state === null || state === void 0 ? void 0 : state.import.store) !== null && _e !== void 0 ? _e : [];
        var propType = json.propsTypeRef || 'any';
        var propsArgs = "props".concat(options.typescript ? ":".concat(propType) : '');
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    function ", "(", ") {\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      return (", "\n        ", "\n        ", "\n        ", ")\n    }\n\n    export default ", ";\n  "], ["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    function ", "(", ") {\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      return (", "\n        ", "\n        ", "\n        ", ")\n    }\n\n    export default ", ";\n  "])), solidJSImports.length > 0 ? "import { ".concat(solidJSImports.join(', '), " } from 'solid-js';") : '', !foundDynamicComponents ? '' : "import { Dynamic } from 'solid-js/web';", storeImports.length > 0 ? "import { ".concat(storeImports.join(', '), " } from 'solid-js/store';") : '', !componentHasStyles && options.stylesType === 'styled-components'
            ? ''
            : "import { css } from \"solid-styled-components\";", json.types && options.typescript ? json.types.join('\n') : '', (0, render_imports_1.renderPreComponent)({ component: json, target: 'solid' }), json.name, propsArgs, (_f = state === null || state === void 0 ? void 0 : state.str) !== null && _f !== void 0 ? _f : '', getRefsString(json, options), getContextString(json, options), !((_g = json.hooks.onMount) === null || _g === void 0 ? void 0 : _g.code) ? '' : "onMount(() => { ".concat(json.hooks.onMount.code, " })"), json.hooks.onUpdate
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
            : '', addWrapper ? '</>' : '', json.name);
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
        }
        if (options.prettier !== false) {
            str = (0, standalone_1.format)(str, {
                parser: 'typescript',
                plugins: [require('prettier/parser-typescript'), require('prettier/parser-postcss')],
            });
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        return str;
    };
};
exports.componentToSolid = componentToSolid;
var templateObject_1;
