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
exports.componentToBuilder = exports.blockToBuilder = void 0;
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var media_sizes_1 = require("../constants/media-sizes");
var dedent_1 = require("../helpers/dedent");
var fast_clone_1 = require("../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../helpers/filter-empty-text-nodes");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var has_props_1 = require("../helpers/has-props");
var is_component_1 = require("../helpers/is-component");
var is_upper_case_1 = require("../helpers/is-upper-case");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var state_1 = require("../helpers/state");
var builder_1 = require("../parsers/builder");
var symbol_processor_1 = require("../symbols/symbol-processor");
var omitMetaProperties = function (obj) {
    return (0, lodash_1.omitBy)(obj, function (_value, key) { return key.startsWith('$'); });
};
var builderBlockPrefixes = ['Amp', 'Core', 'Builder', 'Raw', 'Form'];
var mapComponentName = function (name) {
    if (name === 'CustomCode') {
        return 'Custom Code';
    }
    for (var _i = 0, builderBlockPrefixes_1 = builderBlockPrefixes; _i < builderBlockPrefixes_1.length; _i++) {
        var prefix = builderBlockPrefixes_1[_i];
        if (name.startsWith(prefix)) {
            var suffix = name.replace(prefix, '');
            if ((0, is_upper_case_1.isUpperCase)(suffix[0])) {
                return "".concat(prefix, ":").concat(name.replace(prefix, ''));
            }
        }
    }
    return name;
};
var componentMappers = __assign(__assign({}, (!builder_1.symbolBlocksAsChildren
    ? {}
    : {
        Symbol: function (node, options) {
            var child = node.children[0];
            var symbolOptions = (node.bindings.symbol && json5_1.default.parse(node.bindings.symbol.code)) || {};
            if (child) {
                (0, lodash_1.set)(symbolOptions, 'content.data.blocks', child.children.map(function (item) { return (0, exports.blockToBuilder)(item, options); }));
            }
            return el({
                component: {
                    name: 'Symbol',
                    options: {
                        // TODO: forward other symbol options
                        symbol: symbolOptions,
                    },
                },
            }, options);
        },
    })), { Columns: function (node, options) {
        var block = (0, exports.blockToBuilder)(node, options, { skipMapper: true });
        var columns = block.children.map(function (item) { return ({
            blocks: item.children,
        }); });
        block.component.options.columns = columns;
        block.children = [];
        return block;
    }, For: function (_node, options) {
        var _a;
        var node = _node;
        return el({
            component: {
                name: 'Core:Fragment',
            },
            repeat: {
                collection: (_a = node.bindings.each) === null || _a === void 0 ? void 0 : _a.code,
                itemName: node.scope.forName,
            },
            children: node.children
                .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
                .map(function (node) { return (0, exports.blockToBuilder)(node, options); }),
        }, options);
    }, Show: function (node, options) {
        var _a;
        return el({
            // TODO: the reverse mapping for this
            component: {
                name: 'Core:Fragment',
            },
            bindings: {
                show: (_a = node.bindings.when) === null || _a === void 0 ? void 0 : _a.code,
            },
            children: node.children
                .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
                .map(function (node) { return (0, exports.blockToBuilder)(node, options); }),
        }, options);
    } });
var el = function (options, toBuilderOptions) { return (__assign(__assign({ '@type': '@builder.io/sdk:Element' }, (toBuilderOptions.includeIds && {
    id: 'builder-' + (0, symbol_processor_1.hashCodeAsString)(options),
})), options)); };
function tryFormat(code) {
    var str = code;
    try {
        str = (0, standalone_1.format)(str, {
            parser: 'babel',
            plugins: [
                require('prettier/parser-babel'), // To support running in browsers
            ],
        });
    }
    catch (err) {
        console.error('Format error for code:', str);
        throw err;
    }
    return str;
}
var blockToBuilder = function (json, options, _internalOptions) {
    var _a;
    var _b, _c, _d, _e, _f, _g;
    if (options === void 0) { options = {}; }
    if (_internalOptions === void 0) { _internalOptions = {}; }
    var mapper = !_internalOptions.skipMapper && componentMappers[json.name];
    if (mapper) {
        return mapper(json, options);
    }
    if (json.properties._text || ((_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code)) {
        return el({
            tagName: 'span',
            bindings: __assign({}, (((_c = json.bindings._text) === null || _c === void 0 ? void 0 : _c.code)
                ? {
                    'component.options.text': json.bindings._text.code,
                    'json.bindings._text.code': undefined,
                }
                : {})),
            component: {
                name: 'Text',
                options: {
                    text: json.properties._text,
                },
            },
        }, options);
    }
    var thisIsComponent = (0, is_component_1.isComponent)(json);
    var bindings = json.bindings;
    var actions = {};
    for (var key in bindings) {
        var eventBindingKeyRegex = /^on([A-Z])/;
        var firstCharMatchForEventBindingKey = (_d = key.match(eventBindingKeyRegex)) === null || _d === void 0 ? void 0 : _d[1];
        if (firstCharMatchForEventBindingKey) {
            actions[key.replace(eventBindingKeyRegex, firstCharMatchForEventBindingKey.toLowerCase())] =
                (0, remove_surrounding_block_1.removeSurroundingBlock)((_e = bindings[key]) === null || _e === void 0 ? void 0 : _e.code);
            delete bindings[key];
        }
    }
    var builderBindings = {};
    var componentOptions = omitMetaProperties(json.properties);
    if (thisIsComponent) {
        var _loop_1 = function (key) {
            if (key === 'css') {
                return "continue";
            }
            var value = bindings[key];
            var parsed = (0, lodash_1.attempt)(function () { return json5_1.default.parse(value === null || value === void 0 ? void 0 : value.code); });
            if (!(parsed instanceof Error)) {
                componentOptions[key] = parsed;
            }
            else {
                builderBindings["component.options.".concat(key)] = bindings[key].code;
            }
        };
        for (var key in bindings) {
            _loop_1(key);
        }
    }
    var hasCss = !!((_f = bindings.css) === null || _f === void 0 ? void 0 : _f.code);
    var responsiveStyles = {
        large: {},
    };
    if (hasCss) {
        var cssRules = json5_1.default.parse((_g = bindings.css) === null || _g === void 0 ? void 0 : _g.code);
        var cssRuleKeys = Object.keys(cssRules);
        for (var _i = 0, cssRuleKeys_1 = cssRuleKeys; _i < cssRuleKeys_1.length; _i++) {
            var ruleKey = cssRuleKeys_1[_i];
            var mediaQueryMatch = ruleKey.match(media_sizes_1.mediaQueryRegex);
            if (mediaQueryMatch) {
                var fullmatch = mediaQueryMatch[0], pixelSize = mediaQueryMatch[1];
                var sizeForWidth = media_sizes_1.sizes.getSizeForWidth(Number(pixelSize));
                var currentSizeStyles = responsiveStyles[sizeForWidth] || {};
                responsiveStyles[sizeForWidth] = __assign(__assign({}, currentSizeStyles), cssRules[ruleKey]);
            }
            else {
                responsiveStyles.large = __assign(__assign({}, responsiveStyles.large), (_a = {}, _a[ruleKey] = cssRules[ruleKey], _a));
            }
        }
        delete json.bindings.css;
    }
    if (thisIsComponent) {
        for (var key in json.bindings) {
            builderBindings["component.options.".concat(key)] = json.bindings[key].code;
        }
    }
    return el(__assign(__assign(__assign(__assign({ tagName: thisIsComponent ? undefined : json.name }, (hasCss && {
        responsiveStyles: responsiveStyles,
    })), { layerName: json.properties.$name }), (thisIsComponent && {
        component: {
            name: mapComponentName(json.name),
            options: componentOptions,
        },
    })), { code: {
            bindings: builderBindings,
            actions: actions,
        }, properties: thisIsComponent ? undefined : omitMetaProperties(json.properties), bindings: thisIsComponent
            ? builderBindings
            : (0, lodash_1.omit)((0, lodash_1.mapValues)(bindings, function (value) { return value === null || value === void 0 ? void 0 : value.code; }), 'css'), actions: actions, children: json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (child) { return (0, exports.blockToBuilder)(child, options); }) }), options);
};
exports.blockToBuilder = blockToBuilder;
var componentToBuilder = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c, _d, _e;
        var component = _a.component;
        var hasState = (0, state_1.checkHasState)(component);
        var result = (0, fast_clone_1.fastClone)({
            data: {
                httpRequests: (_c = (_b = component === null || component === void 0 ? void 0 : component.meta) === null || _b === void 0 ? void 0 : _b.useMetadata) === null || _c === void 0 ? void 0 : _c.httpRequests,
                jsCode: tryFormat((0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        ", "\n\n        ", "\n        \n        ", "\n      "], ["\n        ", "\n\n        ", "\n        \n        ", "\n      "])), !(0, has_props_1.hasProps)(component) ? '' : "var props = state;", !hasState ? '' : "Object.assign(state, ".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(component), ");"), !((_d = component.hooks.onMount) === null || _d === void 0 ? void 0 : _d.code) ? '' : component.hooks.onMount.code)),
                tsCode: tryFormat((0, dedent_1.dedent)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        ", "\n\n        ", "\n\n        ", "\n      "], ["\n        ", "\n\n        ", "\n\n        ", "\n      "])), !(0, has_props_1.hasProps)(component) ? '' : "var props = state;", !hasState ? '' : "useState(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(component), ");"), !((_e = component.hooks.onMount) === null || _e === void 0 ? void 0 : _e.code)
                    ? ''
                    : "onMount(() => {\n                ".concat(component.hooks.onMount.code, "\n              })"))),
                blocks: component.children
                    .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
                    .map(function (child) { return (0, exports.blockToBuilder)(child, options); }),
            },
        });
        var subComponentMap = {};
        for (var _i = 0, _f = component.subComponents; _i < _f.length; _i++) {
            var subComponent = _f[_i];
            var name_1 = subComponent.name;
            subComponentMap[name_1] = (0, exports.componentToBuilder)(options)({
                component: subComponent,
            });
        }
        (0, traverse_1.default)([result, subComponentMap]).forEach(function (el) {
            var _a;
            if ((0, builder_1.isBuilderElement)(el)) {
                var value = subComponentMap[(_a = el.component) === null || _a === void 0 ? void 0 : _a.name];
                if (value) {
                    (0, lodash_1.set)(el, 'component.options.symbol.content', value);
                }
            }
        });
        return result;
    };
};
exports.componentToBuilder = componentToBuilder;
var templateObject_1, templateObject_2;
