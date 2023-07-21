"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToLiquid = exports.isValidLiquidBinding = void 0;
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../constants/html_tags");
var fast_clone_1 = require("../helpers/fast-clone");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var collect_css_1 = require("../helpers/styles/collect-css");
var plugins_1 = require("../modules/plugins");
var mitosis_node_1 = require("../types/mitosis-node");
/**
 * Test if the binding expression would be likely to generate
 * valid or invalid liquid. If we generate invalid liquid tags
 * Shopify will reject our PUT to update the template
 */
var isValidLiquidBinding = function (str) {
    if (str === void 0) { str = ''; }
    var strictMatches = Boolean(
    // Test for our `context.shopify.liquid.*(expression), which
    // we regex out later to transform back into valid liquid expressions
    str.match(/(context|ctx)\s*(\.shopify\s*)?\.liquid\s*\./));
    return (strictMatches ||
        // Test is the expression is simple and would map to Shopify bindings	    // Test for our `context.shopify.liquid.*(expression), which
        // e.g. `state.product.price` -> `{{product.price}}	    // we regex out later to transform back into valid liquid expressions
        Boolean(str.match(/^[a-z0-9_\.\s]+$/i)));
};
exports.isValidLiquidBinding = isValidLiquidBinding;
var mappers = {
    Fragment: function (json, options) {
        return "<div>".concat(json.children.map(function (item) { return blockToLiquid(item, options); }).join('\n'), "</div>");
    },
};
// TODO: spread support
var blockToLiquid = function (json, options) {
    var _a, _b, _c, _d, _e, _f;
    if (options === void 0) { options = {}; }
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    // TODO: Add support for `{props.children}` bindings
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        if (!(0, exports.isValidLiquidBinding)(json.bindings._text.code)) {
            return '';
        }
        return "{{".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._text.code), "}}");
    }
    var str = '';
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        if (!((0, exports.isValidLiquidBinding)((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code) && (0, exports.isValidLiquidBinding)(json.scope.forName))) {
            return str;
        }
        str += "{% for ".concat(json.scope.forName, " in ").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code), " %}");
        if (json.children) {
            str += json.children.map(function (item) { return blockToLiquid(item, options); }).join('\n');
        }
        str += '{% endfor %}';
    }
    else if (json.name === 'Show') {
        if (!(0, exports.isValidLiquidBinding)((_d = json.bindings.when) === null || _d === void 0 ? void 0 : _d.code)) {
            return str;
        }
        str += "{% if ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_e = json.bindings.when) === null || _e === void 0 ? void 0 : _e.code), " %}");
        if (json.children) {
            str += json.children.map(function (item) { return blockToLiquid(item, options); }).join('\n');
        }
        str += '{% endif %}';
    }
    else {
        str += "<".concat(json.name, " ");
        if (((_f = json.bindings._spread) === null || _f === void 0 ? void 0 : _f.code) === '_spread' &&
            (0, exports.isValidLiquidBinding)(json.bindings._spread.code)) {
            str += "\n          {% for _attr in ".concat(json.bindings._spread.code, " %}\n            {{ _attr[0] }}=\"{{ _attr[1] }}\"\n          {% endfor %}\n        ");
        }
        for (var key in json.properties) {
            var value = json.properties[key];
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        for (var key in json.bindings) {
            if (key === '_spread' || key === 'ref' || key === 'css') {
                continue;
            }
            var value = json.bindings[key].code;
            // TODO: proper babel transform to replace. Util for this
            var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value);
            if (key.startsWith('on')) {
                // Do nothing
            }
            else if ((0, exports.isValidLiquidBinding)(useValue)) {
                str += " ".concat(key, "=\"{{").concat(useValue, "}}\" ");
            }
        }
        if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children.map(function (item) { return blockToLiquid(item, options); }).join('\n');
        }
        str += "</".concat(json.name, ">");
    }
    return str;
};
// TODO: add JS support similar to componentToHtml()
var componentToLiquid = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var css = (0, collect_css_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var str = json.children.map(function (item) { return blockToLiquid(item); }).join('\n');
        if (css.trim().length) {
            str += "<style>".concat(css, "</style>");
        }
        if (options.reactive) {
            var stateObjectString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json);
            if (stateObjectString.trim().length > 4) {
                str += "<script reactive>\n        export default {\n          state: ".concat(stateObjectString, "\n        }\n      </script>");
            }
        }
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'html',
                    htmlWhitespaceSensitivity: 'ignore',
                    plugins: [
                        // To support running in browsers
                        require('prettier/parser-html'),
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
exports.componentToLiquid = componentToLiquid;
