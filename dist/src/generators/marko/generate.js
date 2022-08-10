"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markoFormatHtml = exports.postprocessHtml = exports.preprocessHtml = exports.componentToMarko = void 0;
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var render_imports_1 = require("../../helpers/render-imports");
var jsx_1 = require("../../parsers/jsx");
var plugins_1 = require("../../modules/plugins");
var fast_clone_1 = require("../../helpers/fast-clone");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var collect_class_string_1 = require("../stencil/collect-class-string");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var collect_css_1 = require("../../helpers/styles/collect-css");
var indent_1 = require("../../helpers/indent");
var map_refs_1 = require("../../helpers/map-refs");
var dash_case_1 = require("../../helpers/dash-case");
// Having issues with this, so off for now
var USE_MARKO_PRETTIER = false;
var blockToMarko = function (json, options) {
    var _a, _b, _c, _d, _e;
    if (options === void 0) { options = {}; }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        return "${".concat(processBinding((_b = json.bindings) === null || _b === void 0 ? void 0 : _b._text.code), "}");
    }
    if (json.name === 'Fragment') {
        return json.children.map(function (child) { return blockToMarko(child, options); }).join('\n');
    }
    if (json.name === 'For') {
        return "<for|".concat(json.properties._forName, "| of=(").concat(processBinding((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code), ")>\n      ").concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToMarko(item, options); })
            .join('\n'), "\n    </for>");
    }
    else if (json.name === 'Show') {
        return "<if(".concat(processBinding((_d = json.bindings.when) === null || _d === void 0 ? void 0 : _d.code), ")>\n      ").concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToMarko(item, options); })
            .join('\n'), "</if>\n    ").concat(!json.meta.else ? '' : "<else>".concat(blockToMarko(json.meta.else, options), "</else>"));
    }
    var str = '';
    str += "<".concat(json.name, " ");
    var classString = (0, collect_class_string_1.collectClassString)(json);
    if (classString) {
        str += " class=".concat(classString, " ");
    }
    if ((_e = json.bindings._spread) === null || _e === void 0 ? void 0 : _e.code) {
        str += " ...(".concat(json.bindings._spread.code, ") ");
    }
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        var _f = json.bindings[key], code = _f.code, _g = _f.arguments, cusArgs = _g === void 0 ? ['event'] : _g;
        if (key === '_spread' || key === '_forName') {
            continue;
        }
        if (key === 'ref') {
            str += " ref=((el) => this.".concat(code, " = el) ");
        }
        else if (key.startsWith('on')) {
            var useKey = key === 'onChange' && json.name === 'input' ? 'onInput' : key;
            str += " ".concat((0, dash_case_1.dashCase)(useKey), "=(").concat(cusArgs.join(','), " => ").concat(processBinding(code), ") ");
        }
        else {
            str += " ".concat(key, "=(").concat(processBinding(code), ") ");
        }
    }
    if (jsx_1.selfClosingTags.has(json.name)) {
        return str + ' />';
    }
    str += '>';
    if (json.children) {
        str += json.children.map(function (item) { return blockToMarko(item, options); }).join('\n');
    }
    str += "</".concat(json.name, ">");
    return str;
};
function processBinding(code, type) {
    if (type === void 0) { type = 'attribute'; }
    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
        replaceWith: type === 'class' ? 'this.input.' : 'input.',
        includeProps: true,
        includeState: false,
    }), {
        replaceWith: type === 'class' ? 'this.state.' : 'state.',
        includeProps: false,
        includeState: true,
    });
}
var componentToMarko = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c, _d;
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var css = (0, collect_css_1.collectCss)(json);
        (0, map_refs_1.mapRefs)(component, function (refName) { return "this.".concat(refName); });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'object',
            data: true,
            functions: true,
            getters: true,
            valueMapper: function (code) { return processBinding(code, 'class'); },
        });
        var methodsString = '';
        var hasState = dataString.length > 5;
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
        var jsString = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    class {\n        ", "\n\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    }\n  "], ["\n    ", "\n\n    class {\n        ", "\n\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    }\n  "])), (0, render_imports_1.renderPreComponent)({ component: json, target: 'marko' }), methodsString, !hasState
            ? ''
            : "onCreate() {\n          this.state = ".concat(dataString, "\n        }"), !((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code)
            ? ''
            : "onMount() { ".concat(processBinding(json.hooks.onMount.code), " }"), !((_c = json.hooks.onUnMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : "onDestroy() { ".concat(processBinding(json.hooks.onUnMount.code), " }"), !((_d = json.hooks.onUpdate) === null || _d === void 0 ? void 0 : _d.length)
            ? ''
            : json.hooks.onUpdate.map(function (hook) { return "onRender() { ".concat(processBinding(hook.code), " }"); }));
        var htmlString = json.children.map(function (item) { return blockToMarko(item, options); }).join('\n');
        var cssString = css.length
            ? "style { \n  ".concat((0, indent_1.indent)(css, 2).trim(), "\n}")
            : '';
        if (options.prettier !== false && !USE_MARKO_PRETTIER) {
            try {
                htmlString = markoFormatHtml(htmlString);
            }
            catch (err) {
                console.warn('Could not format html', err);
            }
            try {
                jsString = (0, standalone_1.format)(jsString, {
                    parser: 'typescript',
                    plugins: [require('prettier/parser-typescript')],
                });
            }
            catch (err) {
                console.warn('Could not format js', err);
            }
        }
        // Convert on-click=(...) -> on-click(...)
        htmlString = htmlString.replace(/(on-[a-z]+)=\(/g, function (_match, group) { return group + '('; });
        var finalStr = "\n".concat(jsString, "\n").concat(cssString, "\n").concat(htmlString, "\n    ")
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        if (options.plugins) {
            finalStr = (0, plugins_1.runPreCodePlugins)(finalStr, options.plugins);
        }
        if (USE_MARKO_PRETTIER && options.prettier !== false) {
            // Commented out for now as there are strange module import issues as
            // a result, causing builds to fail
            // format(finalStr, {
            //   parser: 'marko',
            //   plugins: [require('prettier-plugin-marko')],
            // });
        }
        if (options.plugins) {
            finalStr = (0, plugins_1.runPostCodePlugins)(finalStr, options.plugins);
        }
        return finalStr;
    };
};
exports.componentToMarko = componentToMarko;
/**
 * Convert marko expressions to valid html
 *
 * <div on-click=(() => doSomething())> -> <div on-click="() => doSomething()">
 */
function preprocessHtml(htmlString) {
    return (htmlString
        // Convert <for|foo| to <for |foo|, otherwise HTML will think the tag is not just <for> and complain
        // when we close it with </for>
        .replace(/<for\|/g, '<for |')
        // Convert <if(foo) to <if _="foo", otherwise HTML will think the tag is not just <if> and complain
        // when we close it with </if>
        .replace(/<if\(([\s\S]+?)\)\s*>/g, function (_match, group) {
        return "<if _=\"".concat(encodeAttributeValue(group), "\">");
    })
        .replace(/=\(([\s\S]*?)\)(\s*[a-z\/>])/g, function (_match, group, after) {
        return "=\"(".concat(encodeAttributeValue(group), ")\"").concat(after);
    }));
}
exports.preprocessHtml = preprocessHtml;
/**
 * Convert HTML back to marko expressions
 *
 * <div on-click="() => doSomething()"> -> <div on-click=(() => doSomething())>
 */
function postprocessHtml(htmlString) {
    return htmlString
        .replace(/<for \|/g, '<for|')
        .replace(/<if _="([\s\S]+)"\s*>/g, function (_match, group) {
        return "<if(".concat(decodeAttributeValue(group), ")>");
    })
        .replace(/="\(([\s\S]*?)\)"(\s*[a-z\/>])/g, function (_match, group, after) {
        return "=(".concat(decodeAttributeValue(group), ")").concat(after);
    });
}
exports.postprocessHtml = postprocessHtml;
// Encode quotes and spaces for HTML attribute values
function encodeAttributeValue(value) {
    return value.replace(/"/g, '&quot;').replace(/\n/g, '&#10;');
}
// Decode quotes and spaces for HTML attribute values
function decodeAttributeValue(value) {
    return value.replace(/&quot;/g, '"').replace(/&#10;/g, '\n');
}
/**
 * Format Marko HTML using the built-in HTML parser for prettier,
 * given issues with Marko's plugin
 */
function markoFormatHtml(htmlString) {
    return postprocessHtml((0, standalone_1.format)(preprocessHtml(htmlString), {
        parser: 'html',
        plugins: [require('prettier/parser-html')],
    }));
}
exports.markoFormatHtml = markoFormatHtml;
var templateObject_1;