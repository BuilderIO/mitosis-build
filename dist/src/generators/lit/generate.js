"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToLit = void 0;
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../../constants/html_tags");
var dash_case_1 = require("../../helpers/dash-case");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var get_props_1 = require("../../helpers/get-props");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var has_1 = require("../../helpers/has");
var indent_1 = require("../../helpers/indent");
var is_upper_case_1 = require("../../helpers/is-upper-case");
var map_refs_1 = require("../../helpers/map-refs");
var merge_options_1 = require("../../helpers/merge-options");
var render_imports_1 = require("../../helpers/render-imports");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var collect_css_1 = require("../../helpers/styles/collect-css");
var plugins_1 = require("../../modules/plugins");
var mitosis_node_1 = require("../../types/mitosis-node");
var collect_class_string_1 = require("./collect-class-string");
var getCustomTagName = function (name, options) {
    if (!name || !(0, is_upper_case_1.isUpperCase)(name[0])) {
        return name;
    }
    var kebabCaseName = (0, dash_case_1.dashCase)(name);
    if (!kebabCaseName.includes('-')) {
        // TODO: option to choose your prefix
        return 'my-' + kebabCaseName;
    }
    return kebabCaseName;
};
var blockToLit = function (json, options) {
    var _a, _b, _c, _d;
    if (options === void 0) { options = {}; }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        return "${".concat(processBinding((_b = json.bindings) === null || _b === void 0 ? void 0 : _b._text.code), "}");
    }
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        return "${".concat(processBinding((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code), "?.map((").concat(json.scope.forName, ", index) => (\n      html`").concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToLit(item, options); })
            .join('\n'), "`\n    ))}");
    }
    else if (json.name === 'Show') {
        return "${".concat(processBinding((_d = json.bindings.when) === null || _d === void 0 ? void 0 : _d.code), " ?\n      html`").concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToLit(item, options); })
            .join('\n'), "`\n    : ").concat(!json.meta.else ? 'null' : "html`".concat(blockToLit(json.meta.else, options), "`"), "}");
    }
    var str = '';
    var tagName = getCustomTagName(json.name, options);
    str += "<".concat(tagName, " ");
    var classString = (0, collect_class_string_1.collectClassString)(json);
    if (classString) {
        str += " class=".concat(classString, " ");
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        var _e = json.bindings[key], code = _e.code, _f = _e.arguments, cusArgs = _f === void 0 ? ['event'] : _f, type = _e.type;
        if (type === 'spread') {
            str += " ${spread(".concat(code, ")} ");
        }
        else if (key === 'ref') {
            // TODO: maybe use ref directive instead
            // https://lit.dev/docs/templates/directives/#ref
            str += " ref=\"".concat(code, "\" ");
        }
        else if (key.startsWith('on')) {
            var useKey = key === 'onChange' && json.name === 'input' ? 'onInput' : key;
            useKey = '@' + useKey.substring(2).toLowerCase();
            str += " ".concat(useKey, "=${").concat(cusArgs.join(','), " => ").concat(processBinding(code), "} ");
        }
        else {
            var value = processBinding(code);
            // If they key includes a '-' it's an attribute, not a property
            if (key.includes('-')) {
                str += " ".concat(key, "=${").concat(value, "} ");
            }
            else {
                // TODO: handle boolean attributes too by matching list of html boolean attributes
                // https://lit.dev/docs/templates/expressions/#boolean-attribute-expressions
                str += " .".concat(key, "=${").concat(value, "} ");
            }
        }
    }
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
        return str + ' />';
    }
    str += '>';
    if (json.children) {
        str += json.children.map(function (item) { return blockToLit(item, options); }).join('\n');
    }
    str += "</".concat(tagName, ">");
    return str;
};
function processBinding(code) {
    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, { replaceWith: 'this.' });
}
var componentToLit = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var _b, _c, _d, _e;
        var component = _a.component;
        var options = (0, merge_options_1.initializeOptions)({ target: 'lit', component: component, defaults: _options });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var props = (0, get_props_1.getProps)(component);
        var css = (0, collect_css_1.collectCss)(json);
        var domRefs = (0, get_refs_1.getRefs)(json);
        (0, map_refs_1.mapRefs)(component, function (refName) { return "this.".concat((0, lodash_1.camelCase)(refName)); });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            data: true,
            functions: false,
            getters: false,
            keyPrefix: '@state() ',
            valueMapper: function (code) { return processBinding(code); },
        });
        var methodsString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            data: false,
            functions: true,
            getters: true,
            valueMapper: function (code) { return processBinding(code); },
        });
        if (options.prettier !== false) {
            try {
                css = (0, standalone_1.format)(css, {
                    parser: 'css',
                    plugins: [require('prettier/parser-postcss')],
                });
            }
            catch (err) {
                console.warn('Could not format css', err);
            }
        }
        var html = json.children.map(function (item) { return blockToLit(item, options); }).join('\n');
        var hasSpread = (0, has_1.has)(json, function (node) { return (0, lodash_1.some)(node.bindings, { type: 'spread' }); });
        if (options.prettier !== false) {
            try {
                css = (0, standalone_1.format)(css, {
                    parser: 'css',
                    plugins: [require('prettier/parser-postcss')],
                });
            }
            catch (err) {
                console.warn('Could not format css', err);
            }
            try {
                html = (0, standalone_1.format)(html, {
                    parser: 'html',
                    plugins: [require('prettier/parser-html')],
                });
            }
            catch (err) {
                // If can't format HTML (this can happen with lit given it is tagged template strings),
                // at least remove excess space
                html = html.replace(/\n{3,}/g, '\n\n');
            }
        }
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    import { LitElement, html, css } from 'lit';\n    import { customElement, property, state, query } from 'lit/decorators.js';\n\n    ", "\n    ", "\n\n    @customElement('", "')\n    export default class ", " extends LitElement {\n      ", "\n\n      ", "\n\n      ", "\n    \n  \n      ", "\n\n        ", "\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    \n      render() {\n        return html`\n          ", "\n          ", "\n        `\n      }\n    }\n  "], ["\n    ", "\n    import { LitElement, html, css } from 'lit';\n    import { customElement, property, state, query } from 'lit/decorators.js';\n\n    ", "\n    ", "\n\n    @customElement('", "')\n    export default class ", " extends LitElement {\n      ", "\n\n      ", "\n\n      ", "\n    \n  \n      ", "\n\n        ", "\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    \n      render() {\n        return html\\`\n          ", "\n          ", "\n        \\`\n      }\n    }\n  "])), (0, render_imports_1.renderPreComponent)({ component: json, target: 'lit' }), json.types ? json.types.join('\n') : '', hasSpread
            ? "\n      const spread = (properties) =>\n        directive((part) => {\n          for (const property in properties) {\n            const value = properties[attr];\n            part.element[property] = value;\n          }\n        });\n    "
            : '', ((_b = json.meta.useMetadata) === null || _b === void 0 ? void 0 : _b.tagName) || getCustomTagName(json.name, options), json.name, options.useShadowDom
            ? ''
            : "\n        createRenderRoot() {\n          return this;\n        }\n        ", options.useShadowDom && css.length
            ? "static styles = css`\n      ".concat((0, indent_1.indent)(css, 8), "`;")
            : '', Array.from(domRefs)
            .map(function (refName) { return "\n          @query('[ref=\"".concat(refName, "\"]')\n          ").concat((0, lodash_1.camelCase)(refName), "!: HTMLElement;\n          "); })
            .join('\n'), Array.from(props)
            .map(function (item) { return "@property() ".concat(item, ": any"); })
            .join('\n'), dataString, methodsString, !((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : "connectedCallback() { ".concat(processBinding(json.hooks.onMount.code), " }"), !((_d = json.hooks.onUnMount) === null || _d === void 0 ? void 0 : _d.code)
            ? ''
            : "disconnectedCallback() { ".concat(processBinding(json.hooks.onUnMount.code), " }"), !((_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.length)
            ? ''
            : "updated() { \n              ".concat(json.hooks.onUpdate.map(function (hook) { return processBinding(hook.code); }).join('\n\n'), " \n            }"), options.useShadowDom || !css.length ? '' : "<style>".concat(css, "</style>"), (0, indent_1.indent)(html, 8));
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'typescript',
                    plugins: [require('prettier/parser-typescript')],
                });
            }
            catch (err) {
                console.warn('Could not format Lit typescript', err);
            }
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToLit = componentToLit;
var templateObject_1;
