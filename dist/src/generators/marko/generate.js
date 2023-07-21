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
exports.markoFormatHtml = exports.postprocessHtml = exports.preprocessHtml = exports.componentToMarko = void 0;
var hash_sum_1 = __importDefault(require("hash-sum"));
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../../constants/html_tags");
var dash_case_1 = require("../../helpers/dash-case");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var has_props_1 = require("../../helpers/has-props");
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
// Having issues with this, so off for now
var USE_MARKO_PRETTIER = false;
/**
 * Return the names of properties (basic literal values) on state
 */
function getStatePropertyNames(json) {
    return Object.keys(json.state).filter(function (key) { var _a; return ((_a = json.state[key]) === null || _a === void 0 ? void 0 : _a.type) === 'property'; });
}
var blockToMarko = function (json, options) {
    var _a, _b, _c, _d, _e;
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        return "${".concat(processBinding(options.component, (_b = json.bindings) === null || _b === void 0 ? void 0 : _b._text.code), "}");
    }
    if (json.name === 'Fragment') {
        return json.children.map(function (child) { return blockToMarko(child, options); }).join('\n');
    }
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        var forArguments = (0, for_1.getForArguments)(json).join(',');
        return "<for|".concat(forArguments, "| of=(").concat(processBinding(options.component, (_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code), ")>\n      ").concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToMarko(item, options); })
            .join('\n'), "\n    </for>");
    }
    else if (json.name === 'Show') {
        return "<if(".concat(processBinding(options.component, (_d = json.bindings.when) === null || _d === void 0 ? void 0 : _d.code), ")>\n      ").concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return blockToMarko(item, options); })
            .join('\n'), "</if>\n    ").concat(!json.meta.else ? '' : "<else>".concat(blockToMarko(json.meta.else, options), "</else>"));
    }
    var str = '';
    str += "<".concat(json.name, " ");
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        var _f = json.bindings[key], code = _f.code, _g = _f.arguments, cusArgs = _g === void 0 ? ['event'] : _g, type = _f.type;
        if (type === 'spread') {
            str += " ...(".concat(code, ") ");
        }
        else if (key === 'ref') {
            str += " key=\"".concat((0, lodash_1.camelCase)(code), "\" ");
        }
        else if (key.startsWith('on')) {
            var useKey = key === 'onChange' && json.name === 'input' ? 'onInput' : key;
            str += " ".concat((0, dash_case_1.dashCase)(useKey), "=(").concat(cusArgs.join(','), " => ").concat(processBinding(options.component, code), ") ");
        }
        else if (key !== 'innerHTML') {
            str += " ".concat(key, "=(").concat(processBinding(options.component, code), ") ");
        }
    }
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
        return str + ' />';
    }
    str += '>';
    if ((_e = json.bindings.innerHTML) === null || _e === void 0 ? void 0 : _e.code) {
        str += "$!{".concat(processBinding(options.component, json.bindings.innerHTML.code), "}");
    }
    if (json.children) {
        str += json.children.map(function (item) { return blockToMarko(item, options); }).join('\n');
    }
    str += "</".concat(json.name, ">");
    return str;
};
function processBinding(json, code, type) {
    if (type === void 0) { type = 'attribute'; }
    try {
        return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
            replaceWith: type === 'state' ? 'input.' : type === 'class' ? 'this.input.' : 'input.',
            includeProps: true,
            includeState: false,
        }), {
            replaceWith: function (key) {
                var isProperty = getStatePropertyNames(json).includes(key);
                if (isProperty) {
                    return (type === 'state' || type === 'class' ? 'this.state.' : 'state.') + key;
                }
                return (type === 'class' || type === 'state' ? 'this.' : 'component.') + key;
            },
            includeProps: false,
            includeState: true,
        });
    }
    catch (error) {
        console.error('Marko: could not process binding', code);
        return code;
    }
}
var componentToMarko = function (userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return function (_a) {
        var _b, _c, _d;
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        var options = (0, merge_options_1.initializeOptions)({
            target: 'marko',
            component: component,
            defaults: __assign(__assign({}, userOptions), { component: json }),
        });
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var css = (0, collect_css_1.collectCss)(json, {
            prefix: (0, hash_sum_1.default)(json),
        });
        var domRefs = (0, get_refs_1.getRefs)(json);
        (0, map_refs_1.mapRefs)(json, function (refName) { return "this.".concat((0, lodash_1.camelCase)(refName)); });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'object',
            data: true,
            functions: false,
            getters: false,
            valueMapper: function (code) { return processBinding(json, code, 'state'); },
        });
        var thisHasProps = (0, has_props_1.hasProps)(json);
        var methodsString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            data: false,
            functions: true,
            getters: true,
            valueMapper: function (code) { return processBinding(json, code, 'class'); },
        });
        var hasState = dataString.trim().length > 5;
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
        var jsString = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    class {\n        ", "\n\n        ", "\n\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    }\n  "], ["\n    ", "\n\n    class {\n        ", "\n\n        ", "\n\n        ", "\n      \n        ", "\n        ", "\n        ", "\n    }\n  "])), (0, render_imports_1.renderPreComponent)({ component: json, target: 'marko' }), methodsString, !hasState
            ? ''
            : "onCreate(".concat(thisHasProps ? 'input' : '', ") {\n          this.state = ").concat(dataString, "\n        }"), Array.from(domRefs)
            .map(function (refName) { return "get ".concat((0, lodash_1.camelCase)(refName), "() { \n            return this.getEl('").concat((0, lodash_1.camelCase)(refName), "')\n          }"); })
            .join('\n'), !((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code)
            ? ''
            : "onMount() { ".concat(processBinding(json, json.hooks.onMount.code, 'class'), " }"), !((_c = json.hooks.onUnMount) === null || _c === void 0 ? void 0 : _c.code)
            ? ''
            : "onDestroy() { ".concat(processBinding(json, json.hooks.onUnMount.code, 'class'), " }"), !((_d = json.hooks.onUpdate) === null || _d === void 0 ? void 0 : _d.length)
            ? ''
            : "onRender() { ".concat(json.hooks.onUpdate
                .map(function (hook) { return processBinding(json, hook.code, 'class'); })
                .join('\n\n'), " }"));
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
        htmlString = htmlString
            // Convert on-click=(...) -> on-click(...)
            .replace(/(on-[a-z]+)=\(/g, function (_match, group) { return group + '('; })
            // Fix a weird edge case where </if> becomes </if \n > which is invalid in marko
            .replace(/<\/([a-z]+)\s+>/gi, '</$1>');
        var finalStr = "\n".concat(jsString, "\n").concat(cssString, "\n").concat(htmlString, "\n    ")
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        if (options.plugins) {
            finalStr = (0, plugins_1.runPreCodePlugins)({ json: json, code: finalStr, plugins: options.plugins });
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
            finalStr = (0, plugins_1.runPostCodePlugins)({ json: json, code: finalStr, plugins: options.plugins });
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
        .replace(/<if _="([\s\S]+?)"\s*>/g, function (_match, group) {
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
