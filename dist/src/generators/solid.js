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
// Transform <foo.bar key="value" /> to <component :is="foo.bar" key="value" />
function processDynamicComponents(json, options) {
    var found = false;
    (0, traverse_1.default)(json).forEach(function (node) {
        if ((0, is_mitosis_node_1.isMitosisNode)(node)) {
            if (node.name.includes('.')) {
                node.bindings.component = node.name;
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
    var staticClasses = [];
    var hasStaticClasses = Boolean(staticClasses.length);
    if (json.properties.class) {
        staticClasses.push(json.properties.class);
        delete json.properties.class;
    }
    if (json.properties.className) {
        staticClasses.push(json.properties.className);
        delete json.properties.className;
    }
    var dynamicClasses = [];
    if (typeof json.bindings.class === 'string') {
        dynamicClasses.push(json.bindings.class);
        delete json.bindings.class;
    }
    if (typeof json.bindings.className === 'string') {
        dynamicClasses.push(json.bindings.className);
        delete json.bindings.className;
    }
    if (typeof json.bindings.className === 'string') {
        dynamicClasses.push(json.bindings.className);
        delete json.bindings.className;
    }
    if (typeof json.bindings.css === 'string' &&
        json.bindings.css.trim().length > 4) {
        dynamicClasses.push("css(".concat(json.bindings.css, ")"));
    }
    delete json.bindings.css;
    var staticClassesString = staticClasses.join(' ');
    var dynamicClassesString = dynamicClasses.join(" + ' ' + ");
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
    if (options === void 0) { options = {}; }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        return "{".concat(json.bindings._text, "}");
    }
    if (json.name === 'For') {
        var needsWrapper = json.children.length !== 1;
        return "<For each={".concat(json.bindings.each, "}>\n    {(").concat(json.properties._forName, ", index) =>\n      ").concat(needsWrapper ? '<>' : '', "\n        ").concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (child) { return blockToSolid(child, options); }), "}\n      ").concat(needsWrapper ? '</>' : '', "\n    </For>");
    }
    var str = '';
    if (json.name === 'Fragment') {
        str += '<';
    }
    else {
        str += "<".concat(json.name, " ");
    }
    var classString = collectClassString(json);
    if (classString) {
        str += " class=".concat(classString, " ");
    }
    if (json.bindings._spread) {
        str += " {...(".concat(json.bindings._spread, ")} ");
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        var value = json.bindings[key];
        if (key === '_spread' || key === '_forName') {
            continue;
        }
        if (key.startsWith('on')) {
            var useKey = key === 'onChange' && json.name === 'input' ? 'onInput' : key;
            str += " ".concat(useKey, "={event => ").concat(value, "} ");
        }
        else {
            str += " ".concat(key, "={").concat(value, "} ");
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
                    value: (0, get_state_object_string_1.getMemberObjectString)(value),
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
        var hasState = Boolean(Object.keys(component.state).length);
        var componentsUsed = (0, get_components_used_1.getComponentsUsed)(json);
        var hasShowComponent = componentsUsed.has('Show');
        var hasForComponent = componentsUsed.has('For');
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    export default function ", "(props) {\n      ", "\n      \n      ", "\n      ", "\n\n      ", "\n\n      return (", "\n        ", "\n        ", ")\n    }\n\n  "], ["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    export default function ", "(props) {\n      ", "\n      \n      ", "\n      ", "\n\n      ", "\n\n      return (", "\n        ", "\n        ", ")\n    }\n\n  "])), !(hasShowComponent || hasForComponent)
            ? ''
            : "import { \n          ".concat(!hasShowComponent ? '' : 'Show, ', "\n          ").concat(!hasForComponent ? '' : 'For, ', "\n          ").concat(!((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ? '' : 'onMount, ', "\n         } from 'solid-js';"), !foundDynamicComponents ? '' : "import { Dynamic } from 'solid-js/web';", !hasState ? '' : "import { createMutable } from 'solid-js/store';", !componentHasStyles
            ? ''
            : "import { css } from \"solid-styled-components\";", (0, render_imports_1.renderPreComponent)(json), json.name, !hasState ? '' : "const state = createMutable(".concat(stateString, ");"), getRefsString(json), getContextString(json, options), !((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : "onMount(() => { ".concat(json.hooks.onMount.code, " })"), addWrapper ? '<>' : '', json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToSolid(item, options); })
            .join('\n'), addWrapper ? '</>' : '');
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
