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
exports.componentToSolid = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var collect_styles_1 = require("../helpers/collect-styles");
var get_refs_1 = require("../helpers/get-refs");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var render_imports_1 = require("../helpers/render-imports");
var jsx_1 = require("../parsers/jsx");
var plugins_1 = require("../modules/plugins");
var fast_clone_1 = require("../helpers/fast-clone");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var get_components_used_1 = require("../helpers/get-components-used");
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var filter_empty_text_nodes_1 = require("../helpers/filter-empty-text-nodes");
var create_mitosis_node_1 = require("../helpers/create-mitosis-node");
var context_1 = require("./helpers/context");
var babel_transform_1 = require("../helpers/babel-transform");
var core_1 = require("@babel/core");
var lodash_1 = require("lodash");
// Transform <foo.bar key="value" /> to <component :is="foo.bar" key="value" />
function processDynamicComponents(json, options) {
    var found = false;
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.name.includes('.')) {
                node.bindings.component = { code: node.name };
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
// This should really be a preprocessor mapping the `class` attribute binding based on what other values have
// to make this more pluggable
var collectClassString = function (json) {
    var _a, _b, _c;
    var staticClasses = [];
    if (json.properties.class) {
        staticClasses.push(json.properties.class);
        delete json.properties.class;
    }
    if (json.properties.className) {
        staticClasses.push(json.properties.className);
        delete json.properties.className;
    }
    var dynamicClasses = [];
    if (typeof ((_a = json.bindings.class) === null || _a === void 0 ? void 0 : _a.code) === 'string') {
        dynamicClasses.push(json.bindings.class.code);
        delete json.bindings.class;
    }
    if (typeof ((_b = json.bindings.className) === null || _b === void 0 ? void 0 : _b.code) === 'string') {
        dynamicClasses.push(json.bindings.className.code);
        delete json.bindings.className;
    }
    if (typeof ((_c = json.bindings.css) === null || _c === void 0 ? void 0 : _c.code) === 'string' &&
        json.bindings.css.code.trim().length > 4) {
        dynamicClasses.push("css(".concat(json.bindings.css.code, ")"));
    }
    delete json.bindings.css;
    var staticClassesString = staticClasses.join(' ');
    var dynamicClassesString = dynamicClasses.join(" + ' ' + ");
    var hasStaticClasses = Boolean(staticClasses.length);
    var hasDynamicClasses = Boolean(dynamicClasses.length);
    if (hasStaticClasses && !hasDynamicClasses) {
        return "\"".concat(staticClassesString, "\"");
    }
    if (hasDynamicClasses && !hasStaticClasses) {
        return "{".concat(dynamicClassesString, "}");
    }
    if (hasDynamicClasses && hasStaticClasses) {
        return "{\"".concat(staticClassesString, " \" + ").concat(dynamicClassesString, "}");
    }
    return null;
};
var blockToSolid = function (json, options) {
    var _a, _b, _c;
    if (options === void 0) { options = {}; }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        return "{".concat(json.bindings._text.code, "}");
    }
    if (json.name === 'For') {
        var needsWrapper = json.children.length !== 1;
        // The SolidJS `<For>` component has a special index() signal function.
        // https://www.solidjs.com/docs/latest#%3Cfor%3E
        return "<For each={".concat((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code, "}>\n    {(").concat(json.properties._forName, ", _index) => {\n      const index = _index();\n      return ").concat(needsWrapper ? '<>' : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (child) { return blockToSolid(child, options); }), "}}\n      ").concat(needsWrapper ? '</>' : '', "\n    </For>");
    }
    var str = '';
    if (json.name === 'Fragment') {
        str += '<';
    }
    else {
        str += "<".concat(json.name, " ");
    }
    if (json.name === 'Show' && json.meta.else) {
        str += "fallback={".concat(blockToSolid(json.meta.else, options), "}");
    }
    var classString = collectClassString(json);
    if (classString) {
        str += " class=".concat(classString, " ");
    }
    if ((_c = json.bindings._spread) === null || _c === void 0 ? void 0 : _c.code) {
        str += " {...(".concat(json.bindings._spread.code, ")} ");
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        var _d = json.bindings[key], code = _d.code, _e = _d.arguments, cusArg = _e === void 0 ? ['event'] : _e;
        if (key === '_spread' || key === '_forName') {
            continue;
        }
        if (!code)
            continue;
        if (key.startsWith('on')) {
            var useKey = key === 'onChange' && json.name === 'input' ? 'onInput' : key;
            str += " ".concat(useKey, "={(").concat(cusArg.join(','), ") => ").concat(code, "} ");
        }
        else {
            var useValue = code;
            if (key === 'style') {
                // Convert camelCase keys to kebab-case
                // TODO: support more than top level objects, may need
                // a runtime helper for expressions that are not a direct
                // object literal, such as ternaries and other expression
                // types
                useValue = (0, babel_transform_1.babelTransformExpression)(code, {
                    ObjectExpression: function (path) {
                        // TODO: limit to top level objects only
                        for (var _i = 0, _a = path.node.properties; _i < _a.length; _i++) {
                            var property = _a[_i];
                            if (core_1.types.isObjectProperty(property)) {
                                if (core_1.types.isIdentifier(property.key) ||
                                    core_1.types.isStringLiteral(property.key)) {
                                    var key_1 = core_1.types.isIdentifier(property.key)
                                        ? property.key.name
                                        : property.key.value;
                                    property.key = core_1.types.stringLiteral((0, lodash_1.kebabCase)(key_1));
                                }
                            }
                        }
                    },
                });
            }
            str += " ".concat(key, "={").concat(useValue, "} ");
        }
    }
    if (jsx_1.selfClosingTags.has(json.name)) {
        return str + ' />';
    }
    str += '>';
    if (json.children) {
        str += json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToSolid(item, options); })
            .join('\n');
    }
    if (json.name === 'Fragment') {
        str += '</>';
    }
    else {
        str += "</".concat(json.name, ">");
    }
    return str;
};
var getRefsString = function (json, refs) {
    if (refs === void 0) { refs = (0, get_refs_1.getRefs)(json); }
    var str = '';
    for (var _i = 0, _a = Array.from(refs); _i < _a.length; _i++) {
        var ref = _a[_i];
        str += "\nconst ".concat(ref, " = useRef();");
    }
    return str;
};
function addProviderComponents(json, options) {
    for (var key in json.context.set) {
        var _a = json.context.set[key], name_1 = _a.name, value = _a.value;
        json.children = [
            (0, create_mitosis_node_1.createMitosisNode)(__assign({ name: "".concat(name_1, ".Provider"), children: json.children }, (value && {
                bindings: {
                    value: { code: (0, get_state_object_string_1.getMemberObjectString)(value) },
                },
            }))),
        ];
    }
}
var componentToSolid = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c;
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        addProviderComponents(json, options);
        var componentHasStyles = (0, collect_styles_1.hasStyles)(json);
        var addWrapper = json.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes).length !== 1;
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var foundDynamicComponents = processDynamicComponents(json, options);
        var stateString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json);
        var hasState = Object.keys(component.state).length > 0;
        var componentsUsed = (0, get_components_used_1.getComponentsUsed)(json);
        var componentHasContext = (0, context_1.hasContext)(json);
        var refs = getRefsString(json);
        var hasShowComponent = componentsUsed.has('Show');
        var hasForComponent = componentsUsed.has('For');
        var hasRefs = refs.length > 0;
        var solidJSImports = [
            componentHasContext ? 'useContext' : undefined,
            hasShowComponent ? 'Show' : undefined,
            hasForComponent ? 'For' : undefined,
            ((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ? 'onMount' : undefined,
            hasRefs ? 'useRef' : undefined,
        ].filter(Boolean);
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    function ", "(props) {\n      ", "\n      \n      ", "\n      ", "\n\n      ", "\n\n      return (", "\n        ", "\n        ", ")\n    }\n\n    export default ", ";\n  "], ["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    function ", "(props) {\n      ", "\n      \n      ", "\n      ", "\n\n      ", "\n\n      return (", "\n        ", "\n        ", ")\n    }\n\n    export default ", ";\n  "])), solidJSImports.length > 0
            ? "import { \n          ".concat(solidJSImports.map(function (item) { return item; }).join(', '), "\n         } from 'solid-js';")
            : '', !foundDynamicComponents ? '' : "import { Dynamic } from 'solid-js/web';", !hasState ? '' : "import { createMutable } from 'solid-js/store';", !componentHasStyles
            ? ''
            : "import { css } from \"solid-styled-components\";", (0, render_imports_1.renderPreComponent)(json, 'solid'), json.name, !hasState ? '' : "const state = createMutable(".concat(stateString, ");"), refs, getContextString(json, options), !((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : "onMount(() => { ".concat(json.hooks.onMount.code, " })"), addWrapper ? '<>' : '', json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToSolid(item, options); })
            .join('\n'), addWrapper ? '</>' : '', json.name);
        // HACK: for some reason we are generating `state.state.foo` instead of `state.foo`
        // need a full fix, but this unblocks a lot in the short term
        str = str.replace(/state\.state\./g, 'state.');
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
        }
        if (options.prettier !== false) {
            str = (0, standalone_1.format)(str, {
                parser: 'typescript',
                plugins: [require('prettier/parser-typescript')],
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
