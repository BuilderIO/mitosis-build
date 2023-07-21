"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToAlpine = exports.isValidAlpineBinding = exports.checkIsComponentNode = void 0;
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../../constants/html_tags");
var babel_transform_1 = require("../../helpers/babel-transform");
var dash_case_1 = require("../../helpers/dash-case");
var fast_clone_1 = require("../../helpers/fast-clone");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var merge_options_1 = require("../../helpers/merge-options");
var remove_surrounding_block_1 = require("../../helpers/remove-surrounding-block");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var collect_css_1 = require("../../helpers/styles/collect-css");
var plugins_1 = require("../../modules/plugins");
var mitosis_node_1 = require("../../types/mitosis-node");
var render_mount_hook_1 = require("./render-mount-hook");
var render_update_hooks_1 = require("./render-update-hooks");
var checkIsComponentNode = function (node) {
    return node.name === '@builder.io/mitosis/component';
};
exports.checkIsComponentNode = checkIsComponentNode;
/**
 * Test if the binding expression would be likely to generate
 * valid or invalid liquid. If we generate invalid liquid tags
 * Shopify will reject our PUT to update the template
 */
var isValidAlpineBinding = function (str) {
    if (str === void 0) { str = ''; }
    return true;
    /*
    const strictMatches = Boolean(
      // Test for our `context.shopify.liquid.*(expression), which
      // we regex out later to transform back into valid liquid expressions
      str.match(/(context|ctx)\s*(\.shopify\s*)?\.liquid\s*\./),
    );
  
    return (
      strictMatches ||
      // Test is the expression is simple and would map to Shopify bindings	    // Test for our `context.shopify.liquid.*(expression), which
      // e.g. `state.product.price` -> `{{product.price}}	    // we regex out later to transform back into valid liquid expressions
      Boolean(str.match(/^[a-z0-9_\.\s]+$/i))
    );
    */
};
exports.isValidAlpineBinding = isValidAlpineBinding;
var removeOnFromEventName = function (str) { return str.replace(/^on/, ''); };
var removeTrailingSemicolon = function (str) { return str.replace(/;$/, ''); };
var trim = function (str) { return str.trim(); };
var replaceInputRefs = (0, lodash_1.curry)(function (json, str) {
    (0, get_refs_1.getRefs)(json).forEach(function (value) {
        str = str.replaceAll(value, "this.$refs.".concat(value));
    });
    return str;
});
var replaceStateWithThis = function (str) { return str.replaceAll('state.', 'this.'); };
var getStateObjectString = function (json) {
    return (0, lodash_1.flow)(get_state_object_string_1.getStateObjectStringFromComponent, trim, replaceInputRefs(json), (0, render_mount_hook_1.renderMountHook)(json), (0, render_update_hooks_1.renderUpdateHooks)(json), replaceStateWithThis)(json);
};
var bindEventHandlerKey = (0, lodash_1.flowRight)(dash_case_1.dashCase, removeOnFromEventName);
var bindEventHandlerValue = (0, lodash_1.flowRight)(function (x) {
    return (0, replace_identifiers_1.replaceIdentifiers)({
        code: x,
        from: 'event',
        to: '$event',
    });
}, removeTrailingSemicolon, trim, remove_surrounding_block_1.removeSurroundingBlock, strip_state_and_props_refs_1.stripStateAndPropsRefs);
var bindEventHandler = function (_a) {
    var useShorthandSyntax = _a.useShorthandSyntax;
    return function (eventName, code) {
        var bind = useShorthandSyntax ? '@' : 'x-on:';
        return " ".concat(bind).concat(bindEventHandlerKey(eventName), "=\"").concat(bindEventHandlerValue(code).trim(), "\"");
    };
};
var mappers = {
    For: function (json, options) {
        var _a, _b, _c;
        return !((0, mitosis_node_1.checkIsForNode)(json) &&
            (0, exports.isValidAlpineBinding)((_a = json.bindings.each) === null || _a === void 0 ? void 0 : _a.code) &&
            (0, exports.isValidAlpineBinding)(json.scope.forName))
            ? ''
            : "<template x-for=\"".concat(json.scope.forName, " in ").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code), "\">\n    ").concat(((_c = json.children) !== null && _c !== void 0 ? _c : []).map(function (item) { return blockToAlpine(item, options); }).join('\n'), "\n    </template>");
    },
    Fragment: function (json, options) { return blockToAlpine(__assign(__assign({}, json), { name: 'div' }), options); },
    Show: function (json, options) {
        var _a, _b, _c;
        return !(0, exports.isValidAlpineBinding)((_a = json.bindings.when) === null || _a === void 0 ? void 0 : _a.code)
            ? ''
            : "<template x-if=\"".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_b = json.bindings.when) === null || _b === void 0 ? void 0 : _b.code), "\">\n    ").concat(((_c = json.children) !== null && _c !== void 0 ? _c : []).map(function (item) { return blockToAlpine(item, options); }).join('\n'), "\n    </template>");
    },
};
// TODO: spread support
var blockToAlpine = function (json, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    // TODO: Add support for `{props.children}` bindings
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        return (0, exports.isValidAlpineBinding)(json.bindings._text.code)
            ? "<span x-html=\"".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._text.code), "\"></span>")
            : '';
    }
    var str = "<".concat(json.name, " ");
    /*
    // Copied from the liquid generator. Not sure what it does.
    if (
      json.bindings._spread?.code === '_spread' &&
      isValidAlpineBinding(json.bindings._spread.code)
    ) {
      str += `
            <template x-for="_attr in ${json.bindings._spread.code}">
              {{ _attr[0] }}="{{ _attr[1] }}"
            </template>
          `;
    }
    */
    for (var key in json.properties) {
        var value = json.properties[key];
        str += " ".concat(key, "=\"").concat(value, "\" ");
    }
    for (var key in json.bindings) {
        if (key === '_spread' || key === 'css') {
            continue;
        }
        var _c = json.bindings[key], value = _c.code, bindingType = _c.type;
        // TODO: proper babel transform to replace. Util for this
        var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value);
        if (key.startsWith('on')) {
            str += bindEventHandler(options)(key, value);
        }
        else if (key === 'ref') {
            str += " x-ref=\"".concat(useValue, "\"");
        }
        else if ((0, exports.isValidAlpineBinding)(useValue)) {
            var bind = options.useShorthandSyntax && bindingType !== 'spread' ? ':' : 'x-bind:';
            str += " ".concat(bind).concat(bindingType === 'spread' ? '' : key, "=\"").concat(useValue, "\" ").replace(':=', '=');
        }
    }
    return html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)
        ? "".concat(str, " />")
        : "".concat(str, ">").concat(((_b = json.children) !== null && _b !== void 0 ? _b : []).map(function (item) { return blockToAlpine(item, options); }).join('\n'), "</").concat(json.name, ">");
};
var componentToAlpine = function (_options) {
    if (_options === void 0) { _options = {}; }
    return function (_a) {
        var component = _a.component;
        var options = (0, merge_options_1.initializeOptions)({ target: 'alpine', component: component, defaults: _options });
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var css = (0, collect_css_1.collectCss)(json);
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var componentName = (0, lodash_1.camelCase)(json.name) || 'MyComponent';
        var stateObjectString = getStateObjectString(json);
        // Set x-data on root element
        json.children[0].properties['x-data'] = options.inlineState
            ? stateObjectString
            : "".concat(componentName, "()");
        if ((0, render_update_hooks_1.hasRootUpdateHook)(json)) {
            json.children[0].properties['x-effect'] = 'onUpdate';
        }
        var str = css.trim().length ? "<style>".concat(css, "</style>") : '';
        str += json.children.map(function (item) { return blockToAlpine(item, options); }).join('\n');
        if (!options.inlineState) {
            str += "<script>\n          ".concat((0, babel_transform_1.babelTransformCode)("document.addEventListener('alpine:init', () => {\n              Alpine.data('".concat(componentName, "', () => (").concat(stateObjectString, "))\n          })")), "\n        </script>");
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
exports.componentToAlpine = componentToAlpine;
