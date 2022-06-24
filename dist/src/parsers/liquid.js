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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindingsFromAttrs = exports.htmlToBuilder = exports.liquidToBuilder = exports.preprocessLiquid = exports.tryFormat = exports.htmlDebugString = exports.processedAstToBuilder = exports.htmlAstToBuilder = exports.postProcessBuilderTree = exports.postProcessHtmlAstNodes = exports.separateTagsAndText = exports.htmlToAst = exports.liquidToAst = exports.htmlNodeToBuilder = exports.parsedLiquidToHtml = exports.humanCase = exports.blockToLiquid = exports.getLiquidConditionExpresion = void 0;
var axios_1 = __importDefault(require("axios"));
var liquidjs_1 = require("liquidjs");
var lodash_1 = require("lodash");
var object_hash_1 = __importDefault(require("object-hash"));
var htmlParser = __importStar(require("prettier/parser-html"));
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var compiler = __importStar(require("vue-template-compiler"));
var fast_clone_1 = require("../helpers/fast-clone");
var liquid_1 = require("../generators/liquid");
var map_to_attributes_1 = require("../helpers/map-to-attributes");
var map_to_css_1 = require("../helpers/map-to-css");
var __1 = require("..");
var voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);
var sizeNames = ['xsmall', 'small', 'medium', 'large'];
var sizes = {
    xsmall: {
        min: 0,
        default: 0,
        max: 0,
    },
    small: {
        min: 320,
        default: 321,
        max: 640,
    },
    medium: {
        min: 641,
        default: 642,
        max: 991,
    },
    large: {
        min: 990,
        default: 991,
        max: 1200,
    },
    getWidthForSize: function (size) {
        return this[size].default;
    },
    getSizeForWidth: function (width) {
        for (var _i = 0, sizeNames_1 = sizeNames; _i < sizeNames_1.length; _i++) {
            var size_1 = sizeNames_1[_i];
            var value = this[size_1];
            if (width <= value.max) {
                return size_1;
            }
        }
        return 'large';
    },
};
var isLiquidRender = function (binding) {
    return binding.replace(/\s/g, '').match('.liquid.render');
};
var isLiquidConditional = function (binding) {
    return binding.replace(/\s/g, '').match('.liquid.condition');
};
var getConditionalAttr = function (value, noEnd) {
    if (noEnd === void 0) { noEnd = false; }
    var closingTag = noEnd ? '' : '{% endif %}';
    return (value
        .split('/*start*/')
        .reverse()
        .filter(function (st) { return st.includes('liquid'); })
        .map(function (statement) { return statement.replace(/`/g, '"'); })
        .map(function (statement) {
        var _a;
        var expression = statement.startsWith('!')
            ? 'else'
            : !statement.includes('!')
                ? 'if'
                : '';
        var condition = expression === 'if'
            ? (_a = statement.match(/context\.(shopify\.)?liquid\.condition\("([^"]*)"/)) === null || _a === void 0 ? void 0 : _a[2]
            : '';
        var index = statement.indexOf('&&');
        var branchValue = index > -1 ? getConditionalAttr(statement.substr(index + 2), true) : getValue(statement);
        if (expression) {
            return "{% ".concat(expression, " ").concat(condition, " %} ").concat(branchValue);
        }
        return branchValue + '{% endif %}';
    })
        .join('') + closingTag);
};
var removeShopifyContext = function (str) {
    var usesSingleQuotes = Boolean(str.match(/\.\s*(get|render)\('/));
    if (usesSingleQuotes) {
        return str.replace(/(context|state)\s*\.\s*(shopify\s*\.)?\s*liquid\s*\.\s*(get|render)\s*\(\s*(\\'|')([^']+)(\\'|')\s*.*\)/g, '$5');
    }
    return str.replace(/(context|state)\s*\.\s*(shopify\s*\.)?\s*liquid\s*\.\s*(get|render)\s*\(\s*(\\"|")([^"]+)(\\"|")\s*.*\)/g, '$5');
};
var getValue = function (condition) {
    var _a;
    var value = (_a = condition.match(/\? (.*) :/)) === null || _a === void 0 ? void 0 : _a[1];
    if (value) {
        return removeShopifyContext(value.replace(/{{'(.*?)'}}/g, '$1').replace(/'/g, ''));
    }
};
/**
 * Extract a liquid expression from our JS structure - i.e. transform
 * "context.shopify.liquid.condition('some | liquid')" to "some | liquid"
 */
var getLiquidConditionExpresion = function (expression) {
    var _a;
    var matched = (_a = expression.match(/context\s*\.\s*(shopify\s*\.)?\s*liquid\s*\.\s*condition\s*\(\s*['"]([\s\S]*?)['"]\s*,\s*state\s*\)\s*/i)) === null || _a === void 0 ? void 0 : _a[2];
    return matched || 'null';
};
exports.getLiquidConditionExpresion = getLiquidConditionExpresion;
// TODO: move most or all of this to transformers and functions
var convertBinding = function (binding, options) {
    var value = binding;
    var isShopifyContext = value.replace(/\s/g, '').includes('.liquid');
    if (!(0, liquid_1.isValidLiquidBinding)(binding)) {
        return '';
    }
    if (isLiquidConditional(value)) {
        value = getConditionalAttr(value);
    }
    else if (isShopifyContext) {
        value = removeShopifyContext(value);
    }
    if (options.looseBindings) {
        // We use state, Shopify uses global vars, so convert
        // state.product.title to {{ product.title}}, etc
        if (value.includes('state.')) {
            value = value.replace(/state\./g, '');
        }
        if (value.includes('context.')) {
            value = value.replace(/context\./g, '');
        }
    }
    return value;
};
function blockToLiquid(json, options) {
    var _a, _b, _c, _d;
    if (options === void 0) { options = {}; }
    var block = (0, fast_clone_1.fastClone)(json);
    var bindings = __assign(__assign({}, block.bindings), (_a = block.code) === null || _a === void 0 ? void 0 : _a.bindings);
    var hasInvalidHide = bindings.hide && !(0, liquid_1.isValidLiquidBinding)(bindings.hide);
    var hasInvalidShow = bindings.show && !(0, liquid_1.isValidLiquidBinding)(bindings.show);
    var hasInvalidRepeat = block.repeat && block.repeat.collection && !(0, liquid_1.isValidLiquidBinding)(block.repeat.collection);
    if (hasInvalidHide || hasInvalidShow || hasInvalidRepeat) {
        return '';
    }
    var styles = {};
    if (bindings && !options.static) {
        for (var key in bindings) {
            var binding = bindings[key];
            if (!key || !binding || key === 'hide') {
                continue;
            }
            var value = convertBinding(binding, options);
            var valueString = void 0;
            if (!value) {
                valueString = '';
            }
            else if (isLiquidRender(binding) || isLiquidConditional(binding)) {
                valueString = value;
            }
            else {
                valueString = "{{ ".concat(value, " }}");
            }
            // Preserve default styles for those bound
            if (!value && key.startsWith('style')) {
                continue;
            }
            if (key.startsWith('properties.') || !key.includes('.')) {
                if (!block.properties) {
                    block.properties = {};
                }
                var name_1 = key.startsWith('properties.') ? key.replace(/^\s*properties\s*\./, '') : key;
                (0, lodash_1.set)(block.properties, name_1, valueString);
            }
            else if (key.startsWith('component.options.') || key.startsWith('options.')) {
                var name_2 = key.replace(/^.*?options\./, '');
                if (!block.component) {
                    continue;
                }
                if (!block.component.options) {
                    block.component.options = {};
                }
                (0, lodash_1.set)(block.component.options, name_2, valueString);
            }
            else if (key.startsWith('style.')) {
                var name_3 = key.replace('style.', '');
                (0, lodash_1.set)(styles, name_3, valueString);
            }
            else if (key === 'attr.style') {
                if (!block.properties) {
                    block.properties = {};
                }
                (0, lodash_1.set)(block.properties, 'style', valueString);
            }
        }
    }
    // TODO: bindings with {{}} as values
    var css = blockCss(block, options);
    var stylesList = [];
    if ((0, lodash_1.size)(styles)) {
        stylesList.push((0, map_to_css_1.mapToCss)(styles, 0));
    }
    if ((_b = block.properties) === null || _b === void 0 ? void 0 : _b.style) {
        stylesList.push(block.properties.style);
    }
    var bindingClass = ((_c = block.bindings) === null || _c === void 0 ? void 0 : _c.class) && convertBinding(block.bindings.class, options);
    var classes = (0, lodash_1.uniq)([
        // 'builder-block',
        block.id,
        block.class,
        bindingClass,
        (_d = block.properties) === null || _d === void 0 ? void 0 : _d.class,
    ]).filter(lodash_1.identity);
    var componentInfo = null;
    var attributes = (0, map_to_attributes_1.mapToAttributes)(__assign(__assign(__assign({}, block.properties), { 
        // ['builder-id']: block.id,
        class: classes.join(' ') }), ((0, lodash_1.size)(stylesList) && {
        style: stylesList.join(';'),
    })));
    var tag = block.tagName || (block.properties && block.properties.href ? 'a' : 'div');
    if (options.openingTagOnly) {
        return "<".concat(tag).concat(attributes ? ' ' + attributes : '', ">");
    }
    if (block.component && !componentInfo) {
        console.warn("Could not find component: ".concat(block.component.name));
    }
    var collectionName = block.repeat && (0, lodash_1.last)((block.repeat.collection || '').trim().split('(')[0].trim().split('.'));
    if (collectionName) {
        collectionName = convertBinding(collectionName, options);
    }
    return "\n    ".concat(css.trim() ? "<style>".concat(css, "</style>") : '', "\n    ").concat(!options.static &&
        block.repeat &&
        block.repeat.collection &&
        (0, liquid_1.isValidLiquidBinding)(block.repeat.collection)
        ? "{% for ".concat(block.repeat.itemName || collectionName + '_item', " in ").concat(convertBinding(block.repeat.collection, options), " %}")
        : '', "\n    ").concat(!options.static && bindings.hide
        ? "{% unless  ".concat(!(0, liquid_1.isValidLiquidBinding)(bindings.hide) ? 'false' : convertBinding(bindings.hide, options), " %}")
        : '', "\n    ").concat(!options.static && bindings.show
        ? "{% if  ".concat(!(0, liquid_1.isValidLiquidBinding)(bindings.show) ? 'false' : convertBinding(bindings.show, options), " %}")
        : '', "\n    ").concat(!options.static && bindings.hide ? '{% endunless %}' : '', "\n    ").concat(!options.static && bindings.show ? '{% endif %}' : '', "\n    ").concat(!options.static && block.repeat && block.repeat.collection ? '{% endfor %}' : '', "\n  ");
}
exports.blockToLiquid = blockToLiquid;
// TODO: make these core functions and share with react, vue, etc
// TODO: apply style bindings and default animation
function blockCss(block, options) {
    if (options === void 0) { options = {}; }
    // TODO: handle style bindings
    var self = block;
    var baseStyles = __assign({}, (self.responsiveStyles && self.responsiveStyles.large));
    var css = options.emailMode
        ? ''
        : ".builder-block.".concat(self.id, " {").concat((0, map_to_css_1.mapToCss)(baseStyles), "}");
    var reversedNames = sizeNames.slice().reverse();
    if (self.responsiveStyles) {
        for (var _i = 0, reversedNames_1 = reversedNames; _i < reversedNames_1.length; _i++) {
            var size_2 = reversedNames_1[_i];
            if (options.emailMode && size_2 === 'large') {
                continue;
            }
            if (size_2 !== 'large' &&
                size_2 !== 'xsmall' &&
                self.responsiveStyles[size_2] &&
                Object.keys(self.responsiveStyles[size_2]).length) {
                // TODO: this will not work as expected for a couple things that are handled specially,
                // e.g. width
                css += "\n@media only screen and (max-width: ".concat(sizes[size_2].max, "px) { \n").concat(options.emailMode ? '.' : '.builder-block.').concat(self.id + (options.emailMode ? '-subject' : ''), " {").concat((0, map_to_css_1.mapToCss)(self.responsiveStyles[size_2], 4, options.emailMode), " } }");
            }
        }
    }
    return css;
}
function humanCase(str) {
    return (0, lodash_1.capitalize)((0, lodash_1.kebabCase)(str).replace(/[- ]+/g, ' ').trim());
}
exports.humanCase = humanCase;
var setupCache = require('axios-cache-adapter/dist/cache.node.js').setupCache;
var axiosCache = setupCache({
    exclude: { query: false },
});
// Webpack workaround to conditionally require certain external modules
// only on the server and not bundle them on the client
var serverOnlyRequire;
try {
    // tslint:disable-next-line:no-eval
    serverOnlyRequire = eval('require');
}
catch (err) {
    // all good
    serverOnlyRequire = (function () { return null; });
}
var http = serverOnlyRequire('http');
var https = serverOnlyRequire('https');
var httpAgent = (http && new http.Agent({ keepAlive: true })) || undefined;
var httpsAgent = (https && new https.Agent({ keepAlive: true })) || undefined;
var serializedBlockTagName = 'builder-serialized-block';
var serializedBlockCloseTag = "</".concat(serializedBlockTagName, ">");
var serializeBlock = function (el, close) {
    if (close === void 0) { close = true; }
    var str = "<".concat(serializedBlockTagName, " block='").concat(htmlEncode(JSON.stringify(el)), "'>");
    if (close) {
        str += serializedBlockCloseTag;
    }
    return str;
};
// returns a new object from soource with a new array for each key (e.g blocks) that has key_order (e.g block_order)
var mapArrays = function (source) {
    if (!source) {
        return source;
    }
    var newArrays = Object.keys(source).reduce(function (acc, key) {
        var _a;
        var orderKey = "".concat(key.slice(0, -1), "_order");
        if (source[orderKey]) {
            return __assign((_a = {}, _a[key] = source[orderKey].map(function (id) { return source[key][id]; }), _a), acc);
        }
        return acc;
    }, {});
    return __assign(__assign({}, source), newArrays);
};
// Create `axios` instance passing the newly created `cache.adapter`
var axios = axios_1.default.create({
    httpAgent: httpAgent,
    httpsAgent: httpsAgent,
    timeout: 30000,
    adapter: axiosCache.adapter,
});
var isSerializedBlock = function (str) {
    return str.includes("<".concat(serializedBlockTagName));
};
var deserializeBlock = function (str) {
    var parts = [];
    var attribute = str;
    var matches = str.match(/<builder-serialized-block block='([^']*)'/);
    while (matches === null || matches === void 0 ? void 0 : matches[1]) {
        parts.push(attribute.substring(0, matches.index));
        parts.push(blockToLiquid(JSON.parse(htmlDecode(matches[1])), {
            componentOnly: true,
        }));
        attribute = attribute.substring(matches.index + matches[0].length + serializedBlockCloseTag.length + 1);
        matches = attribute.match(/<builder-serialized-block block='([^']*)'/);
    }
    return parts.join('');
};
var stringWithBindingsToLiquid = function (str) {
    var separated = (0, exports.separateTagsAndText)(str).map(function (item) { return item.text; });
    var liquidStr = '';
    var _loop_1 = function (item) {
        var tag = parseTag(item);
        if (tag && tag.value) {
            try {
                var parsedValue = JSON.parse(tag.value);
                if (parsedValue.fullRaw) {
                    liquidStr += parsedValue.fullRaw;
                }
                else {
                    console.warn('Tag missing fullRaw', tag);
                }
            }
            catch (err) {
                console.error('Could not parse tag value', tag, err);
            }
        }
        else if (isSerializedBlock(item)) {
            var block = (0, lodash_1.attempt)(function () { return deserializeBlock(item); });
            if (!(0, lodash_1.isError)(block)) {
                liquidStr += block;
            }
            else {
                console.warn('Error deserializing binding to liquid ', block);
            }
        }
        else {
            liquidStr += item;
        }
    };
    for (var _i = 0, separated_1 = separated; _i < separated_1.length; _i++) {
        var item = separated_1[_i];
        _loop_1(item);
    }
    return liquidStr;
};
var isSimpleLiquidBinding = function (str) {
    if (str === void 0) { str = ''; }
    return Boolean(str.match(/^[a-z0-9_\.\s]+$/i));
};
var liquidBindingTemplate = function (str) {
    return isSimpleLiquidBinding(str)
        ? str
        : "liquid.get(\"".concat(str.replace(/\n+/g, ' ').replace(/"/g, '\\"'), "\")");
};
var liquidRenderTemplate = function (str) {
    return isSimpleLiquidBinding(str) ? str : "liquid(\"".concat(str.replace(/\n+/g, ' ').replace(/"/g, '\\"'), "\")");
};
var liquidConditionTemplate = function (str) {
    return isSimpleLiquidBinding(str) ? str : "liquid(\"".concat(str.replace(/\n+/g, ' ').replace(/"/g, '\\"'), "\")");
};
var isIfTemplate = function (template) {
    return template.token.type === 'tag' && template.token.name === 'if';
};
var isUnlessTemplate = function (template) {
    return template.token.type === 'tag' && template.token.name === 'unless';
};
var isForTemplate = function (template) {
    return template.token.type === 'tag' && template.token.name === 'for';
};
var isBlockTemplate = function (template) {
    return template.token.type === 'tag' && template.token.name === 'for';
};
var isHtmlTemplate = function (template) {
    return template.token.type === 'html';
};
var isCaseTemplate = function (template) {
    return template.token.type === 'tag' && template.token.name === 'case';
};
var isOutputTemplate = function (template) {
    return template.token.type === 'output';
};
var isElement = function (node) { return node.type === 1; };
var isTextNode = function (node) {
    return node.type === 3 || node.type === 2;
};
// Custom common HTML symbol encoding so not to confuse with actual encoded HTML
var htmlEncode = function (html) { return html.replace(/'/g, '_APOS_').replace(/"/g, '_QUOT_'); };
var htmlDecode = function (html) { return html.replace(/_APOS_/g, "'").replace(/_QUOT_/g, '"'); };
var createHtmlAttribute = function (attribute, attributeValue) {
    if (attributeValue === void 0) { attributeValue = null; }
    var encodedValue = '';
    if (attributeValue) {
        encodedValue = "='".concat(htmlEncode(JSON.stringify(attributeValue)), "'");
    }
    return "[".concat(attribute, "]").concat(encodedValue);
};
var COMMA_TOKEN = '__bldr_comma__';
var parseArgList = function (args) {
    return args
        // find all the string arguments (wrapped with ' or "), then replace any commas
        // this allows us to split the args on "," without worrying about breaking any strings
        .replace(/('[^']*'|"[^"]*")/g, function (str) { return str.replace(/,/g, COMMA_TOKEN); })
        .split(',')
        // now that we the arg list is broken up, we can re-add the escaped commas to each item
        .map(function (item) { return item.replace(new RegExp(COMMA_TOKEN, 'g'), ',').trim(); });
};
var errorLinesRe = /\((\d*):(\d*)\)/;
var getErrorInfo = function (message) {
    var matched = message.match(errorLinesRe);
    return (matched && {
        line: matched[1],
        col: matched[2],
    });
};
var getSubstringTill = function (col, line, str) {
    var lines = str.split('\n');
    return lines.slice(0, line - 1).join('\n') + lines[line - 1].substring(0, col - 1);
};
var transpileUnlessToIf = function (unlessTemplate) {
    var cond = unlessTemplate.impl.cond;
    var value = "if ".concat(cond);
    var raw = "{% ".concat(value, " %}");
    return __assign(__assign({}, unlessTemplate), { impl: {
            branches: [
                {
                    negate: true,
                    cond: cond,
                    templates: unlessTemplate.impl.templates,
                },
            ],
            elseTemplates: unlessTemplate.impl.elseTemplates,
        }, token: __assign(__assign({}, unlessTemplate.token), { raw: raw, value: value }) });
};
var parsedLiquidToHtml = function (templates, options) { return __awaiter(void 0, void 0, void 0, function () {
    function processTemplate(template, priorConditions) {
        var _a;
        if (priorConditions === void 0) { priorConditions = []; }
        return __awaiter(this, void 0, void 0, function () {
            var psuedoTemplate, currentConditions, isInsideAttribute, index, item, _i, _b, tpl, _c, _d, _e, tpl, _f, firstCond, index, item, condition, _g, _h, tpl, _j, _k, tpl, _l, _m, tpl, _o, _p, tpl, name_4, args, _q, _r, tpl, block, rawExpression, _s, _t, templateToken, _u, _v, rawToken, block, parsedSchema, liquidTagStringPieces, wrappedLiquidTags, _w, _x, _y, matched, path, currentAsset, schemaObject, schemaDefault, defaultSchemaObject_1, rawSchemaObject, sectionSettingsState, _z, _0, _1, name_5, path, directory, keyValsRe, assigns_1, assignString, key, auth, themeId, publicKey, token, currentAsset, value, _2, _3, _4, _5, _6, tpl, args_1, cycleGroup, argList, newHtml, i, _7, _8, _9;
            return __generator(this, function (_10) {
                switch (_10.label) {
                    case 0:
                        if (!isHtmlTemplate(template)) return [3 /*break*/, 1];
                        html += template.str;
                        return [3 /*break*/, 84];
                    case 1:
                        if (!(isIfTemplate(template) || isUnlessTemplate(template))) return [3 /*break*/, 18];
                        psuedoTemplate = isIfTemplate(template)
                            ? template
                            : transpileUnlessToIf(template);
                        currentConditions = priorConditions.concat({
                            expression: psuedoTemplate.token.raw,
                            negate: isUnlessTemplate(template),
                        });
                        isInsideAttribute = new RegExp("<[^>]*".concat(template.token.value)).test(template.token.input);
                        index = 0;
                        _10.label = 2;
                    case 2:
                        if (!(index < psuedoTemplate.impl.branches.length)) return [3 /*break*/, 10];
                        item = psuedoTemplate.impl.branches[index];
                        if (index === 0) {
                            html += createHtmlAttribute('if', __assign(__assign({ fullRaw: psuedoTemplate.token.raw, cond: item.cond }, (item.negate && { negate: true })), { hash: (0, object_hash_1.default)(currentConditions) }));
                        }
                        else {
                            html += createHtmlAttribute('elsif', {
                                fullRaw: "{% elsif ".concat(item.cond, " %}"),
                                cond: item.cond,
                                hash: (0, object_hash_1.default)(currentConditions),
                            });
                        }
                        if (!isInsideAttribute) return [3 /*break*/, 7];
                        _i = 0, _b = item.templates;
                        _10.label = 3;
                    case 3:
                        if (!(_i < _b.length)) return [3 /*break*/, 6];
                        tpl = _b[_i];
                        return [4 /*yield*/, processTemplate(tpl, currentConditions)];
                    case 4:
                        _10.sent();
                        _10.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        _c = html;
                        return [4 /*yield*/, processInnerTemplates(item.templates, options, currentConditions)];
                    case 8:
                        html = _c + _10.sent();
                        _10.label = 9;
                    case 9:
                        index++;
                        return [3 /*break*/, 2];
                    case 10:
                        if (!(psuedoTemplate.impl.elseTemplates && psuedoTemplate.impl.elseTemplates.length)) return [3 /*break*/, 17];
                        html += createHtmlAttribute('else', {
                            fullRaw: '{% else %}',
                        });
                        if (!isInsideAttribute) return [3 /*break*/, 15];
                        _d = 0, _e = psuedoTemplate.impl.elseTemplates;
                        _10.label = 11;
                    case 11:
                        if (!(_d < _e.length)) return [3 /*break*/, 14];
                        tpl = _e[_d];
                        return [4 /*yield*/, processTemplate(tpl)];
                    case 12:
                        _10.sent();
                        _10.label = 13;
                    case 13:
                        _d++;
                        return [3 /*break*/, 11];
                    case 14: return [3 /*break*/, 17];
                    case 15:
                        _f = html;
                        return [4 /*yield*/, processInnerTemplates(psuedoTemplate.impl.elseTemplates, options, priorConditions.concat({
                                expression: psuedoTemplate.token.raw,
                                negate: !isUnlessTemplate(template),
                            }), (0, object_hash_1.default)(currentConditions))];
                    case 16:
                        html = _f + _10.sent();
                        _10.label = 17;
                    case 17:
                        html += createHtmlAttribute('endif', {
                            fullRaw: "{% endif %}",
                        });
                        return [3 /*break*/, 84];
                    case 18:
                        if (!isCaseTemplate(template)) return [3 /*break*/, 34];
                        firstCond = '';
                        index = 0;
                        _10.label = 19;
                    case 19:
                        if (!(index < template.impl.cases.length)) return [3 /*break*/, 29];
                        item = template.impl.cases[index];
                        condition = "".concat(template.impl.cond, " == ").concat(item.val);
                        if (!(index === 0)) return [3 /*break*/, 24];
                        firstCond = condition;
                        html += createHtmlAttribute('if', {
                            fullRaw: "{% if ".concat(condition, " %}"),
                            cond: condition,
                            hash: (0, object_hash_1.default)(condition),
                        });
                        _g = 0, _h = item.templates;
                        _10.label = 20;
                    case 20:
                        if (!(_g < _h.length)) return [3 /*break*/, 23];
                        tpl = _h[_g];
                        return [4 /*yield*/, processTemplate(tpl)];
                    case 21:
                        _10.sent();
                        _10.label = 22;
                    case 22:
                        _g++;
                        return [3 /*break*/, 20];
                    case 23: return [3 /*break*/, 28];
                    case 24:
                        html += createHtmlAttribute('elsif', {
                            fullRaw: "{% elsif ".concat(condition, " %}"),
                            cond: condition,
                            hash: (0, object_hash_1.default)(firstCond),
                        });
                        _j = 0, _k = item.templates;
                        _10.label = 25;
                    case 25:
                        if (!(_j < _k.length)) return [3 /*break*/, 28];
                        tpl = _k[_j];
                        return [4 /*yield*/, processTemplate(tpl)];
                    case 26:
                        _10.sent();
                        _10.label = 27;
                    case 27:
                        _j++;
                        return [3 /*break*/, 25];
                    case 28:
                        index++;
                        return [3 /*break*/, 19];
                    case 29:
                        if (!(template.impl.elseTemplates && template.impl.elseTemplates.length)) return [3 /*break*/, 33];
                        html += createHtmlAttribute('else', {
                            fullRaw: '{% else %}',
                            hash: (0, object_hash_1.default)(firstCond),
                        });
                        _l = 0, _m = template.impl.elseTemplates;
                        _10.label = 30;
                    case 30:
                        if (!(_l < _m.length)) return [3 /*break*/, 33];
                        tpl = _m[_l];
                        return [4 /*yield*/, processTemplate(tpl)];
                    case 31:
                        _10.sent();
                        _10.label = 32;
                    case 32:
                        _l++;
                        return [3 /*break*/, 30];
                    case 33:
                        html += createHtmlAttribute('endif', {
                            fullRaw: "{% endif %}",
                        });
                        return [3 /*break*/, 84];
                    case 34:
                        if (!isForTemplate(template)) return [3 /*break*/, 39];
                        html += createHtmlAttribute('for', __assign(__assign({}, template.impl), { fullRaw: template.token.raw, templates: undefined, elseTemplates: undefined, liquid: undefined }));
                        _o = 0, _p = template.impl.templates;
                        _10.label = 35;
                    case 35:
                        if (!(_o < _p.length)) return [3 /*break*/, 38];
                        tpl = _p[_o];
                        return [4 /*yield*/, processTemplate(tpl)];
                    case 36:
                        _10.sent();
                        _10.label = 37;
                    case 37:
                        _o++;
                        return [3 /*break*/, 35];
                    case 38:
                        html += createHtmlAttribute('endfor', {
                            fullRaw: "{% endfor %}",
                        });
                        return [3 /*break*/, 84];
                    case 39:
                        if (!isOutputTemplate(template)) return [3 /*break*/, 40];
                        html += createHtmlAttribute('output', __assign(__assign({}, template.value), { raw: template.token.value, fullRaw: "{{".concat(template.token.value, "}}") }));
                        return [3 /*break*/, 84];
                    case 40:
                        name_4 = template.name || '';
                        args = template.token.args || '';
                        if (!(name_4 === 'form')) return [3 /*break*/, 45];
                        html += createHtmlAttribute('form', __assign(__assign({}, template.impl), { fullRaw: template.token.raw, templates: undefined, elseTemplates: undefined, liquid: undefined }));
                        _q = 0, _r = template.impl.templates;
                        _10.label = 41;
                    case 41:
                        if (!(_q < _r.length)) return [3 /*break*/, 44];
                        tpl = _r[_q];
                        return [4 /*yield*/, processTemplate(tpl)];
                    case 42:
                        _10.sent();
                        _10.label = 43;
                    case 43:
                        _q++;
                        return [3 /*break*/, 41];
                    case 44:
                        html += createHtmlAttribute('endform', {
                            fullRaw: "{% endform %}",
                        });
                        return [3 /*break*/, 84];
                    case 45:
                        if (!(name_4 === 'assign')) return [3 /*break*/, 46];
                        block = {
                            component: {
                                name: 'Shopify:Assign',
                                options: {
                                    expression: args || '',
                                },
                            },
                        };
                        html += serializeBlock(block);
                        return [3 /*break*/, 84];
                    case 46:
                        if (!(name_4 === 'capture')) return [3 /*break*/, 47];
                        rawExpression = '';
                        for (_s = 0, _t = template.impl.templates; _s < _t.length; _s++) {
                            templateToken = _t[_s];
                            if (templateToken.name === 'raw' && ((_a = templateToken.impl) === null || _a === void 0 ? void 0 : _a.tokens)) {
                                for (_u = 0, _v = templateToken.impl.tokens; _u < _v.length; _u++) {
                                    rawToken = _v[_u];
                                    rawExpression += rawToken.raw;
                                }
                            }
                            else {
                                rawExpression += templateToken.token.raw;
                            }
                        }
                        block = {
                            component: {
                                name: 'Shopify:Capture',
                                options: {
                                    variableName: args,
                                    expression: rawExpression.trim(),
                                },
                            },
                        };
                        html += serializeBlock(block);
                        return [3 /*break*/, 84];
                    case 47:
                        if (!(name_4 === 'schema')) return [3 /*break*/, 48];
                        parsedSchema = JSON.parse(template.impl.templates[0].token.value.replace(/\\n/g, ''));
                        html += serializeBlock({
                            layerName: "Schema",
                            component: {
                                name: 'Builder:StateProvider',
                                options: parsedSchema,
                            },
                        });
                        return [3 /*break*/, 84];
                    case 48:
                        if (!(name_4 === 'comment')) return [3 /*break*/, 49];
                        return [3 /*break*/, 84];
                    case 49:
                        if (!(name_4 === 'liquid')) return [3 /*break*/, 53];
                        liquidTagStringPieces = args
                            .trim()
                            .replace(/^liquid/gi, '')
                            .split('\n');
                        wrappedLiquidTags = liquidTagStringPieces
                            .map(function (unwrappedTag) {
                            var trimmedTag = unwrappedTag.trim();
                            if (trimmedTag) {
                                return "{% ".concat(trimmedTag, " %}");
                            }
                            return null;
                        })
                            .filter(function (liquidTag) { return !!liquidTag; });
                        _w = html;
                        _x = exports.parsedLiquidToHtml;
                        _y = exports.liquidToAst;
                        return [4 /*yield*/, (0, exports.preprocessLiquid)(wrappedLiquidTags.join(''))];
                    case 50: return [4 /*yield*/, _y.apply(void 0, [_10.sent(), options])];
                    case 51: return [4 /*yield*/, _x.apply(void 0, [_10.sent(), options])];
                    case 52:
                        html = _w + _10.sent();
                        return [3 /*break*/, 84];
                    case 53:
                        if (!(name_4 === 'javascript')) return [3 /*break*/, 54];
                        return [3 /*break*/, 84];
                    case 54:
                        if (!(name_4 === 'stylesheet')) return [3 /*break*/, 55];
                        return [3 /*break*/, 84];
                    case 55:
                        if (!(name_4 === 'section')) return [3 /*break*/, 66];
                        matched = args.match(/['"]([^'"]+)['"]/);
                        path = matched && matched[1];
                        if (!path) return [3 /*break*/, 64];
                        return [4 /*yield*/, getShopifyAsset("sections/".concat(path, ".liquid"), options)];
                    case 56:
                        currentAsset = _10.sent();
                        if (!(currentAsset && !(0, lodash_1.isError)(currentAsset) && themeSettings && !(0, lodash_1.isError)(themeSettings))) return [3 /*break*/, 62];
                        schemaObject = {};
                        schemaDefault = currentAsset.match(/{%-? schema -?%}([\s\S]*?){%-? endschema -?%}/);
                        defaultSchemaObject_1 = {};
                        if (schemaDefault === null || schemaDefault === void 0 ? void 0 : schemaDefault.length) {
                            try {
                                rawSchemaObject = JSON.parse(schemaDefault[1].trim());
                                schemaObject = rawSchemaObject;
                                rawSchemaObject.settings.forEach(function (setting) {
                                    defaultSchemaObject_1[setting.id] = setting.default;
                                });
                            }
                            catch (e) {
                                console.error('Failed to parse schema.', e);
                            }
                        }
                        if (!themeSettings.current.sections[path]) {
                            themeSettings.current.sections[path] = {};
                        }
                        sectionSettingsState = Object.assign({}, defaultSchemaObject_1, themeSettings.current.sections[path].settings);
                        themeSettings.current.sections[path].settings = sectionSettingsState;
                        if (!(options.importSections === false)) return [3 /*break*/, 57];
                        html += serializeBlock(__assign(__assign({ layerName: "".concat(humanCase(path.replace('-template', '')), " section"), component: {
                                name: 'Shopify:SectionRef',
                                options: {
                                    section: "sections/".concat(path, ".liquid"),
                                },
                            } }, ((path === 'product-template' || path === 'product') && {
                            properties: {
                                'data-slot': 'shopify:productPage',
                            },
                        })), ((path === 'collection-template' || path === 'collection') && {
                            properties: {
                                'data-slot': 'shopify:collectionPage',
                            },
                        })));
                        return [3 /*break*/, 61];
                    case 57:
                        html += serializeBlock({
                            layerName: "Section: sections/".concat(path, ".liquid"),
                            meta: {
                                identifier: 'ShopifySection',
                            },
                            component: {
                                name: 'Shopify:Section',
                                options: {
                                    template: path,
                                    shopifyMetafields: [
                                        {
                                            path: 'state.section',
                                            as: "_section_".concat((0, lodash_1.snakeCase)(path)),
                                        },
                                    ],
                                    state: {
                                        section: mapArrays(themeSettings.current.sections[path]),
                                        _sourceFile: "sections/".concat(path, ".liquid"),
                                    },
                                },
                            },
                        }, false);
                        _z = html;
                        _0 = exports.parsedLiquidToHtml;
                        _1 = exports.liquidToAst;
                        return [4 /*yield*/, (0, exports.preprocessLiquid)(currentAsset)];
                    case 58: return [4 /*yield*/, _1.apply(void 0, [_10.sent(), options])];
                    case 59: return [4 /*yield*/, _0.apply(void 0, [_10.sent(), options])];
                    case 60:
                        html = _z + _10.sent();
                        html += serializedBlockCloseTag;
                        _10.label = 61;
                    case 61: return [3 /*break*/, 63];
                    case 62:
                        // maybe should throw and block the importing ?
                        console.warn('Could not get section', currentAsset, template);
                        _10.label = 63;
                    case 63: return [3 /*break*/, 65];
                    case 64:
                        console.warn('section with no path ', args);
                        _10.label = 65;
                    case 65: return [3 /*break*/, 84];
                    case 66:
                        if (!(name_4 === 'include' || name_4 === 'render')) return [3 /*break*/, 74];
                        name_5 = args.match(/['"]([^'"]+)['"]/);
                        path = name_5 && name_5[1];
                        directory = 'snippets';
                        if (!(options.importSnippets === false)) return [3 /*break*/, 67];
                        html += serializeBlock({
                            meta: {
                                importedSnippet: args,
                            },
                            layerName: "".concat(humanCase(path || ''), " block"),
                            tagName: 'span',
                            component: {
                                name: 'Custom Code',
                                options: {
                                    code: template.token.raw,
                                    replaceNodes: true,
                                },
                            },
                        });
                        return [3 /*break*/, 73];
                    case 67:
                        keyValsRe = /,\s*([^:]+):([^,]+)/g;
                        assigns_1 = {};
                        args.replace(keyValsRe, function (match, key, value) {
                            assigns_1[key] = value;
                            return '';
                        });
                        assignString = '';
                        for (key in assigns_1) {
                            if (assigns_1.hasOwnProperty(key)) {
                                // TODO: use StateProvider for this. With getters?
                                assignString += "\n{% assign ".concat(key, " = ").concat(assigns_1[key], " %}");
                            }
                        }
                        auth = options.auth, themeId = options.themeId;
                        if (!(auth && path && themeId)) return [3 /*break*/, 73];
                        publicKey = auth.publicKey, token = auth.token;
                        if (!(publicKey && token)) return [3 /*break*/, 73];
                        html += serializeBlock({
                            layerName: "Include: ".concat(directory, "/").concat(path, ".liquid"),
                            component: {
                                name: 'Builder:StateProvider',
                                options: {
                                    state: {
                                        _sourceFile: "".concat(directory, "/").concat(path, ".liquid"),
                                    },
                                },
                            },
                        }, false);
                        return [4 /*yield*/, getShopifyAsset("".concat(directory, "/").concat(path, ".liquid"), options)];
                    case 68:
                        currentAsset = _10.sent();
                        if (!currentAsset) return [3 /*break*/, 72];
                        value = assignString + '\n' + (currentAsset || '');
                        _2 = html;
                        _3 = exports.parsedLiquidToHtml;
                        _4 = exports.liquidToAst;
                        return [4 /*yield*/, (0, exports.preprocessLiquid)(value)];
                    case 69: return [4 /*yield*/, _4.apply(void 0, [_10.sent(), options])];
                    case 70: return [4 /*yield*/, _3.apply(void 0, [_10.sent(), options])];
                    case 71:
                        html = _2 + _10.sent();
                        _10.label = 72;
                    case 72:
                        html += serializedBlockCloseTag;
                        _10.label = 73;
                    case 73: return [3 /*break*/, 84];
                    case 74:
                        if (!(name_4 === 'paginate')) return [3 /*break*/, 79];
                        // {% paginate collection.product by section.settings.product_per_page %}
                        // ...
                        // {% endpaginate %}
                        html += createHtmlAttribute('paginate', __assign(__assign({}, template.impl), { fullRaw: template.token.raw, templates: undefined, elseTemplates: undefined, liquid: undefined }));
                        _5 = 0, _6 = template.impl.templates;
                        _10.label = 75;
                    case 75:
                        if (!(_5 < _6.length)) return [3 /*break*/, 78];
                        tpl = _6[_5];
                        return [4 /*yield*/, processTemplate(tpl)];
                    case 76:
                        _10.sent();
                        _10.label = 77;
                    case 77:
                        _5++;
                        return [3 /*break*/, 75];
                    case 78:
                        html += createHtmlAttribute('endpaginate', {
                            fullRaw: "{% endpaginate %}",
                        });
                        return [3 /*break*/, 84];
                    case 79:
                        if (!(name_4 === 'cycle')) return [3 /*break*/, 83];
                        args_1 = template.token.args;
                        cycleGroup = void 0;
                        if (args_1.indexOf(':') > -1) {
                            cycleGroup = args_1.split(':')[0];
                            args_1 = args_1.split(':')[1];
                        }
                        argList = parseArgList(args_1);
                        newHtml = '';
                        for (i = 0; i < argList.length; i++) {
                            // first, check to make sure the cycle index isn't greating than the forloop
                            // then, calculate the check the remainder of current loop index divided by cycle length
                            // if it's equal to the current cycle index, display the cycle value
                            newHtml += "\n            {% assign remainder = forloop.index0| modulo:".concat(argList.length, " %}\n            {% if forloop.length >= ").concat(i, "  and remainder == ").concat(i, " %}\n              {{").concat(argList[i], "}}\n            {% endif %}");
                        }
                        _7 = html;
                        _8 = exports.parsedLiquidToHtml;
                        _9 = exports.liquidToAst;
                        return [4 /*yield*/, (0, exports.preprocessLiquid)(newHtml)];
                    case 80: return [4 /*yield*/, _9.apply(void 0, [_10.sent(), options])];
                    case 81: return [4 /*yield*/, _8.apply(void 0, [_10.sent(), options])];
                    case 82:
                        html = _7 + _10.sent();
                        return [3 /*break*/, 84];
                    case 83:
                        // TODO: make generic [liquid]="..." or something else
                        console.warn('No match for', name_4, args);
                        _10.label = 84;
                    case 84: return [2 /*return*/];
                }
            });
        });
    }
    var html, themeAsset, themeSettings, _i, templates_1, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                html = '';
                return [4 /*yield*/, getShopifyAsset('config/settings_data.json', options)];
            case 1:
                themeAsset = _a.sent();
                themeSettings = typeof themeAsset === 'string' && (0, lodash_1.attempt)(function () { return JSON.parse(themeAsset); });
                _i = 0, templates_1 = templates;
                _a.label = 2;
            case 2:
                if (!(_i < templates_1.length)) return [3 /*break*/, 5];
                item = templates_1[_i];
                return [4 /*yield*/, processTemplate(item)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, html];
        }
    });
}); };
exports.parsedLiquidToHtml = parsedLiquidToHtml;
var flattenExpressions = function (conditionsArray, value) {
    return (conditionsArray.map(function (c) { return (c.negate ? "".concat(c.expression, " {% else %}") : c.expression); }).join(' ') +
        value +
        conditionsArray.map(function () { return "{% endif %}"; }));
};
function processInnerTemplates(templates, options, priorConditions, overrideHash) {
    return __awaiter(this, void 0, void 0, function () {
        var selfCloseTags, html, processHtml;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selfCloseTags = new Set([
                        'input',
                        'link',
                        'br',
                        'base',
                        'hr',
                        'meta',
                        'img',
                        'area',
                        'col',
                        'embed',
                        'param',
                        'source',
                        'track',
                        'wbr',
                    ]);
                    return [4 /*yield*/, (0, exports.parsedLiquidToHtml)(templates, options)];
                case 1:
                    html = _a.sent();
                    processHtml = function (str) {
                        var _a, _b;
                        var result = '';
                        try {
                            // TODO: remove comments from inside str, it breaks things
                            var parsedHtml = htmlParser.parsers.html.parse(str, htmlParser.parsers, {});
                            for (var _i = 0, _c = parsedHtml.children; _i < _c.length; _i++) {
                                var node = _c[_i];
                                if (node.type === 'text') {
                                    result += node.value;
                                }
                                else if ((0, lodash_1.isNull)(node.endSourceSpan) && !selfCloseTags.has(node.name)) {
                                    var block = {
                                        tagName: node.name,
                                        bindings: {},
                                        properties: {},
                                        // not working
                                        noWrap: true,
                                        meta: {
                                            renderIf: flattenExpressions(priorConditions, 'true'),
                                            psuedoNode: {
                                                attrsList: (_a = node.attrs) === null || _a === void 0 ? void 0 : _a.map(function (_a) {
                                                    var name = _a.name, value = _a.value;
                                                    return ({
                                                        name: name,
                                                        value: value,
                                                    });
                                                }),
                                                attrsMap: node.attrMap,
                                                name: node.name,
                                                type: 1,
                                            },
                                        },
                                        component: {
                                            name: 'TempTag',
                                            options: {
                                                name: 'opencondtag',
                                                tag: node.name,
                                                hash: overrideHash || (0, object_hash_1.default)(priorConditions),
                                            },
                                        },
                                    };
                                    result += serializeBlock(block, false);
                                    var innerStr = str.substring(node.sourceSpan.end.offset);
                                    if (innerStr.replace('\n', '').trim() !== '') {
                                        result += processHtml(innerStr);
                                    }
                                    result += serializedBlockCloseTag;
                                }
                                else {
                                    result += str.substring(node.sourceSpan.start.offset, node.sourceSpan.end.offset);
                                }
                            }
                        }
                        catch (error) {
                            if (error instanceof Error && error.message.includes('Unexpected closing tag')) {
                                // template.str have an unclosed tag, extract all valid text and
                                // replace the invlalid endtag with htmlattr
                                var _d = getErrorInfo(error.message), col = _d.col, line = _d.line;
                                var errorTag = (_b = error.message.match(/Unexpected closing tag "(\s*\S*)"/)) === null || _b === void 0 ? void 0 : _b[1];
                                var preErrorTag = getSubstringTill(Number(col), Number(line), str);
                                result += preErrorTag;
                                result += createHtmlAttribute('endopencondtag', {
                                    hash: overrideHash || (priorConditions.length > 0 && (0, object_hash_1.default)(priorConditions)),
                                });
                                // 3 is length of </>
                                var leftovers = str.substring(preErrorTag.length + errorTag.length + 4);
                                if (leftovers.replace('\n', '').trim() !== '') {
                                    result += processHtml(leftovers);
                                }
                            }
                        }
                        return result;
                    };
                    return [2 /*return*/, processHtml(html)];
            }
        });
    });
}
var el = function (options) {
    return (0, __1.createBuilderElement)(__assign({ meta: __assign({ importedFrom: 'liquid' }, options === null || options === void 0 ? void 0 : options.meta) }, options));
};
var tagRe = /\[([a-z]+)\](='([^']+)')?/;
var tagReAll = /\[([^\]]+)\](='([^']+)')?/g;
var parseTags = function (tag) {
    var tags = [];
    tag.replace(tagReAll, function (match, p1, _p2, p3) {
        tags.push({
            name: htmlDecode(p1),
            value: htmlDecode(p3 || ''),
            raw: match,
        });
        return '';
    });
    return tags;
};
var parseTag = function (tag) {
    if (tag === void 0) { tag = ''; }
    var matched = tag.match(tagRe);
    return (matched && {
        name: htmlDecode(matched[1]),
        value: htmlDecode(matched[3] || ''),
        raw: htmlDecode(matched[0]),
    });
};
var hasTag = function (html) { return !!parseTag(html); };
var htmlNodeToBuilder = function (node, index, parentArray, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, element, psuedoNode, parsedBlock, children, err_1, _b, properties, bindings, imgStr, text, parsed, parsedOutput, parsedFor, parsedIf, parsedValue, translation, block;
    var _c, _d, _e;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                if (!isElement(node)) return [3 /*break*/, 11];
                if (!(node.tag === 'builder-component')) return [3 /*break*/, 2];
                _a = el;
                _c = {};
                return [4 /*yield*/, (0, exports.htmlAstToBuilder)(node.children, options)];
            case 1: return [2 /*return*/, _a.apply(void 0, [(_c.children = _h.sent(),
                        _c)])];
            case 2:
                element = void 0;
                psuedoNode = node;
                if (!(node.tag === serializedBlockTagName)) return [3 /*break*/, 7];
                _h.label = 3;
            case 3:
                _h.trys.push([3, 5, , 6]);
                parsedBlock = JSON.parse(htmlDecode(node.attrsMap.block.replace(/"/g, '\\"')));
                return [4 /*yield*/, (0, exports.htmlAstToBuilder)(node.children, options)];
            case 4:
                children = _h.sent();
                element = el(__assign(__assign({}, parsedBlock), (children.length > 0 && { children: children })));
                if ((_f = parsedBlock.meta) === null || _f === void 0 ? void 0 : _f.psuedoNode) {
                    psuedoNode = (_g = parsedBlock.meta) === null || _g === void 0 ? void 0 : _g.psuedoNode;
                    (element.properties = {}), (element.bindings = {}), delete parsedBlock.meta.psuedoNode;
                }
                else {
                    return [2 /*return*/, element];
                }
                return [3 /*break*/, 6];
            case 5:
                err_1 = _h.sent();
                console.error('Builder serialized block error', err_1, '\n\nin:', htmlDecode(node.attrsMap.block.replace(/"/g, '\\"')));
                return [2 /*return*/, el({
                        component: {
                            name: 'Text',
                            options: {
                                text: "Builder serialized block error: ".concat(String(err_1)),
                            },
                        },
                    })];
            case 6: return [3 /*break*/, 9];
            case 7:
                _b = el;
                _d = {
                    tagName: node.tag,
                    properties: {},
                    bindings: {}
                };
                return [4 /*yield*/, (0, exports.htmlAstToBuilder)(node.children, options)];
            case 8:
                element = _b.apply(void 0, [(_d.children = _h.sent(),
                        _d)]);
                _h.label = 9;
            case 9:
                properties = element.properties;
                bindings = element.bindings;
                if (psuedoNode.tag === 'img') {
                    imgStr = psuedoNode.attrsMap.src || psuedoNode.attrsMap['data-src'];
                    if (imgStr && hasTag(imgStr)) {
                        imgStr = '';
                    }
                    element.tagName = '';
                    element.component = {
                        name: 'Raw:Img',
                        options: {
                            image: imgStr,
                        },
                    };
                }
                return [4 /*yield*/, (0, exports.bindingsFromAttrs)(psuedoNode, bindings, properties, options)];
            case 10:
                _h.sent();
                return [2 /*return*/, element];
            case 11:
                if (!isTextNode(node)) return [3 /*break*/, 13];
                text = node.text;
                if (!text.trim()) {
                    return [2 /*return*/, null];
                }
                parsed = null;
                if (hasTag(text)) {
                    parsed = parseTag(text);
                    text = '';
                }
                parsedOutput = parsed && parsed.value && parsed.name === 'output' && JSON.parse(parsed.value);
                parsedFor = parsed && parsed.value && parsed.name === 'for' && JSON.parse(parsed.value);
                parsedIf = parsed && parsed.value && parsed.name === 'if' && JSON.parse(parsed.value);
                parsedValue = parsedOutput;
                return [4 /*yield*/, getTranslation(parsedValue, options)];
            case 12:
                translation = _h.sent();
                if (translation != null) {
                    text = translation;
                }
                if (parsed) {
                    if ([
                        'if',
                        'elsif',
                        'else',
                        'endif',
                        'endunless',
                        'unless',
                        'for',
                        'endfor',
                        'paginate',
                        'endpaginate',
                        'form',
                        'endform',
                        'endopencondtag',
                    ].includes(parsed.name)) {
                        return [2 /*return*/, el({
                                component: {
                                    name: 'TempNode',
                                    options: {
                                        name: parsed.name,
                                        value: parsed.value,
                                    },
                                },
                            })];
                    }
                    if (parsed.name !== 'output') {
                        console.warn('No handler for', parsed.name);
                    }
                }
                block = el({
                    // tagName: 'span',
                    bindings: __assign({}, (parsedOutput &&
                        translation == null && (_e = {},
                        _e['component.options.text'] = liquidBindingTemplate(parsedOutput.raw),
                        _e))),
                    component: {
                        name: 'Text',
                        options: { text: text },
                    },
                });
                return [2 /*return*/, block];
            case 13:
                // TODO: handle comment, etc
                console.warn('node not matched', node);
                return [2 /*return*/, null];
        }
    });
}); };
exports.htmlNodeToBuilder = htmlNodeToBuilder;
var assets = {};
var getShopifyAsset = function (assetKey, options) { return __awaiter(void 0, void 0, void 0, function () {
    var publicKey, token, themeId, key, shopifyRoot, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publicKey = options && options.auth && options.auth.publicKey;
                token = options && options.auth && options.auth.token;
                themeId = options === null || options === void 0 ? void 0 : options.themeId;
                if (!(publicKey && token && themeId)) return [3 /*break*/, 4];
                key = assetKey + themeId + publicKey;
                if (!assets[key]) return [3 /*break*/, 2];
                return [4 /*yield*/, assets[key]];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                shopifyRoot = 'https://cdn.builder.io/api/v1/shopify';
                url = "".concat(shopifyRoot, "/themes/").concat(themeId, "/assets.json?asset[key]=").concat(assetKey, "&apiKey=").concat(publicKey);
                if (options.cachebust) {
                    url += '&cachebust=true';
                }
                assets[key] = axios
                    .get(url, {
                    headers: {
                        Authorization: "Bearer ".concat(token),
                    },
                })
                    .then(function (result) { return result.data && result.data.asset && result.data.asset.value; });
                return [4 /*yield*/, assets[key]];
            case 3: return [2 /*return*/, _a.sent()];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getTranslation = function (parsedValue, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var filters, initial, translate, asset_1, _a, parsed, translationValue;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!parsedValue) {
                        return [2 /*return*/, null];
                    }
                    filters = parsedValue.filters, initial = parsedValue.initial;
                    if (!Array.isArray(filters)) return [3 /*break*/, 3];
                    translate = Boolean(filters.find(function (item) { return item.name === 't'; }));
                    if (!translate) return [3 /*break*/, 3];
                    _a = options.translations;
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, getShopifyAsset('locales/en.default.json', options)];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    asset_1 = _a;
                    parsed = typeof asset_1 === 'string' ? (0, lodash_1.attempt)(function () { return JSON.parse(asset_1); }) : asset_1;
                    if (parsed && !(0, lodash_1.isError)(parsed)) {
                        translationValue = (0, lodash_1.get)(parsed, initial.replace(/'/g, ''));
                        return [2 /*return*/, translationValue];
                    }
                    else {
                        console.warn('Could not grab translation', options);
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/, null];
            }
        });
    });
};
var liquidToAst = function (str, options) {
    if (options === void 0) { options = {}; }
    // Look for  "<tag ...> {% end"
    // FIXME: this will also throw on self closing tags like <input> but ideally should be fixed to not
    var problemMatched = str.match(/<[^\/>]+?>\s*{%[\s\-]*end/gi);
    if (problemMatched) {
        console.warn('Found invalid liquid condition around open HTML tag', problemMatched);
    }
    // Look for "{% if|unless %}</div>""
    var closeTagMatch = str.match(/{%[\s\-]*(if|unless)[^}]*%}\s*<\//gi);
    if (closeTagMatch) {
        console.warn('Found invalid liquid condition around close HTML tag', closeTagMatch);
    }
    var engine = new liquidjs_1.Liquid();
    // TODO: handle other tags
    var selfCloseTags = [
        'section',
        'render',
        'include',
        'echo',
        'liquid',
        'layout',
        'cycle',
        'break',
        'continue',
    ];
    selfCloseTags.forEach(function (tag) {
        engine.registerTag(tag, {
            parse: function (token, remainTokens) {
                this.remainTokens = remainTokens;
                this.templates = [];
                this.type = 'block';
                this.blockType = 'selfClose';
                this.name = tag;
                this.args = token.args;
            },
            render: function () { return null; },
        });
    });
    var nonLiquidBlockTags = ['style', 'stylesheet', 'javascript', 'schema'];
    nonLiquidBlockTags.forEach(function (tag) {
        engine.registerTag(tag, {
            parse: function (token, remainTokens) {
                var _this = this;
                this.remainTokens = remainTokens;
                this.tokens = [];
                this.type = 'block';
                this.blockType = 'nonLiquidBlock';
                this.name = tag;
                this.args = token.args;
                this.tokens = [];
                var stream = this.liquid.parser.parseStream(remainTokens);
                stream
                    .on('token', function (token) {
                    if (token.name === 'end' + tag)
                        stream.stop();
                    else
                        _this.tokens.push(token);
                })
                    .on('end', function () {
                    throw new Error("tag ".concat(token.raw, " not closed"));
                });
                stream.start();
            },
            render: function () { return null; },
        });
    });
    var blockTags = ['form', 'paginate', 'schema'];
    blockTags.forEach(function (tag) {
        engine.registerTag(tag, {
            parse: function (token, remainTokens) {
                var _this = this;
                this.remainTokens = remainTokens;
                this.templates = [];
                this.type = 'block';
                this.name = tag;
                this.args = token.args;
                var stream = this.liquid.parser
                    .parseStream(remainTokens)
                    .on('tag:end' + tag, function () { return stream.stop(); })
                    .on('template', function (tpl) { return _this.templates.push(tpl); })
                    .on('end', function () {
                    throw new Error("tag ".concat(token.raw, " not closed"));
                });
                stream.start();
            },
            render: function () { return null; },
        });
    });
    var parsedTemplateItems = engine.parse(str);
    return parsedTemplateItems;
};
exports.liquidToAst = liquidToAst;
var bindingsPlaceholder = '__B__';
var htmlToAst = function (html) {
    // https://github.com/vuejs/vue/blob/dev/src/platforms/web/compiler/modules/class.js#L19
    var ast = compiler.compile("<template>".concat(html.replace(/(class|style)=/g, "".concat(bindingsPlaceholder, "$1=")), "</template>")).ast.children;
    var processed = (0, exports.postProcessHtmlAstNodes)((0, lodash_1.cloneDeep)(ast));
    return { htmlNodes: processed, preprocessed: ast };
};
exports.htmlToAst = htmlToAst;
var isBuilderElement = function (el) {
    return Boolean(el && typeof el === 'object' && el['@type'] === '@builder.io/sdk:Element');
};
var isBuilderElementArray = function (obj) {
    return Boolean(obj && Array.isArray(obj) && obj[0] && isBuilderElement(obj[0]));
};
var getNextBuilderSiblings = function (el, parentArray) {
    var index = parentArray.indexOf(el);
    if (index === -1) {
        console.log('node', el, parentArray);
        throw new Error('El is not in parentArray');
    }
    return parentArray.slice(index + 1);
};
var tempNodeInfo = function (el) {
    var component = el.component;
    if (component) {
        var componentName = component.name, options = component.options;
        if (componentName === 'TempNode') {
            var name_6 = options.name, value = options.value;
            return { value: value, name: name_6 };
        }
    }
    return { name: null, value: null };
};
var tempTagInfo = function (el) {
    var component = el.component;
    if (component) {
        var componentName = component.name, options = component.options;
        if (componentName === 'TempTag') {
            var name_7 = options.name, value = options.value;
            return { value: value, name: name_7 };
        }
    }
    return { name: null, value: null };
};
var getTextNode = function (str) { return ({
    static: true,
    type: 3,
    text: str,
}); };
var separateTagsAndText = function (text) {
    var str = (text || '').trim();
    var textItems = [];
    var tags = parseTags(str);
    if (!tags.length) {
        return [getTextNode(str)];
    }
    var result = [];
    var currentIndex = 0;
    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
        var tag = tags_1[_i];
        var index = str.indexOf(tag.raw, currentIndex);
        textItems.push(str.slice(currentIndex, index));
        currentIndex = index + tag.raw.length;
    }
    var lastRaw = (0, lodash_1.last)(tags).raw;
    var lastIndex = text.lastIndexOf(lastRaw) + lastRaw.length;
    textItems.push(str.slice(lastIndex));
    for (var i = 0; i < tags.length; i++) {
        if (textItems[i] && textItems[i].trim()) {
            result.push(getTextNode(textItems[i]));
        }
        result.push(getTextNode(tags[i].raw));
    }
    if (textItems[tags.length] && textItems[tags.length].trim()) {
        result.push(getTextNode(textItems[tags.length] || ''));
    }
    return result;
};
exports.separateTagsAndText = separateTagsAndText;
var debugLoops = false;
var isArrayWithTextNode = function (obj) {
    return Array.isArray(obj) && obj.find(function (item) { return isTextNode(item); });
};
var postProcessHtmlAstNodes = function (nodes) {
    var updated = true;
    var i = 0;
    var latest = nodes;
    while (updated) {
        if (i++ > (debugLoops ? 3 : 1000)) {
            console.warn('Too many updates');
            break;
        }
        updated = false;
        // tslint:disable-next-line:ter-prefer-arrow-callback
        latest = (0, traverse_1.default)(latest).forEach(function (current) {
            var _a;
            if ((current === null || current === void 0 ? void 0 : current.name) && current.name.startsWith(bindingsPlaceholder)) {
                this.update(__assign(__assign({}, current), { name: current.name.replace(bindingsPlaceholder, '') }));
            }
            else if (current) {
                var prop = Object.keys(current).find(function (key) { return key.startsWith(bindingsPlaceholder); });
                if (prop) {
                    this.update(__assign(__assign({}, (0, lodash_1.omit)(current, prop)), (_a = {}, _a[prop === null || prop === void 0 ? void 0 : prop.replace(bindingsPlaceholder, '')] = current[prop], _a)));
                }
            }
            if (!isArrayWithTextNode(current)) {
                return;
            }
            for (var _i = 0, current_1 = current; _i < current_1.length; _i++) {
                var item = current_1[_i];
                if (!isTextNode(item)) {
                    continue;
                }
                var parent_1 = current;
                var text = item.text;
                var separated = (0, exports.separateTagsAndText)(text);
                if (separated.length > 1) {
                    updated = true;
                    this.update(__spreadArray(__spreadArray(__spreadArray([], parent_1.slice(0, parent_1.indexOf(item)), true), separated, true), parent_1.slice(parent_1.indexOf(item) + 1), true), true);
                    break;
                }
            }
        });
    }
    return latest;
};
exports.postProcessHtmlAstNodes = postProcessHtmlAstNodes;
var isCondition = function (el) { var _a; return ((_a = el.component) === null || _a === void 0 ? void 0 : _a.name) === 'Shopify:Condition'; };
var isOpenConditionalTag = function (el) { var _a; return ((_a = el.component) === null || _a === void 0 ? void 0 : _a.name) === 'Shopify:ConditionalTag'; };
var isEndConditionalTag = function (el) { var _a, _b; return ((_b = (_a = el.component) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.name) === 'endopencondtag'; };
var moveCondtionalTagsUp = function (nodes) {
    var updated = true;
    var i = 0;
    while (updated) {
        if (i++ > (debugLoops ? 4 : 1000)) {
            console.warn('Too many updates');
            break;
        }
        updated = false;
        // tslint:disable-next-line:ter-prefer-arrow-callback
        nodes = (0, traverse_1.default)(nodes).forEach(function (current) {
            var _a;
            if (!isBuilderElementArray(current)) {
                return;
            }
            for (var currentIndex = 0; currentIndex < current.length; currentIndex++) {
                var ejected = null;
                var condition = current[currentIndex];
                if (!isCondition(condition)) {
                    return;
                }
                var branches = condition.component.options.branches;
                var branchIndex = -1;
                for (var _i = 0, branches_1 = branches; _i < branches_1.length; _i++) {
                    var branch = branches_1[_i];
                    branchIndex++;
                    var ejectedIndex = branch.blocks.findIndex(function (block, blockIndex) {
                        var name = tempTagInfo(block).name;
                        return name === 'opencondtag';
                    });
                    if (ejectedIndex > -1) {
                        var oldBlocks = branch.blocks;
                        ejected = (_a = branch.blocks) === null || _a === void 0 ? void 0 : _a[ejectedIndex];
                        var newBlocks = __spreadArray(__spreadArray(__spreadArray([], ((oldBlocks === null || oldBlocks === void 0 ? void 0 : oldBlocks.slice(0, ejectedIndex)) || []), true), (ejected.children || []), true), ((oldBlocks === null || oldBlocks === void 0 ? void 0 : oldBlocks.slice(ejectedIndex + 1)) || []), true);
                        var updatedCondition = __assign(__assign({}, condition), { component: __assign(__assign({}, condition.component), { options: __assign(__assign({}, condition.component.options), { branches: __spreadArray(__spreadArray(__spreadArray([], branches.slice(0, branchIndex), true), [
                                        __assign(__assign({}, branch), { blocks: newBlocks })
                                    ], false), branches.slice(branchIndex + 1), true) }) }) });
                        this.update(__spreadArray(__spreadArray(__spreadArray([], current.slice(0, currentIndex), true), [
                            __assign(__assign({}, ejected), { meta: __assign(__assign({}, ejected.meta), { originalIndex: ejectedIndex, branchIndex: branchIndex }), component: __assign(__assign({}, ejected.component), { name: 'Shopify:ConditionalTag' }), children: [updatedCondition] })
                        ], false), current.slice(currentIndex + 1), true), true);
                        break;
                    }
                }
                if (ejected) {
                    updated = true;
                    break;
                }
            }
        });
    }
    return nodes;
};
var matchConditionalTagsWithEndings = function (nodes) {
    var updated = true;
    var i = 0;
    while (updated) {
        if (i++ > (debugLoops ? 4 : 1000)) {
            console.warn('Too many updates');
            break;
        }
        updated = false;
        // tslint:disable-next-line:ter-prefer-arrow-callback
        nodes = (0, traverse_1.default)(nodes).forEach(function (current) {
            var _a, _b;
            if (!isBuilderElementArray(current)) {
                return;
            }
            var _loop_2 = function (currentIndex) {
                var node = current[currentIndex];
                if (!isOpenConditionalTag(node) || this_1.key === 'conditionalTags') {
                    return { value: void 0 };
                }
                var conditionalTags = [(0, lodash_1.omit)(node, 'children')];
                var tag = node;
                var originalIndex = node.meta.originalIndex;
                var branchIndex = node.meta.branchIndex;
                while (tag.children) {
                    tag = tag.children[0];
                    if (isOpenConditionalTag(tag)) {
                        conditionalTags.push((0, lodash_1.omit)(tag, 'children'));
                    }
                    else {
                        break;
                    }
                }
                var endTag = current
                    .slice(currentIndex + 1)
                    .findIndex(function (el) {
                    var _a, _b;
                    return isEndConditionalTag(el) &&
                        ((_a = el.component) === null || _a === void 0 ? void 0 : _a.options.hash) === ((_b = node.component) === null || _b === void 0 ? void 0 : _b.options.hash);
                });
                if (endTag === -1) {
                    // TODO try to recover by finding the next shopify condition with the same hash
                    endTag =
                        current
                            .slice(currentIndex + 1)
                            .findIndex(function (el) { var _a, _b; return isCondition(el) && ((_a = el.component) === null || _a === void 0 ? void 0 : _a.options.hash) === ((_b = node.component) === null || _b === void 0 ? void 0 : _b.options.hash); }) + 1;
                    if (endTag === 0) {
                        throw Error("no endTag for a conditional ".concat((_a = node.component) === null || _a === void 0 ? void 0 : _a.options.hash));
                    }
                }
                // cursor at condition now
                var condition = tag;
                var hoistedCondition = null;
                /* originalIndex is where the open tag was, e.g
                  {% if test %} TEXT<span> in span</span> <div class = '''>
                  it'll be 2,
                */
                if (originalIndex > 0) {
                    var originalBranch = (0, lodash_1.cloneDeep)((_b = condition.component) === null || _b === void 0 ? void 0 : _b.options.branches[branchIndex]);
                    hoistedCondition = (0, lodash_1.mergeWith)({}, condition, {
                        component: {
                            options: {
                                isHoisted: true,
                                branches: [
                                    __assign(__assign({}, originalBranch), { blocks: originalBranch.blocks.slice(0, originalIndex) }),
                                ],
                            },
                        },
                    }, function (_, dest) {
                        // always prefer arrays from destination, (third arg above)
                        if (Array.isArray(dest)) {
                            return dest;
                        }
                    });
                    condition = (0, lodash_1.mergeWith)({}, condition, {
                        component: {
                            options: {
                                branches: __spreadArray(__spreadArray(__spreadArray([], condition.component.options.branches.slice(0, branchIndex), true), [
                                    __assign(__assign({}, originalBranch), { blocks: originalBranch.blocks.slice(originalIndex) })
                                ], false), condition.component.options.branches.slice(branchIndex + 1), true),
                            },
                        },
                    }, function (_, dest) {
                        // always prefer arrays from destination, (third arg above)
                        if (Array.isArray(dest)) {
                            return dest;
                        }
                    });
                }
                this_1.update(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], current.slice(0, currentIndex), true), (hoistedCondition ? [hoistedCondition] : []), true), [
                    el({
                        // TODO: lookout for tempnodes in condition blocks
                        children: __spreadArray([condition], current.slice(currentIndex + 1, endTag), true),
                        component: {
                            name: 'Shopify:WrapperTag',
                            options: {
                                conditionalTags: conditionalTags,
                            },
                        },
                    })
                ], false), current.slice(currentIndex + endTag + 2), true), true);
                updated = true;
            };
            var this_1 = this;
            for (var currentIndex = 0; currentIndex < current.length; currentIndex++) {
                var state_1 = _loop_2(currentIndex);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        });
    }
    return nodes;
};
var postProcessBuilderTree = function (nodes, options) { return __awaiter(void 0, void 0, void 0, function () {
    var updated, i, latest;
    return __generator(this, function (_a) {
        updated = true;
        i = 0;
        latest = nodes;
        while (updated) {
            if (i++ > (debugLoops ? 3 : 1000)) {
                console.warn('Too many updates');
                break;
            }
            updated = false;
            // tslint:disable-next-line:ter-prefer-arrow-callback
            latest = (0, traverse_1.default)(latest).forEach(function (current) {
                var _a, _b, _c, _d, _e, _f;
                if (!isBuilderElementArray(current)) {
                    return;
                }
                var _loop_3 = function (item) {
                    // TODO: add support for {% javascript %} and {% stylesheet %} here as well:
                    // https://shopify.dev/tutorials/develop-theme-use-sections#id
                    if (((_a = item.meta) === null || _a === void 0 ? void 0 : _a.identifier) === 'ShopifySection') {
                        // haven't updated the section layer yet if no schema, try to process
                        var schema = (_b = item.component) === null || _b === void 0 ? void 0 : _b.options.schema;
                        if (!schema) {
                            var schemaBlock = (_c = item.children) === null || _c === void 0 ? void 0 : _c.find(function (child) {
                                return child.layerName === 'Schema';
                            });
                            if (schemaBlock) {
                                item.component.options.schema = (_d = schemaBlock.component) === null || _d === void 0 ? void 0 : _d.options;
                                if (!item.component.options.section) {
                                    item.component.options.section = {
                                        name: '',
                                        settings: {},
                                    };
                                }
                                var settings = item.component.options.section.settings;
                                for (var _g = 0, _h = (_e = schemaBlock.component) === null || _e === void 0 ? void 0 : _e.options.settings; _g < _h.length; _g++) {
                                    var setting = _h[_g];
                                    var name_8 = setting.id;
                                    // TODO: sometimes shopify templates are using settings but they don't have a default or a config in the settings_data.json but somehow have a value?
                                    if (typeof settings[name_8] === 'undefined' &&
                                        typeof setting.default !== 'undefined') {
                                        settings[name_8] = setting.default;
                                    }
                                }
                            }
                            else {
                                console.warn('This section has no schema!');
                                // Put an object here so we know we tried to process so the above condition doesn't match anymore
                                item.component.options.schema = {};
                            }
                            updated = true;
                            return { value: this_2.stop() };
                        }
                    }
                    var _j = tempNodeInfo(item), name_9 = _j.name, value = _j.value;
                    var parsedValue = value && (0, lodash_1.attempt)(function () { return JSON.parse(value); });
                    if (name_9) {
                        var isBlockStart = ['for', 'if', 'unless', 'paginate', 'form'].includes(name_9);
                        if (isBlockStart) {
                            var parent_2 = current;
                            // Could be fucked.... could have no close tag... or be in wrong palce...
                            // Handle this later.
                            var nextSiblings = getNextBuilderSiblings(item, parent_2);
                            var skip_1 = 0;
                            // TODO: maybe reverse traverse for end tag like compylr...
                            var endTag = nextSiblings.find(function (el) {
                                var siblingName = tempNodeInfo(el).name;
                                if (name_9 === siblingName) {
                                    skip_1++;
                                    return false;
                                }
                                var matches = siblingName === 'end' + name_9;
                                if (matches) {
                                    if (skip_1) {
                                        skip_1--;
                                    }
                                    else {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            if (!endTag) {
                                console.warn("Did not find end tag for tag: \"".concat(name_9, "\""), item.component.options.value);
                            }
                            else {
                                updated = true;
                                var skip_2 = 0;
                                var midTags = nextSiblings.slice(0, parent_2.indexOf(endTag)).filter(function (el) {
                                    var siblingName = tempNodeInfo(el).name;
                                    if ('if' === siblingName || siblingName === 'unless') {
                                        skip_2++;
                                        return false;
                                    }
                                    var matches = siblingName === 'endunless' || siblingName === 'endif';
                                    if (matches) {
                                        if (skip_2) {
                                            skip_2--;
                                        }
                                        else {
                                            // TODO: short circuit
                                            return false;
                                        }
                                    }
                                    if (!skip_2 && ['else', 'elsif'].includes(siblingName)) {
                                        return true;
                                    }
                                    return false;
                                });
                                if (name_9 === 'if') {
                                    var allTags = [item].concat(midTags).concat([endTag]);
                                    var branches = [];
                                    for (var i_1 = 0; i_1 < allTags.length; i_1++) {
                                        var tag = allTags[i_1];
                                        var info = tempNodeInfo(tag);
                                        if (info.name === 'endif') {
                                            break;
                                        }
                                        var nextTag = allTags[i_1 + 1];
                                        var parsedValue_1 = info.value && JSON.parse(info.value);
                                        branches.push({
                                            expression: parsedValue_1.cond
                                                ? "".concat(parsedValue_1.negate ? '!' : '').concat(liquidConditionTemplate(parsedValue_1.cond))
                                                : '',
                                            blocks: parent_2.slice(parent_2.indexOf(tag) + 1, parent_2.indexOf(nextTag)),
                                        });
                                    }
                                    this_2.update(__spreadArray(__spreadArray(__spreadArray([], parent_2.slice(0, parent_2.indexOf(item)), true), [
                                        el({
                                            component: {
                                                name: 'Shopify:Condition',
                                                options: {
                                                    hash: parsedValue.hash,
                                                    branches: branches,
                                                },
                                            },
                                        })
                                    ], false), parent_2.slice(parent_2.indexOf(endTag) + 1), true), true);
                                }
                                // else if (name === 'unless') {
                                //unless is rewritten as a Shopify:Condition component
                                // }
                                else if (name_9 === 'paginate') {
                                    var allTags = [item].concat(midTags).concat([endTag]);
                                    var options_1 = {};
                                    for (var i_2 = 0; i_2 < allTags.length; i_2++) {
                                        var tag = allTags[i_2];
                                        var info = tempNodeInfo(tag);
                                        if (info.name === 'endpaginate') {
                                            break;
                                        }
                                        var parsedValue_2 = info.value && JSON.parse(info.value);
                                        var _k = parsedValue_2.args.split(/\s+by\s*/), expression = _k[0], limit = _k[1];
                                        options_1.expression = expression;
                                        options_1.limit = limit;
                                    }
                                    this_2.update(__spreadArray(__spreadArray(__spreadArray([], parent_2.slice(0, parent_2.indexOf(item)), true), [
                                        el({
                                            component: {
                                                options: options_1,
                                                name: 'Shopify:Paginate',
                                            },
                                            children: parent_2.slice(parent_2.indexOf(item) + 1, parent_2.indexOf(endTag)),
                                        })
                                    ], false), parent_2.slice(parent_2.indexOf(endTag) + 1), true), true);
                                }
                                else if (name_9 === 'form') {
                                    var allTags = [item].concat(midTags).concat([endTag]);
                                    var options_2 = {};
                                    for (var i_3 = 0; i_3 < allTags.length; i_3++) {
                                        var tag = allTags[i_3];
                                        var info = tempNodeInfo(tag);
                                        if (info.name === 'endform') {
                                            break;
                                        }
                                        var parsedValue_3 = info.value && JSON.parse(info.value);
                                        var args = parseArgList(parsedValue_3.args);
                                        options_2.type = (_f = args.shift()) === null || _f === void 0 ? void 0 : _f.replace(/"/g, '').replace(/'/g, '');
                                        options_2.parameter = null;
                                        options_2.customAttributes = null;
                                        if (args.length && !args[0].includes(':')) {
                                            options_2.parameter = args.shift();
                                        }
                                        if (args.length) {
                                            options_2.customAttributes = args;
                                        }
                                    }
                                    this_2.update(__spreadArray(__spreadArray(__spreadArray([], parent_2.slice(0, parent_2.indexOf(item)), true), [
                                        el({
                                            component: {
                                                options: options_2,
                                                name: 'Shopify:Form',
                                            },
                                            children: parent_2.slice(parent_2.indexOf(item) + 1, parent_2.indexOf(endTag)),
                                        })
                                    ], false), parent_2.slice(parent_2.indexOf(endTag) + 1), true), true);
                                }
                                else if (name_9 === 'for') {
                                    var options_3 = {
                                        repeat: {
                                            itemName: parsedValue.variable,
                                            collection: parsedValue.collection,
                                            expression: parsedValue.fullRaw,
                                        },
                                    };
                                    this_2.update(__spreadArray(__spreadArray(__spreadArray([], parent_2.slice(0, parent_2.indexOf(item)), true), [
                                        el({
                                            component: {
                                                options: options_3,
                                                name: 'Shopify:For',
                                            },
                                            children: parent_2.slice(parent_2.indexOf(item) + 1, parent_2.indexOf(endTag)),
                                        })
                                    ], false), parent_2.slice(parent_2.indexOf(endTag) + 1), true), true);
                                }
                                else {
                                    this_2.update(__spreadArray(__spreadArray(__spreadArray([], parent_2.slice(0, parent_2.indexOf(item)), true), [
                                        el(__assign(__assign({ component: {
                                                name: 'Core:Fragment',
                                            }, bindings: {} }, (name_9 === 'for' &&
                                            !(0, lodash_1.isError)(parsedValue) && {
                                            repeat: {
                                                itemName: parsedValue.variable,
                                                collection: liquidBindingTemplate(parsedValue.collection),
                                            },
                                        })), { children: parent_2.slice(parent_2.indexOf(item) + 1, parent_2.indexOf(endTag)) }))
                                    ], false), parent_2.slice(parent_2.indexOf(endTag) + 1), true), true);
                                }
                                return "break";
                            }
                        }
                    }
                };
                var this_2 = this;
                for (var _i = 0, current_2 = current; _i < current_2.length; _i++) {
                    var item = current_2[_i];
                    var state_2 = _loop_3(item);
                    if (typeof state_2 === "object")
                        return state_2.value;
                    if (state_2 === "break")
                        break;
                }
            });
        }
        latest = moveCondtionalTagsUp(latest);
        latest = matchConditionalTagsWithEndings(latest);
        return [2 /*return*/, latest];
    });
}); };
exports.postProcessBuilderTree = postProcessBuilderTree;
var htmlAstToBuilder = function (nodes, options) { return __awaiter(void 0, void 0, void 0, function () {
    var els, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = lodash_1.compact;
                _b = lodash_1.flatten;
                return [4 /*yield*/, Promise.all(nodes
                        .filter(function (node) { return isTextNode(node) || isElement(node); })
                        .map(function (node, index, nodes) { return (0, exports.htmlNodeToBuilder)(node, index, nodes, options); }))];
            case 1:
                els = _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]);
                return [2 /*return*/, els];
        }
    });
}); };
exports.htmlAstToBuilder = htmlAstToBuilder;
var processedAstToBuilder = function (nodes, options) { return __awaiter(void 0, void 0, void 0, function () {
    var els, processed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.htmlAstToBuilder)(nodes, options)];
            case 1:
                els = _a.sent();
                return [4 /*yield*/, (0, exports.postProcessBuilderTree)((0, fast_clone_1.fastClone)(els), options)];
            case 2:
                processed = _a.sent();
                return [2 /*return*/, { blocks: processed, preprocessed: els }];
        }
    });
}); };
exports.processedAstToBuilder = processedAstToBuilder;
var htmlDebugString = function (els) {
    var str = els.map(function (el) { return htmlDebugNodeString(el); }).join('\n');
    return (0, exports.tryFormat)(str);
};
exports.htmlDebugString = htmlDebugString;
var tryFormat = function (str) {
    try {
        return (0, standalone_1.format)(str, {
            parser: 'html',
            htmlWhitespaceSensitivity: 'ignore',
            plugins: [htmlParser],
        });
    }
    catch (err) {
        console.warn('Prettier failed', err);
        return str;
    }
};
exports.tryFormat = tryFormat;
var htmlDebugNodeString = function (el) {
    var tagName = (el.component && el.component.name) || el.tagName;
    var properties = [];
    for (var property in el.properties) {
        var value = el.properties[property];
        if (property !== 'attr') {
            properties.push([property, value]);
        }
        else {
            for (var attr in value) {
                properties.push([attr, value[attr]]);
            }
        }
    }
    for (var binding in el.bindings) {
        properties.push([':' + binding, el.bindings[binding]]);
    }
    if (el.component && el.component.options) {
        for (var property in el.component.options) {
            var value = el.component.options[property];
            if (value && typeof value === 'object') {
                value = JSON.stringify(value);
            }
            properties.push(['@' + property, String(value)]);
        }
    }
    return "<".concat(tagName, " ").concat(properties.reduce(function (memo, tuple) { return memo + " ".concat(tuple[0], "=\"").concat((tuple[1] || '').replace(/"/g, '`'), "\""); }, ''), "\n    ").concat(el.children && el.children.length
        ? ">".concat(el.children.map(function (child) { return htmlDebugNodeString(child); }).join('\n'), "</").concat(tagName, ">")
        : '/>', "\n  ");
};
/**
 * This function is the first step, before we turn the liquid into an AST.
 * It is used to make certain changes to the liquid string that are much
 * easier to do before we process it. Examples of this include rewriting
 * certain tags to a format we already know how to parse, or fixing common
 * liquid template errors that cause problems during import.
 *
 * Note: there are a lot of regexes in here, and they can be confusing!
 * If you are trying to debug something that includes a regex, try using
 * a tool like https://regex101.com/ to break down what is going on.
 */
var preprocessLiquid = function (liquid, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var processedLiquid, captureGroupRegex, matchedCaptureGroup, allCaptureGroupMatches, match, capturedVariableName, capturedContents, capturedContentsHasLiquid, capturedContentContainsCaptureTag, capturedVariableReplaceRegex, _i, allCaptureGroupMatches_1, captureMatch, captureReplacement, includesWithRegex, includesWithAndValuesRegex, templateContainsRegex, booleanHTMLAttributes, _loop_4, _a, booleanHTMLAttributes_1, booleanAttribute, themeAsset, themeSettings, contentForIndexTemplates, contentForIndexLiquidStrings_1, contentForIndexRegex;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    processedLiquid = liquid || '';
                    captureGroupRegex = /{%-?\s*capture\s*(.+?)-?%}([\s\S]*?){%-?\s*endcapture\s*-?%}/gi;
                    allCaptureGroupMatches = [];
                    while ((matchedCaptureGroup = captureGroupRegex.exec(processedLiquid)) !== null) {
                        match = matchedCaptureGroup[0], capturedVariableName = matchedCaptureGroup[1], capturedContents = matchedCaptureGroup[2];
                        capturedContentsHasLiquid = capturedContents === null || capturedContents === void 0 ? void 0 : capturedContents.match(/\{%/gim);
                        capturedContentContainsCaptureTag = capturedContents === null || capturedContents === void 0 ? void 0 : capturedContents.match(/{%-?\s*capture/gim);
                        if (capturedVariableName && capturedContentsHasLiquid && !capturedContentContainsCaptureTag) {
                            // We want to find a replace any instances of the captured variable in the template, i.e. {{ my_variable }}
                            allCaptureGroupMatches.push({
                                match: match,
                                capturedVariableName: capturedVariableName,
                                capturedContents: capturedContents,
                            });
                            capturedVariableReplaceRegex = new RegExp("{{-?\\s*".concat(capturedVariableName.trim(), "\\s*-?}}"), 'gi');
                            processedLiquid = processedLiquid.replace(capturedVariableReplaceRegex, capturedContents);
                        }
                        else if (capturedContentContainsCaptureTag) {
                            console.warn('Capture tag preprocess contained nested capture tag', {
                                match: match,
                                capturedVariableName: capturedVariableName,
                                capturedContents: capturedContents,
                            });
                        }
                    }
                    // For any capture tag that we found, we still want to add it to the state
                    // even though we replaced any {{ captured_variable }} tags with the actual contents
                    // of the capture. The reason for this is so that expressions like:
                    //
                    // {% capture headlines%}....{% endcapture %}
                    // {% assign headline_length = headlines | split: '^' | size %}
                    //
                    // will still work
                    if (allCaptureGroupMatches.length) {
                        for (_i = 0, allCaptureGroupMatches_1 = allCaptureGroupMatches; _i < allCaptureGroupMatches_1.length; _i++) {
                            captureMatch = allCaptureGroupMatches_1[_i];
                            captureReplacement = "{% capture ".concat(captureMatch.capturedVariableName, " %}{% raw %}").concat(captureMatch.capturedContents, "{% endraw %}{% endcapture %}");
                            processedLiquid = processedLiquid.replace(captureMatch.match, captureReplacement);
                        }
                    }
                    includesWithRegex = /{%-?\s*include\s*([\S]+?)\s*with\s*([\S]+?)\s*-?%}/gi;
                    processedLiquid = processedLiquid.replace(includesWithRegex, function (fullIncludesMatch, templateName, withMatch) {
                        var templateNameCleaned = templateName.trim().replace(/'/g, '').replace(/"/g, '');
                        return "{% include '".concat(templateNameCleaned, "', ").concat(templateNameCleaned, ": ").concat(withMatch, " %}");
                    });
                    includesWithAndValuesRegex = /{%-?\s*include\s*([\S]+?)\s*with\s*(([\S]+?:\s*[\S]+?,?\s*)+)-?%}/gi;
                    processedLiquid = processedLiquid.replace(includesWithAndValuesRegex, function (fullIncludesMatch, templateName, allKeysAndValues) {
                        var templateNameCleaned = templateName.trim().replace(/'/g, '').replace(/"/g, '');
                        var allKeysAndValuesCleaned = allKeysAndValues.trim().replace(/\s+/g, ' ');
                        return "{% include '".concat(templateNameCleaned, "', ").concat(allKeysAndValuesCleaned, " %}");
                    });
                    templateContainsRegex = /{%-?(.+?)template\s+contains\s+(.+?)-?%}/gi;
                    processedLiquid = processedLiquid.replace(templateContainsRegex, function (fullTemplateMatch, templatePrefixText, templatePostfixText) {
                        return "{% ".concat(templatePrefixText, " template.name contains ").concat(templatePostfixText, " %}");
                    });
                    booleanHTMLAttributes = ['checked', 'disabled', 'selected'];
                    _loop_4 = function (booleanAttribute) {
                        var booleanAttributeRegex = new RegExp("<[\\s\\S]*?(".concat(booleanAttribute, "{%)[\\s\\S]*?>"), 'gi');
                        processedLiquid = processedLiquid.replace(booleanAttributeRegex, function (fullMatch, attributeMatch) {
                            return fullMatch.replace("".concat(attributeMatch), "".concat(booleanAttribute, " {%"));
                        });
                    };
                    for (_a = 0, booleanHTMLAttributes_1 = booleanHTMLAttributes; _a < booleanHTMLAttributes_1.length; _a++) {
                        booleanAttribute = booleanHTMLAttributes_1[_a];
                        _loop_4(booleanAttribute);
                    }
                    return [4 /*yield*/, getShopifyAsset('config/settings_data.json', options)];
                case 1:
                    themeAsset = _e.sent();
                    themeSettings = typeof themeAsset === 'string' && (0, lodash_1.attempt)(function () { return JSON.parse(themeAsset); });
                    if (themeSettings && !(0, lodash_1.isError)(themeSettings)) {
                        contentForIndexTemplates = ((_b = themeSettings.current) === null || _b === void 0 ? void 0 : _b.content_for_index) || ((_d = (_c = themeSettings.presets) === null || _c === void 0 ? void 0 : _c.Default) === null || _d === void 0 ? void 0 : _d.content_for_index);
                        if (contentForIndexTemplates.length) {
                            contentForIndexLiquidStrings_1 = contentForIndexTemplates.map(function (template) { return "{% section '".concat(template, "' %}"); });
                            contentForIndexRegex = /{{\s*content_for_index\s*}}/gi;
                            processedLiquid = processedLiquid.replace(contentForIndexRegex, function (fullMatch) {
                                return fullMatch.replace(fullMatch, contentForIndexLiquidStrings_1.join(''));
                            });
                        }
                    }
                    return [2 /*return*/, processedLiquid];
            }
        });
    });
};
exports.preprocessLiquid = preprocessLiquid;
var liquidToBuilder = function (liquid, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var preprocessedLiquid, scriptRe, scriptsInLiquid, parsedTemplateItems, html, themeAsset, themeSettings, serialized, htmlNodes, blocks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (options.log) {
                        console.log('liquidToBuilder: liquid', { liquid: liquid });
                    }
                    return [4 /*yield*/, (0, exports.preprocessLiquid)(liquid, options)];
                case 1:
                    preprocessedLiquid = _a.sent();
                    if (options.log) {
                        console.log('preprocessedLiquid: ', { preprocessedLiquid: preprocessedLiquid });
                    }
                    scriptRe = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
                    scriptsInLiquid = preprocessedLiquid.match(scriptRe);
                    parsedTemplateItems = (0, exports.liquidToAst)(preprocessedLiquid.replace(scriptRe, ''), options);
                    if (options.log) {
                        console.log('liquidToBuilder: parsed liquid', parsedTemplateItems);
                    }
                    return [4 /*yield*/, (0, exports.parsedLiquidToHtml)(parsedTemplateItems, options)];
                case 2:
                    html = _a.sent();
                    return [4 /*yield*/, getShopifyAsset('config/settings_data.json', options)];
                case 3:
                    themeAsset = _a.sent();
                    themeSettings = typeof themeAsset === 'string' && (0, lodash_1.attempt)(function () { return JSON.parse(themeAsset); });
                    if (themeSettings && !(0, lodash_1.isError)(themeSettings) && options.importSections !== false) {
                        serialized = serializeBlock({
                            layerName: "Theme Settings",
                            component: {
                                name: 'Shopify:ThemeProvider',
                                options: {
                                    shopifyMetafields: [{ path: 'state.settings', as: '_theme_settings' }],
                                    state: {
                                        settings: mapArrays((0, lodash_1.omit)(themeSettings.current, 'sections')),
                                    },
                                },
                            },
                        }, false);
                        html = "".concat(serialized).concat(html).concat(serializedBlockCloseTag);
                    }
                    if (options.log) {
                        console.log('liquidToBuilder: html', { html: html });
                    }
                    htmlNodes = (0, exports.htmlToAst)(html).htmlNodes;
                    if (options.log) {
                        console.log('liquidToBuilder: parsed html', htmlNodes);
                    }
                    return [4 /*yield*/, (0, exports.processedAstToBuilder)(htmlNodes, options)];
                case 4:
                    blocks = (_a.sent()).blocks;
                    if (Array.isArray(scriptsInLiquid) && scriptsInLiquid.length > 0) {
                        blocks.push(el({
                            layerName: 'Imported Script',
                            component: {
                                name: 'Custom Code',
                                options: {
                                    code: scriptsInLiquid.join(''),
                                    replaceNodes: true,
                                },
                            },
                        }));
                    }
                    if (options.importSections !== false) {
                        // TODO: special option for this
                        // blocks.unshift(
                        //   el({
                        //     layerName: 'BuiltWithBuilder flag',
                        //     component: {
                        //       name: 'Custom Code',
                        //       options: {
                        //         code: '<script>window.builtWithBuilder = true</script>',
                        //       },
                        //     },
                        //   }),
                        // );
                    }
                    if (options.log) {
                        console.log('liquidToBuilder: blocks', JSON.stringify(blocks));
                    }
                    return [2 /*return*/, blocks];
            }
        });
    });
};
exports.liquidToBuilder = liquidToBuilder;
var htmlToBuilder = function (html) { return __awaiter(void 0, void 0, void 0, function () {
    var htmlNodes, blocks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                htmlNodes = (0, exports.htmlToAst)(html).htmlNodes;
                console.log('procesed', htmlNodes);
                return [4 /*yield*/, (0, exports.processedAstToBuilder)(htmlNodes, {})];
            case 1:
                blocks = (_a.sent()).blocks;
                console.log('blocks', blocks);
                return [2 /*return*/, blocks];
        }
    });
}); };
exports.htmlToBuilder = htmlToBuilder;
var bindingsFromAttrs = function (node, bindings, properties, options) { return __awaiter(void 0, void 0, void 0, function () {
    var getIndexOfClosingTag, getConditionalValue, parseAttrsInRange;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getIndexOfClosingTag = function (start, closingTags) {
                    var i = start;
                    var cursor = 1;
                    while (i < node.attrsList.length) {
                        var name_10 = node.attrsList[i].name;
                        if (name_10 === '[if]') {
                            if (!closingTags.includes('[else]')) {
                                throw new Error('if after else');
                            }
                            cursor++;
                        }
                        if (closingTags.includes(name_10)) {
                            cursor--;
                            if (cursor === 0) {
                                return i;
                            }
                        }
                        i++;
                    }
                    throw new Error("".concat(cursor, "  no matching closing tag"));
                };
                getConditionalValue = function (conditions, value, defaultValue) {
                    return conditions.length > 0
                        ? "/*start*/".concat(conditions
                            .map(function (c) { return "".concat(c.negate ? '!' : '').concat(liquidConditionTemplate(c.expression)); })
                            .join('&&') + " ? ".concat(value, " : (").concat(defaultValue, ")"), "/*end*/")
                        : value;
                };
                parseAttrsInRange = function (start, end, conditions) { return __awaiter(void 0, void 0, void 0, function () {
                    var i, keyForImage, _a, name_11, value, key, jump, stuff, elseConditions, liquidStr, useKey, parsed, parsedValue, translation, useKey;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                i = start;
                                keyForImage = '';
                                _b.label = 1;
                            case 1:
                                if (!(i < end)) return [3 /*break*/, 15];
                                _a = node.attrsList[i], name_11 = _a.name, value = _a.value;
                                key = name_11;
                                jump = 1;
                                if (!hasTag(key)) return [3 /*break*/, 10];
                                stuff = JSON.parse(htmlDecode(value));
                                if (!(key === '[if]')) return [3 /*break*/, 3];
                                jump = getIndexOfClosingTag(i + 1, ['[endif]']);
                                return [4 /*yield*/, parseAttrsInRange(i + 1, jump, conditions.concat([{ expression: stuff.cond, negate: stuff.negate }]))];
                            case 2:
                                _b.sent();
                                return [3 /*break*/, 9];
                            case 3:
                                if (!(key === '[unless]')) return [3 /*break*/, 5];
                                jump = getIndexOfClosingTag(i + 1, ['[endunless]']);
                                return [4 /*yield*/, parseAttrsInRange(i + 1, jump, conditions.concat([{ expression: stuff.cond, negate: true }]))];
                            case 4:
                                _b.sent();
                                return [3 /*break*/, 9];
                            case 5:
                                if (!(key === '[else]')) return [3 /*break*/, 7];
                                jump = getIndexOfClosingTag(i + 1, ['[endif]']);
                                return [4 /*yield*/, parseAttrsInRange(i + 1, jump, conditions.map(function (cond) { return (__assign(__assign({}, cond), { negate: !cond.negate })); }))];
                            case 6:
                                _b.sent();
                                return [3 /*break*/, 9];
                            case 7:
                                if (!(key === '[elsif]')) return [3 /*break*/, 9];
                                jump = getIndexOfClosingTag(i + 1, ['[elsif]', '[endif]']);
                                elseConditions = conditions.map(function (cond) { return (__assign(__assign({}, cond), { negate: !cond.negate })); });
                                return [4 /*yield*/, parseAttrsInRange(i + 1, jump, elseConditions.concat([{ expression: stuff.cond }]))];
                            case 8:
                                _b.sent();
                                _b.label = 9;
                            case 9: return [3 /*break*/, 14];
                            case 10:
                                if (!hasTag(value)) return [3 /*break*/, 13];
                                liquidStr = stringWithBindingsToLiquid(value);
                                // Remove trailing semi-colon because the liquid render function does not know how to handle it
                                liquidStr = liquidStr === null || liquidStr === void 0 ? void 0 : liquidStr.replace(/;$/, '');
                                useKey = key;
                                if ((keyForImage == key || (!keyForImage && (key === 'src' || key === 'data-src'))) &&
                                    node.tag === 'img') {
                                    useKey = 'component.options.image';
                                    keyForImage = key;
                                }
                                if (key === 'data-srcset' && node.tag === 'img') {
                                    useKey = 'srcset';
                                }
                                if (useKey === 'style') {
                                    useKey = 'attr.style';
                                }
                                bindings[useKey] = getConditionalValue(conditions, liquidRenderTemplate(liquidStr), bindings[useKey]);
                                parsed = parseTag(value);
                                if (!(parsed && parsed.value && parsed.name === 'output')) return [3 /*break*/, 12];
                                parsedValue = JSON.parse(parsed.value);
                                return [4 /*yield*/, getTranslation(parsedValue, options)];
                            case 11:
                                translation = _b.sent();
                                if (translation !== null) {
                                    if (conditions.length === 0) {
                                        delete bindings[key];
                                        properties[key] = translation;
                                    }
                                    else {
                                        bindings[key] = getConditionalValue(conditions, "'".concat(translation, "'"), bindings[key]);
                                    }
                                }
                                _b.label = 12;
                            case 12: return [3 /*break*/, 14];
                            case 13:
                                if (key === 'style' && conditions.length === 0) {
                                    if (!properties.attr) {
                                        // TODO: use another property? hm
                                        properties.attr = {};
                                    }
                                    properties.attr.style = value;
                                    console.warn('skipping style', value);
                                }
                                else if (key.includes('[')) {
                                    console.warn('Found property key with [', key);
                                }
                                else {
                                    if (conditions.length > 0) {
                                        useKey = key === 'style' ? 'attr.style' : key;
                                        bindings[useKey] = getConditionalValue(conditions, "'".concat(value, "'"), bindings[useKey]);
                                    }
                                    else {
                                        properties[key] = value;
                                    }
                                    // TEMP HACK FOR LAZY IMAGES
                                    if (key === 'data-src') {
                                        properties.src = value;
                                    }
                                }
                                _b.label = 14;
                            case 14:
                                i += jump;
                                return [3 /*break*/, 1];
                            case 15: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, parseAttrsInRange(0, node.attrsList.length, [])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.bindingsFromAttrs = bindingsFromAttrs;
