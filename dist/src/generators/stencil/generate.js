"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToStencil = void 0;
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../../constants/html_tags");
var dash_case_1 = require("../../helpers/dash-case");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var get_props_1 = require("../../helpers/get-props");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var indent_1 = require("../../helpers/indent");
var map_refs_1 = require("../../helpers/map-refs");
var merge_options_1 = require("../../helpers/merge-options");
var for_1 = require("../../helpers/nodes/for");
var render_imports_1 = require("../../helpers/render-imports");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var collect_css_1 = require("../../helpers/styles/collect-css");
var plugins_1 = require("../../modules/plugins");
var mitosis_node_1 = require("../../types/mitosis-node");
var collect_class_string_1 = require("./collect-class-string");
var blockToStencil = function (json, options) {
    var _a, _b, _c, _d;
    if (options === void 0) { options = {}; }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        return "{".concat(processBinding((_b = json.bindings) === null || _b === void 0 ? void 0 : _b._text.code), "}");
    }
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        var wrap = json.children.length !== 1;
        var forArgs = (0, for_1.getForArguments)(json).join(', ');
        return "{".concat(processBinding((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code), "?.map((").concat(forArgs, ") => (\n      ").concat(wrap ? '<>' : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToStencil(item, options); })
            .join('\n')).concat(wrap ? '</>' : '', "\n    ))}");
    }
    else if (json.name === 'Show') {
        var wrap = json.children.length !== 1;
        return "{".concat(processBinding((_d = json.bindings.when) === null || _d === void 0 ? void 0 : _d.code), " ? (\n      ").concat(wrap ? '<>' : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToStencil(item, options); })
            .join('\n')).concat(wrap ? '</>' : '', "\n    ) : ").concat(!json.meta.else ? 'null' : blockToStencil(json.meta.else, options), "}");
    }
    var str = '';
    str += "<".concat(json.name, " ");
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
            str += " {...(".concat(code, ")} ");
        }
        else if (key === 'ref') {
            str += " ref={(el) => this.".concat(code, " = el} ");
        }
        else if (key.startsWith('on')) {
            var useKey = key === 'onChange' && json.name === 'input' ? 'onInput' : key;
            str += " ".concat(useKey, "={").concat(cusArgs.join(','), " => ").concat(processBinding(code), "} ");
        }
        else {
            str += " ".concat(key, "={").concat(processBinding(code), "} ");
        }
    }
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
        return str + ' />';
    }
    str += '>';
    if (json.children) {
        str += json.children.map(function (item) { return blockToStencil(item, options); }).join('\n');
    }
    str += "</".concat(json.name, ">");
    return str;
};
function processBinding(code) {
    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, { replaceWith: 'this.' });
}
var componentToStencil = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var _b, _c, _d, _e;
        var component = _a.component;
        var options = (0, merge_options_1.initializeOptions)({ target: 'stencil', component: component, defaults: _options });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var props = (0, get_props_1.getProps)(component);
        var css = (0, collect_css_1.collectCss)(json);
        (0, map_refs_1.mapRefs)(component, function (refName) { return "this.".concat(refName); });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            data: true,
            functions: false,
            getters: false,
            keyPrefix: '@State() ',
            valueMapper: function (code) { return processBinding(code); },
        });
        var methodsString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            data: false,
            functions: true,
            getters: true,
            valueMapper: function (code) { return processBinding(code); },
        });
        var wrap = json.children.length !== 1;
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
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    import { Component, Prop, h, State, Fragment } from '@stencil/core';\n\n    @Component({\n      tag: '", "',\n      ", "\n    })\n    export default class ", " {\n    \n      ", "\n\n        ", "\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    \n      render() {\n        return (", "\n        \n          ", "\n\n        ", ")\n      }\n    }\n  "], ["\n    ", "\n\n    import { Component, Prop, h, State, Fragment } from '@stencil/core';\n\n    @Component({\n      tag: '"
            /**
             * You can set the tagName in your Mitosis component as
             *
             *    useMetadata({
             *      tagName: 'my-tag
             *    })
             *
             *    export default function ...
             */
            , "',\n      ", "\n    })\n    export default class ", " {\n    \n      ", "\n\n        ", "\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    \n      render() {\n        return (", "\n        \n          ", "\n\n        ", ")\n      }\n    }\n  "])), (0, render_imports_1.renderPreComponent)({ component: json, target: 'stencil' }), 
        /**
         * You can set the tagName in your Mitosis component as
         *
         *    useMetadata({
         *      tagName: 'my-tag
         *    })
         *
         *    export default function ...
         */
        ((_b = json.meta.useMetadata) === null || _b === void 0 ? void 0 : _b.tagName) || (0, dash_case_1.dashCase)(json.name), css.length
            ? "styles: `\n        ".concat((0, indent_1.indent)(css, 8), "`,")
            : '', json.name, Array.from(props)
            .map(function (item) { return "@Prop() ".concat(item, ": any"); })
            .join('\n'), dataString, methodsString, !((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : "componentDidLoad() { ".concat(processBinding(json.hooks.onMount.code), " }"), !((_d = json.hooks.onUnMount) === null || _d === void 0 ? void 0 : _d.code)
            ? ''
            : "disconnectedCallback() { ".concat(processBinding(json.hooks.onUnMount.code), " }"), !((_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.length)
            ? ''
            : json.hooks.onUpdate.map(function (hook) { return "componentDidUpdate() { ".concat(processBinding(hook.code), " }"); }), wrap ? '<>' : '', json.children.map(function (item) { return blockToStencil(item, options); }).join('\n'), wrap ? '</>' : '');
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            str = (0, standalone_1.format)(str, {
                parser: 'typescript',
                plugins: [require('prettier/parser-typescript')],
            });
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToStencil = componentToStencil;
var templateObject_1;
