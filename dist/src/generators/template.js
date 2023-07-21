"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToTemplate = void 0;
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../constants/html_tags");
var dedent_1 = require("../helpers/dedent");
var fast_clone_1 = require("../helpers/fast-clone");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var collect_css_1 = require("../helpers/styles/collect-css");
var plugins_1 = require("../modules/plugins");
var mitosis_node_1 = require("../types/mitosis-node");
var mappers = {
    Fragment: function (json, options) {
        return "<div>".concat(json.children.map(function (item) { return blockToTemplate(item, options); }).join('\n'), "</div>");
    },
};
// TODO: spread support
var blockToTemplate = function (json, options) {
    var _a, _b, _c, _d, _e;
    if (options === void 0) { options = {}; }
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        return "${".concat((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code, "}");
    }
    var str = '';
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        str += "${".concat((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code, "?.map(").concat(json.scope.forName, " => `");
        if (json.children) {
            str += json.children.map(function (item) { return blockToTemplate(item, options); }).join('\n');
        }
        str += '`).join("")}';
    }
    else if (json.name === 'Show') {
        str += "${!(".concat((_c = json.bindings.when) === null || _c === void 0 ? void 0 : _c.code, ") ? '' : `");
        if (json.children) {
            str += json.children.map(function (item) { return blockToTemplate(item, options); }).join('\n');
        }
        str += '`}';
    }
    else {
        str += "<".concat(json.name, " ");
        // TODO: JS iteration or with helper
        // if (json.bindings._spread === '_spread') {
        //   str += `
        //       {% for _attr in ${json.bindings._spread} %}
        //         {{ _attr[0] }}="{{ _attr[1] }}"
        //       {% endfor %}
        //     `;
        // }
        for (var key in json.properties) {
            var value = json.properties[key];
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        for (var key in json.bindings) {
            if (((_d = json.bindings[key]) === null || _d === void 0 ? void 0 : _d.type) === 'spread' || key === 'ref' || key === 'css') {
                continue;
            }
            var value = (_e = json.bindings[key]) === null || _e === void 0 ? void 0 : _e.code;
            // TODO: proper babel transform to replace. Util for this
            var useValue = value;
            if (key.startsWith('on')) {
                // Do nothing
            }
            else {
                str += " ".concat(key, "=\"${").concat(useValue, "}\" ");
            }
        }
        if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children.map(function (item) { return blockToTemplate(item, options); }).join('\n');
        }
        str += "</".concat(json.name, ">");
    }
    return str;
};
// TODO: add JS support similar to componentToHtml()
var componentToTemplate = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var css = (0, collect_css_1.collectCss)(json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var str = json.children.map(function (item) { return blockToTemplate(item); }).join('\n');
        if (css.trim().length) {
            str += "<style>".concat(css, "</style>");
        }
        str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    export default function template(props) {\n      let state = ", "\n\n      return `", "`\n    }\n  \n  "], ["\n    export default function template(props) {\n      let state = ", "\n\n      return \\`", "\\`\n    }\n  \n  "])), (0, get_state_object_string_1.getStateObjectStringFromComponent)(json), str.replace(/\s+/g, ' '));
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'typescript',
                    htmlWhitespaceSensitivity: 'ignore',
                    plugins: [
                        // To support running in browsers
                        require('prettier/parser-typescript'),
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
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToTemplate = componentToTemplate;
var templateObject_1;
