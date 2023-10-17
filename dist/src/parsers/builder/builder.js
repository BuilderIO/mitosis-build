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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builderContentToMitosisComponent = exports.isBuilderElement = exports.createBuilderElement = exports.convertExportDefaultToReturn = exports.extractStateHook = exports.builderElementToMitosisNode = exports.symbolBlocksAsChildren = void 0;
var babel = __importStar(require("@babel/core"));
var generator_1 = __importDefault(require("@babel/generator"));
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var __1 = require("../..");
var media_sizes_1 = require("../../constants/media-sizes");
var bindings_1 = require("../../helpers/bindings");
var capitalize_1 = require("../../helpers/capitalize");
var create_mitosis_component_1 = require("../../helpers/create-mitosis-component");
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var fast_clone_1 = require("../../helpers/fast-clone");
var parsers_1 = require("../../helpers/parsers");
var jsx_1 = require("../jsx");
var state_1 = require("../jsx/state");
var helpers_1 = require("./helpers");
// Omit some superflous styles that can come from Builder's web importer
var styleOmitList = [
    'backgroundRepeatX',
    'backgroundRepeatY',
    'backgroundPositionX',
    'backgroundPositionY',
];
var getCssFromBlock = function (block) {
    var _a;
    var blockSizes = Object.keys(block.responsiveStyles || {}).filter(function (size) {
        return media_sizes_1.sizeNames.includes(size);
    });
    var css = {};
    for (var _i = 0, blockSizes_1 = blockSizes; _i < blockSizes_1.length; _i++) {
        var size = blockSizes_1[_i];
        if (size === 'large') {
            css = (0, lodash_1.omit)(__assign(__assign({}, css), (_a = block.responsiveStyles) === null || _a === void 0 ? void 0 : _a.large), styleOmitList);
        }
        else if (block.responsiveStyles && block.responsiveStyles[size]) {
            var mediaQueryKey = "@media (max-width: ".concat(media_sizes_1.sizes[size].max, "px)");
            css[mediaQueryKey] = (0, lodash_1.omit)(__assign(__assign({}, css[mediaQueryKey]), block.responsiveStyles[size]), styleOmitList);
        }
    }
    return css;
};
var verifyIsValid = function (code) {
    try {
        if (babel.parse(code)) {
            return { valid: true, error: null };
        }
    }
    catch (err) {
        return { valid: false, error: null };
    }
    return { valid: false, error: null };
};
var getActionBindingsFromBlock = function (block, options) {
    var _a;
    var actions = __assign(__assign({}, block.actions), (_a = block.code) === null || _a === void 0 ? void 0 : _a.actions);
    var bindings = {};
    var actionKeys = Object.keys(actions);
    if (actionKeys.length) {
        for (var _i = 0, actionKeys_1 = actionKeys; _i < actionKeys_1.length; _i++) {
            var key = actionKeys_1[_i];
            var value = actions[key];
            // Skip empty values
            if (!value.trim()) {
                continue;
            }
            var _b = verifyIsValid(value), error = _b.error, valid = _b.valid;
            if (!valid) {
                console.warn('Skipping invalid binding', error);
                continue;
            }
            var useKey = "on".concat((0, lodash_1.upperFirst)(key));
            bindings[useKey] = (0, bindings_1.createSingleBinding)({ code: "".concat(wrapBindingIfNeeded(value, options)) });
        }
    }
    return bindings;
};
var getStyleStringFromBlock = function (block, options) {
    var _a, _b;
    var styleBindings = {};
    var styleString = '';
    if (block.bindings) {
        for (var key in block.bindings) {
            if (key.includes('style') && key.includes('.')) {
                var styleProperty = key.split('.')[1];
                styleBindings[styleProperty] = convertExportDefaultToReturn(((_b = (_a = block.code) === null || _a === void 0 ? void 0 : _a.bindings) === null || _b === void 0 ? void 0 : _b[key]) || block.bindings[key]);
            }
        }
    }
    var styleKeys = Object.keys(styleBindings);
    if (styleKeys.length) {
        styleString = '{';
        styleKeys.forEach(function (key) {
            // TODO: figure out how to have multiline style bindings here
            // I tried (function{binding code})() and that did not work
            styleString += " ".concat(key, ": ").concat((options.includeBuilderExtras
                ? wrapBinding(styleBindings[key])
                : styleBindings[key]
                    .replace(/var _virtual_index\s*=\s*/g, '')
                    .replace(/;*\s*return _virtual_index;*/, '')).replace(/;$/, ''), ",");
        });
        styleString += ' }';
    }
    return styleString;
};
var hasStyles = function (block) {
    if (block.responsiveStyles) {
        for (var key in block.responsiveStyles) {
            if (Object.keys(block.responsiveStyles[key]).length) {
                return true;
            }
        }
    }
    return false;
};
var wrapBindingIfNeeded = function (value, options) {
    if (options.includeBuilderExtras) {
        return wrapBinding(value);
    }
    if ((value === null || value === void 0 ? void 0 : value.includes(';')) && !(value === null || value === void 0 ? void 0 : value.trim().startsWith('{'))) {
        return "{ ".concat(value, " }");
    }
    return value;
};
var getBlockActions = function (block, options) {
    var _a;
    var obj = __assign(__assign({}, block.actions), (_a = block.code) === null || _a === void 0 ? void 0 : _a.actions);
    if (options.includeBuilderExtras) {
        for (var key in obj) {
            var value = obj[key];
            // TODO: plugin/option for for this
            obj[key] = wrapBinding(value);
        }
    }
    return obj;
};
var getBlockActionsAsBindings = function (block, options) {
    return (0, lodash_1.mapKeys)(getBlockActions(block, options), function (value, key) { return "on".concat((0, capitalize_1.capitalize)(key)); });
};
var isValidBindingKey = function (str) {
    return Boolean(str && /^[a-z0-9_\.]$/i.test(str));
};
var getBlockNonActionBindings = function (block, options) {
    var _a;
    var _b;
    var obj = __assign(__assign({}, block.bindings), (_b = block.code) === null || _b === void 0 ? void 0 : _b.bindings);
    if (options.includeBuilderExtras) {
        for (var key in obj) {
            if (!isValidBindingKey(key)) {
                console.warn('Skipping invalid binding key:', key);
                continue;
            }
            var value = obj[key];
            // TODO: verify the bindings are valid
            var _c = verifyIsValid(value), valid = _c.valid, error = _c.error;
            if (!valid) {
                (_a = verifyIsValid("function () {  ".concat(value, " }")), valid = _a.valid, error = _a.error);
            }
            if (valid) {
                obj[key] = wrapBinding(value);
            }
            else {
                console.warn('Skipping invalid code:', error);
                delete obj[key];
            }
        }
    }
    return obj;
};
function wrapBinding(value) {
    if (!value) {
        return value;
    }
    if (!(value.includes(';') || value.match(/(^|\s|;)return[^a-z0-9A-Z]/))) {
        return value;
    }
    return "(() => {\n    try { ".concat((0, parsers_1.isExpression)(value) ? 'return ' : '').concat(value, " }\n    catch (err) {\n      console.warn('Builder code error', err);\n    }\n  })()");
}
var getBlockBindings = function (block, options) {
    var obj = __assign(__assign({}, getBlockNonActionBindings(block, options)), getBlockActionsAsBindings(block, options));
    return obj;
};
// add back if this direction (blocks as children not prop) is desired
exports.symbolBlocksAsChildren = false;
var componentMappers = __assign(__assign({ Symbol: function (block, options) {
        var _a, _b;
        var css = getCssFromBlock(block);
        var styleString = getStyleStringFromBlock(block, options);
        var actionBindings = getActionBindingsFromBlock(block, options);
        var bindings = __assign(__assign(__assign({ symbol: (0, bindings_1.createSingleBinding)({
                code: JSON.stringify({
                    data: (_a = block.component) === null || _a === void 0 ? void 0 : _a.options.symbol.data,
                    content: (_b = block.component) === null || _b === void 0 ? void 0 : _b.options.symbol.content,
                }),
            }) }, actionBindings), (styleString && {
            style: (0, bindings_1.createSingleBinding)({ code: styleString }),
        })), (Object.keys(css).length && {
            css: (0, bindings_1.createSingleBinding)({ code: JSON.stringify(css) }),
        }));
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'Symbol',
            bindings: bindings,
        });
    } }, (!exports.symbolBlocksAsChildren
    ? {}
    : {
        Symbol: function (block, options) {
            var _a, _b, _c;
            var css = getCssFromBlock(block);
            var styleString = getStyleStringFromBlock(block, options);
            var actionBindings = getActionBindingsFromBlock(block, options);
            var content = (_a = block.component) === null || _a === void 0 ? void 0 : _a.options.symbol.content;
            var blocks = (_b = content === null || content === void 0 ? void 0 : content.data) === null || _b === void 0 ? void 0 : _b.blocks;
            if (blocks) {
                content.data.blocks = null;
            }
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'Symbol',
                bindings: __assign(__assign(__assign({ 
                    // TODO: this doesn't use all attrs
                    symbol: (0, bindings_1.createSingleBinding)({
                        code: JSON.stringify({
                            data: (_c = block.component) === null || _c === void 0 ? void 0 : _c.options.symbol.content.data,
                            content: content, // TODO: convert to <SymbolInternal>...</SymbolInternal> so can be parsed
                        }),
                    }) }, actionBindings), (styleString && {
                    style: (0, bindings_1.createSingleBinding)({ code: styleString }),
                })), (Object.keys(css).length && {
                    css: (0, bindings_1.createSingleBinding)({ code: JSON.stringify(css) }),
                })),
                children: !blocks
                    ? []
                    : [
                        (0, create_mitosis_node_1.createMitosisNode)({
                            // TODO: the Builder generator side of this converting to blocks
                            name: 'BuilderSymbolContents',
                            children: blocks.map(function (item) { return (0, exports.builderElementToMitosisNode)(item, options); }),
                        }),
                    ],
            });
        },
    })), { Columns: function (block, options) {
        var _a, _b;
        var node = (0, exports.builderElementToMitosisNode)(block, options, {
            skipMapper: true,
        });
        delete node.bindings.columns;
        delete node.properties.columns;
        node.children =
            ((_b = (_a = block.component) === null || _a === void 0 ? void 0 : _a.options.columns) === null || _b === void 0 ? void 0 : _b.map(function (col, index) {
                return (0, create_mitosis_node_1.createMitosisNode)(__assign(__assign({ name: 'Column', bindings: {
                        width: { code: col.width },
                    } }, (col.link && {
                    properties: {
                        link: col.link,
                    },
                })), { children: col.blocks.map(function (col) { return (0, exports.builderElementToMitosisNode)(col, options); }) }));
            })) || [];
        return node;
    }, 'Shopify:For': function (block, options) {
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'For',
            bindings: {
                each: (0, bindings_1.createSingleBinding)({
                    code: "state.".concat(block.component.options.repeat.collection),
                }),
            },
            scope: {
                forName: block.component.options.repeat.itemName,
                indexName: '$index',
            },
            children: (block.children || []).map(function (child) { return (0, exports.builderElementToMitosisNode)(child, options); }),
        });
    }, Text: function (block, options) {
        var _a;
        var _b;
        var css = getCssFromBlock(block);
        var styleString = getStyleStringFromBlock(block, options);
        var actionBindings = getActionBindingsFromBlock(block, options);
        var blockBindings = __assign(__assign({}, mapBuilderBindingsToMitosisBindingWithCode((_b = block.code) === null || _b === void 0 ? void 0 : _b.bindings)), mapBuilderBindingsToMitosisBindingWithCode(block.bindings));
        var bindings = __assign(__assign(__assign(__assign({}, (0, lodash_1.omitBy)(blockBindings, function (value, key) {
            if (key === 'component.options.text') {
                return true;
            }
            if (key && key.includes('style')) {
                return true;
            }
            return false;
        })), actionBindings), (styleString && {
            style: { code: styleString },
        })), (Object.keys(css).length && {
            css: { code: JSON.stringify(css) },
        }));
        var properties = __assign({}, block.properties);
        if (block.id)
            properties['builder-id'] = block.id;
        if (block.class)
            properties['class'] = block.class;
        if (block.layerName) {
            properties.$name = block.layerName;
        }
        var innerBindings = {};
        var componentOptionsText = blockBindings['component.options.text'];
        if (componentOptionsText) {
            innerBindings[options.preserveTextBlocks ? 'innerHTML' : '_text'] = (0, bindings_1.createSingleBinding)({
                code: wrapBindingIfNeeded(componentOptionsText.code, options),
            });
        }
        var innerProperties = (_a = {},
            _a[options.preserveTextBlocks ? 'innerHTML' : '_text'] = block.component.options.text,
            _a);
        if (options.preserveTextBlocks) {
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: block.tagName || 'div',
                bindings: bindings,
                properties: properties,
                children: [
                    (0, create_mitosis_node_1.createMitosisNode)({
                        bindings: innerBindings,
                        properties: __assign(__assign({}, innerProperties), { class: 'builder-text' }),
                    }),
                ],
            });
        }
        if ((block.tagName && block.tagName !== 'div') || hasStyles(block)) {
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: block.tagName || 'div',
                bindings: bindings,
                properties: properties,
                children: [
                    (0, create_mitosis_node_1.createMitosisNode)({
                        bindings: innerBindings,
                        properties: innerProperties,
                    }),
                ],
            });
        }
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: block.tagName || 'div',
            properties: __assign(__assign({}, properties), innerProperties),
            bindings: __assign(__assign({}, bindings), innerBindings),
        });
    } });
var builderElementToMitosisNode = function (block, options, _internalOptions) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    if (_internalOptions === void 0) { _internalOptions = {}; }
    if (((_b = block.component) === null || _b === void 0 ? void 0 : _b.name) === 'Core:Fragment') {
        block.component.name = 'Fragment';
    }
    var forBinding = (_c = block.repeat) === null || _c === void 0 ? void 0 : _c.collection;
    if (forBinding) {
        var isFragment = ((_d = block.component) === null || _d === void 0 ? void 0 : _d.name) === 'Fragment';
        // TODO: handle having other things, like a repeat too
        if (isFragment) {
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'For',
                bindings: {
                    each: (0, bindings_1.createSingleBinding)({
                        code: wrapBindingIfNeeded((_e = block.repeat) === null || _e === void 0 ? void 0 : _e.collection, options),
                    }),
                },
                scope: {
                    forName: ((_f = block.repeat) === null || _f === void 0 ? void 0 : _f.itemName) || 'item',
                    indexName: '$index',
                },
                children: ((_g = block.children) === null || _g === void 0 ? void 0 : _g.map(function (child) { return (0, exports.builderElementToMitosisNode)(child, options); })) || [],
            });
        }
        else {
            var useBlock = ((_h = block.component) === null || _h === void 0 ? void 0 : _h.name) === 'Core:Fragment' && ((_j = block.children) === null || _j === void 0 ? void 0 : _j.length) === 1
                ? block.children[0]
                : block;
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'For',
                bindings: {
                    each: (0, bindings_1.createSingleBinding)({
                        code: wrapBindingIfNeeded((_k = block.repeat) === null || _k === void 0 ? void 0 : _k.collection, options),
                    }),
                },
                scope: {
                    forName: ((_l = block.repeat) === null || _l === void 0 ? void 0 : _l.itemName) || 'item',
                    indexName: '$index',
                },
                children: [(0, exports.builderElementToMitosisNode)((0, lodash_1.omit)(useBlock, 'repeat'), options)],
            });
        }
    }
    // Special builder properties
    // TODO: support hide and repeat
    var blockBindings = getBlockBindings(block, options);
    var code = undefined;
    if (blockBindings.show) {
        code = wrapBindingIfNeeded(blockBindings.show, options);
    }
    else if (blockBindings.hide) {
        code = "!(".concat(wrapBindingIfNeeded(blockBindings.hide, options), ")");
    }
    if (code) {
        var isFragment = ((_m = block.component) === null || _m === void 0 ? void 0 : _m.name) === 'Fragment';
        // TODO: handle having other things, like a repeat too
        if (isFragment) {
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'Show',
                bindings: { when: (0, bindings_1.createSingleBinding)({ code: code }) },
                children: ((_o = block.children) === null || _o === void 0 ? void 0 : _o.map(function (child) { return (0, exports.builderElementToMitosisNode)(child, options); })) || [],
            });
        }
        else {
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'Show',
                bindings: { when: (0, bindings_1.createSingleBinding)({ code: code }) },
                children: [
                    (0, exports.builderElementToMitosisNode)(__assign(__assign({}, block), { code: __assign(__assign({}, block.code), { bindings: (0, lodash_1.omit)(blockBindings, 'show', 'hide') }), bindings: (0, lodash_1.omit)(blockBindings, 'show', 'hide') }), options),
                ],
            });
        }
    }
    var mapper = !_internalOptions.skipMapper && block.component && componentMappers[block.component.name];
    if (mapper) {
        return mapper(block, options);
    }
    var bindings = {};
    if (blockBindings) {
        for (var key in blockBindings) {
            if (key === 'css') {
                continue;
            }
            var useKey = key.replace(/^(component\.)?options\./, '');
            if (!useKey.includes('.')) {
                bindings[useKey] = {
                    code: blockBindings[key].code || blockBindings[key],
                };
            }
            else if (useKey.includes('style') && useKey.includes('.')) {
                var styleProperty = useKey.split('.')[1];
                // TODO: add me in
                // styleBindings[styleProperty] =
                //   block.code?.bindings?.[key] || blockBindings[key];
            }
        }
    }
    var properties = __assign(__assign(__assign({}, block.properties), (options.includeBuilderExtras && (_a = {},
        _a['builder-id'] = block.id,
        _a))), (options.includeBuilderExtras && getBuilderPropsForSymbol(block)));
    if (block.layerName) {
        properties.$name = block.layerName;
    }
    if (block.linkUrl) {
        properties.href = block.linkUrl;
    }
    if ((_p = block.component) === null || _p === void 0 ? void 0 : _p.options) {
        for (var key in block.component.options) {
            var value = block.component.options[key];
            if (typeof value === 'string') {
                properties[key] = value;
            }
            else {
                bindings[key] = { code: json5_1.default.stringify(value) };
            }
        }
    }
    if (block.component && block.tagName && block.tagName !== 'div') {
        properties.builderTag = block.tagName;
    }
    var css = getCssFromBlock(block);
    var styleString = getStyleStringFromBlock(block, options);
    var actionBindings = getActionBindingsFromBlock(block, options);
    for (var binding in blockBindings) {
        if (binding.startsWith('component.options') || binding.startsWith('options')) {
            var value = blockBindings[binding];
            var useKey = binding.replace(/^(component\.options\.|options\.)/, '');
            bindings[useKey] = { code: value };
        }
    }
    var node = (0, create_mitosis_node_1.createMitosisNode)({
        name: ((_r = (_q = block.component) === null || _q === void 0 ? void 0 : _q.name) === null || _r === void 0 ? void 0 : _r.replace(/[^a-z0-9]/gi, '')) ||
            block.tagName ||
            (block.linkUrl ? 'a' : 'div'),
        properties: __assign(__assign(__assign({}, (block.component && { $tagName: block.tagName })), (block.class && { class: block.class })), properties),
        bindings: __assign(__assign(__assign(__assign({}, bindings), actionBindings), (styleString && {
            style: { code: styleString },
        })), (css &&
            Object.keys(css).length && {
            css: { code: JSON.stringify(css) },
        })),
    });
    // Has single text node child
    if (((_s = block.children) === null || _s === void 0 ? void 0 : _s.length) === 1 &&
        ((_t = block.children[0].component) === null || _t === void 0 ? void 0 : _t.name) === 'Text' &&
        !options.preserveTextBlocks) {
        var textProperties = (0, exports.builderElementToMitosisNode)(block.children[0], options);
        var mergedCss = (0, lodash_1.merge)(json5_1.default.parse(((_u = node.bindings.css) === null || _u === void 0 ? void 0 : _u.code) || '{}'), json5_1.default.parse(((_v = textProperties.bindings.css) === null || _v === void 0 ? void 0 : _v.code) || '{}'));
        return (0, lodash_1.merge)({}, textProperties, node, {
            bindings: __assign({}, (Object.keys(mergedCss).length && {
                css: { code: json5_1.default.stringify(mergedCss) },
            })),
        });
    }
    node.children = (block.children || []).map(function (item) { return (0, exports.builderElementToMitosisNode)(item, options); });
    return node;
};
exports.builderElementToMitosisNode = builderElementToMitosisNode;
var getBuilderPropsForSymbol = function (block) {
    var _a, _b;
    if (((_a = block.children) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        var child = block.children[0];
        var builderContentId = (_b = child.properties) === null || _b === void 0 ? void 0 : _b['builder-content-id'];
        if (builderContentId) {
            return { 'builder-content-id': builderContentId };
        }
    }
    return undefined;
};
var getHooks = function (content) {
    var _a, _b;
    var code = convertExportDefaultToReturn(((_a = content.data) === null || _a === void 0 ? void 0 : _a.tsCode) || ((_b = content.data) === null || _b === void 0 ? void 0 : _b.jsCode) || '');
    try {
        return (0, jsx_1.parseJsx)("\n    export default function TemporaryComponent() {\n      ".concat(
        // Mitosis parser looks for useState to be a variable assignment,
        // but in Builder that's not how it works. For now do a replace to
        // easily resuse the same parsing code as this is the only difference
        code.replace("useState(", "var state = useState("), "\n    }"));
    }
    catch (err) {
        console.warn('Could not parse js code as a Mitosis component body', err, code);
        return null;
    }
};
/**
 * Take Builder custom jsCode and extract the contents of the useState hook
 * and return it as a JS object along with the inputted code with the hook
 * code extracted
 */
function extractStateHook(code) {
    var types = babel.types;
    var state = {};
    var body = (0, parsers_1.parseCode)(code);
    var newBody = body.slice();
    for (var i = 0; i < body.length; i++) {
        var statement = body[i];
        if (types.isExpressionStatement(statement)) {
            var expression = statement.expression;
            // Check for useState
            if (types.isCallExpression(expression)) {
                if (types.isIdentifier(expression.callee) && expression.callee.name === 'useState') {
                    var arg = expression.arguments[0];
                    if (types.isObjectExpression(arg)) {
                        state = (0, state_1.parseStateObjectToMitosisState)(arg);
                        newBody.splice(i, 1);
                    }
                }
                if (types.isMemberExpression(expression.callee)) {
                    if (types.isIdentifier(expression.callee.object) &&
                        expression.callee.object.name === 'Object') {
                        if (types.isIdentifier(expression.callee.property) &&
                            expression.callee.property.name === 'assign') {
                            var arg = expression.arguments[1];
                            if (types.isObjectExpression(arg)) {
                                state = (0, state_1.parseStateObjectToMitosisState)(arg);
                                newBody.splice(i, 1);
                            }
                        }
                    }
                }
            }
        }
    }
    var newCode = (0, generator_1.default)(types.program(newBody)).code || '';
    return { code: newCode, state: state };
}
exports.extractStateHook = extractStateHook;
function convertExportDefaultToReturn(code) {
    try {
        var types = babel.types;
        var body = (0, parsers_1.parseCode)(code);
        var newBody = body.slice();
        for (var i = 0; i < body.length; i++) {
            var statement = body[i];
            if (types.isExportDefaultDeclaration(statement)) {
                if (types.isCallExpression(statement.declaration) ||
                    types.isExpression(statement.declaration)) {
                    newBody[i] = types.returnStatement(statement.declaration);
                }
            }
        }
        return (0, generator_1.default)(types.program(newBody)).code || '';
    }
    catch (e) {
        var error = e;
        if (error.code === 'BABEL_PARSE_ERROR') {
            return code;
        }
        else {
            throw e;
        }
    }
}
exports.convertExportDefaultToReturn = convertExportDefaultToReturn;
// TODO: maybe this should be part of the builder -> Mitosis part
function extractSymbols(json) {
    var _a, _b, _c, _d;
    var subComponents = [];
    var symbols = [];
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a;
        if ((0, exports.isBuilderElement)(item)) {
            if (((_a = item.component) === null || _a === void 0 ? void 0 : _a.name) === 'Symbol') {
                symbols.push({ element: item, depth: this.path.length, id: item.id });
            }
        }
    });
    var symbolsSortedDeepestFirst = (0, lodash_1.sortBy)(symbols, function (info) { return info.depth; })
        .reverse()
        .map(function (el) { return el.element; });
    var symbolsFound = 0;
    for (var _i = 0, symbolsSortedDeepestFirst_1 = symbolsSortedDeepestFirst; _i < symbolsSortedDeepestFirst_1.length; _i++) {
        var el = symbolsSortedDeepestFirst_1[_i];
        var symbolValue = (_b = (_a = el.component) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.symbol;
        var elContent = symbolValue === null || symbolValue === void 0 ? void 0 : symbolValue.content;
        if (!elContent) {
            console.warn('Symbol missing content', el.id);
            if ((_c = el.component) === null || _c === void 0 ? void 0 : _c.options.symbol.content) {
                delete el.component.options.symbol.content;
            }
            continue;
        }
        var componentName = 'Symbol' + ++symbolsFound;
        el.component.name = componentName;
        if ((_d = el.component) === null || _d === void 0 ? void 0 : _d.options.symbol.content) {
            delete el.component.options.symbol.content;
        }
        subComponents.push({
            content: elContent,
            name: componentName,
        });
    }
    return {
        content: json,
        subComponents: subComponents,
    };
}
var createBuilderElement = function (options) { return (__assign({ '@type': '@builder.io/sdk:Element', id: 'builder-' + (0, __1.hashCodeAsString)(options) }, options)); };
exports.createBuilderElement = createBuilderElement;
var isBuilderElement = function (el) {
    return (el === null || el === void 0 ? void 0 : el['@type']) === '@builder.io/sdk:Element';
};
exports.isBuilderElement = isBuilderElement;
var builderContentPartToMitosisComponent = function (builderContent, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (options === void 0) { options = {}; }
    builderContent = (0, fast_clone_1.fastClone)(builderContent);
    (0, traverse_1.default)(builderContent).forEach(function (elem) {
        var _a, _b;
        if ((0, exports.isBuilderElement)(elem)) {
            // Try adding self-closing tags to void elements, since Builder Text
            // blocks can contain arbitrary HTML
            // List taken from https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
            // TODO: Maybe this should be using something more robust than a regular expression
            var voidElemRegex = /(<area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr[^>]+)>/gm;
            try {
                if (((_a = elem.component) === null || _a === void 0 ? void 0 : _a.name) === 'Text') {
                    elem.component.options.text = elem.component.options.text.replace(voidElemRegex, '$1 />');
                }
            }
            catch (_error) {
                // pass
            }
            try {
                if (((_b = elem.component) === null || _b === void 0 ? void 0 : _b.name) === 'Custom Code') {
                    elem.component.options.code = elem.component.options.code.replace(voidElemRegex, '$1 />');
                }
            }
            catch (_error) {
                // pass
            }
        }
    });
    var _k = extractStateHook(((_a = builderContent === null || builderContent === void 0 ? void 0 : builderContent.data) === null || _a === void 0 ? void 0 : _a.tsCode) || ((_b = builderContent === null || builderContent === void 0 ? void 0 : builderContent.data) === null || _b === void 0 ? void 0 : _b.jsCode) || ''), state = _k.state, code = _k.code;
    var customCode = convertExportDefaultToReturn(code);
    var parsed = getHooks(builderContent);
    var parsedState = (parsed === null || parsed === void 0 ? void 0 : parsed.state) || {};
    var mitosisState = Object.keys(parsedState).length > 0
        ? parsedState
        : __assign(__assign({}, state), (0, helpers_1.mapBuilderContentStateToMitosisState)(((_c = builderContent.data) === null || _c === void 0 ? void 0 : _c.state) || {}));
    var componentJson = (0, create_mitosis_component_1.createMitosisComponent)({
        meta: __assign({ useMetadata: {
                httpRequests: (_d = builderContent.data) === null || _d === void 0 ? void 0 : _d.httpRequests,
            } }, (((_e = builderContent.data) === null || _e === void 0 ? void 0 : _e.cssCode) && { cssCode: builderContent.data.cssCode })),
        inputs: (_g = (_f = builderContent.data) === null || _f === void 0 ? void 0 : _f.inputs) === null || _g === void 0 ? void 0 : _g.map(function (input) { return ({
            name: input.name,
            defaultValue: input.defaultValue,
        }); }),
        state: mitosisState,
        hooks: __assign({}, ((((_h = parsed === null || parsed === void 0 ? void 0 : parsed.hooks.onMount) === null || _h === void 0 ? void 0 : _h.code) || (customCode && { code: customCode })) && {
            onMount: (parsed === null || parsed === void 0 ? void 0 : parsed.hooks.onMount) || { code: customCode },
        })),
        children: (((_j = builderContent.data) === null || _j === void 0 ? void 0 : _j.blocks) || [])
            .filter(function (item) {
            var _a, _b;
            if ((_b = (_a = item.properties) === null || _a === void 0 ? void 0 : _a.src) === null || _b === void 0 ? void 0 : _b.includes('/api/v1/pixel')) {
                return false;
            }
            return true;
        })
            .map(function (item) { return (0, exports.builderElementToMitosisNode)(item, options); }),
    });
    return componentJson;
};
var builderContentToMitosisComponent = function (builderContent, options) {
    if (options === void 0) { options = {}; }
    builderContent = (0, fast_clone_1.fastClone)(builderContent);
    var separated = extractSymbols(builderContent);
    var componentJson = __assign(__assign({}, builderContentPartToMitosisComponent(separated.content, options)), { subComponents: separated.subComponents.map(function (item) { return (__assign(__assign({}, builderContentPartToMitosisComponent(item.content, options)), { name: item.name })); }) });
    return componentJson;
};
exports.builderContentToMitosisComponent = builderContentToMitosisComponent;
function mapBuilderBindingsToMitosisBindingWithCode(bindings) {
    var result = {};
    bindings &&
        Object.keys(bindings).forEach(function (key) {
            var value = bindings[key];
            if (typeof value === 'string') {
                result[key] = (0, bindings_1.createSingleBinding)({ code: value });
            }
            else if (value && typeof value === 'object' && value.code) {
                result[key] = (0, bindings_1.createSingleBinding)({ code: value.code });
            }
            else {
                throw new Error('Unexpected binding value: ' + JSON.stringify(value));
            }
        });
    return result;
}
