"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToStencil = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var render_imports_1 = require("../../helpers/render-imports");
var jsx_1 = require("../../parsers/jsx");
var plugins_1 = require("../../modules/plugins");
var fast_clone_1 = require("../../helpers/fast-clone");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var collect_class_string_1 = require("./collect-class-string");
var get_props_1 = require("../../helpers/get-props");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var dash_case_1 = require("../../helpers/dash-case");
var collect_styles_1 = require("../../helpers/collect-styles");
var blockToStencil = function (json, options) {
    if (options === void 0) { options = {}; }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        return "{".concat(processBinding(json.bindings._text), "}");
    }
    if (json.name === 'For') {
        var wrap = json.children.length !== 1;
        return "{".concat(processBinding(json.bindings.each), "?.map((").concat(json.properties._forName, ", index) => (\n      ").concat(wrap ? '<>' : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToStencil(item, options); })
            .join('\n')).concat(wrap ? '</>' : '', "\n    ))}");
    }
    else if (json.name === 'Show') {
        var wrap = json.children.length !== 1;
        return "{".concat(processBinding(json.bindings.when), " ? (\n      ").concat(wrap ? '<>' : '').concat(json.children
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
            str += " ".concat(useKey, "={event => ").concat(processBinding(value), "} ");
        }
        else {
            str += " ".concat(key, "={").concat(processBinding(value), "} ");
        }
    }
    if (jsx_1.selfClosingTags.has(json.name)) {
        return str + ' />';
    }
    str += '>';
    if (json.children) {
        str += json.children
            .map(function (item) { return blockToStencil(item, options); })
            .join('\n');
    }
    str += "</".concat(json.name, ">");
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
function processBinding(code) {
    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, { replaceWith: 'this.' });
}
var componentToStencil = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c;
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var props = (0, get_props_1.getProps)(component);
        var css = (0, collect_styles_1.collectCss)(json, { classProperty: 'class' });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
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
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    import { Component, Prop, h, State, Fragment } from '@stencil/core';\n\n    @Component({\n      tag: '", "',\n    })\n    export default class ", " {\n    \n      ", "\n\n        ", "\n        ", "\n      \n        ", "\n    \n      render() {\n        return <>\n        \n          ", "\n\n          <style>{`", "`}</style>\n        </>\n      }\n    }\n  "], ["\n    ", "\n\n    import { Component, Prop, h, State, Fragment } from '@stencil/core';\n\n    @Component({\n      tag: '"
            /**
             * You can set the tagName in your Mitosis component as
             *
             *    useMetadata({
             *      tagName: 'my-tag
             *    })
             *
             *    export default function ...
             */
            , "',\n    })\n    export default class ", " {\n    \n      ", "\n\n        ", "\n        ", "\n      \n        ", "\n    \n      render() {\n        return <>\n        \n          ", "\n\n          <style>{\\`", "\\`}</style>\n        </>\n      }\n    }\n  "])), (0, render_imports_1.renderPreComponent)(json), 
        /**
         * You can set the tagName in your Mitosis component as
         *
         *    useMetadata({
         *      tagName: 'my-tag
         *    })
         *
         *    export default function ...
         */
        ((_b = json.meta.metadataHook) === null || _b === void 0 ? void 0 : _b.tagName) || (0, dash_case_1.dashCase)(json.name), json.name, Array.from(props)
            .map(function (item) { return "@Prop() ".concat(item, ": any"); })
            .join('\n'), dataString, methodsString, !((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : "componentDidLoad() { ".concat(processBinding(json.hooks.onMount.code), " }"), json.children
            .map(function (item) { return blockToStencil(item, options); })
            .join('\n'), css);
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
exports.componentToStencil = componentToStencil;
var templateObject_1;
