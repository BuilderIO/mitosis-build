"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToLiquid = exports.isValidLiquidBinding = void 0;
var standalone_1 = require("prettier/standalone");
var collect_styles_1 = require("../helpers/collect-styles");
var fast_clone_1 = require("../helpers/fast-clone");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var jsx_1 = require("../parsers/jsx");
var plugins_1 = require("../modules/plugins");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
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
        return "<div>".concat(json.children
            .map(function (item) { return blockToLiquid(item, options); })
            .join('\n'), "</div>");
    },
};
// TODO: spread support
var blockToLiquid = function (json, options) {
    if (options === void 0) { options = {}; }
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    // TODO: Add support for `{props.children}` bindings
    if (json.properties._text) {
        return json.properties._text;
    }
    if (json.bindings._text) {
        if (!(0, exports.isValidLiquidBinding)(json.bindings._text)) {
            return '';
        }
        return "{{".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._text), "}}");
    }
    var str = '';
    if (json.name === 'For') {
        if (!((0, exports.isValidLiquidBinding)(json.bindings.each) &&
            (0, exports.isValidLiquidBinding)(json.properties._forName))) {
            return str;
        }
        str += "{% for ".concat(json.properties._forName, " in ").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.each), " %}");
        if (json.children) {
            str += json.children
                .map(function (item) { return blockToLiquid(item, options); })
                .join('\n');
        }
        str += '{% endfor %}';
    }
    else if (json.name === 'Show') {
        if (!(0, exports.isValidLiquidBinding)(json.bindings.when)) {
            return str;
        }
        str += "{% if ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.when), " %}");
        if (json.children) {
            str += json.children
                .map(function (item) { return blockToLiquid(item, options); })
                .join('\n');
        }
        str += '{% endif %}';
    }
    else {
        str += "<".concat(json.name, " ");
        if (json.bindings._spread === '_spread' &&
            (0, exports.isValidLiquidBinding)(json.bindings._spread)) {
            str += "\n          {% for _attr in ".concat(json.bindings._spread, " %}\n            {{ _attr[0] }}=\"{{ _attr[1] }}\"\n          {% endfor %}\n        ");
        }
        for (var key in json.properties) {
            var value = json.properties[key];
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        for (var key in json.bindings) {
            if (key === '_spread' || key === 'ref' || key === 'css') {
                continue;
            }
            var value = json.bindings[key];
            // TODO: proper babel transform to replace. Util for this
            var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value);
            if (key.startsWith('on')) {
                // Do nothing
            }
            else if ((0, exports.isValidLiquidBinding)(useValue)) {
                str += " ".concat(key, "=\"{{").concat(useValue, "}}\" ");
            }
        }
        if (jsx_1.selfClosingTags.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children
                .map(function (item) { return blockToLiquid(item, options); })
                .join('\n');
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
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var css = (0, collect_styles_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
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
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
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
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        return str;
    };
};
exports.componentToLiquid = componentToLiquid;
