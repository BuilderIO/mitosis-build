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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockToVue = void 0;
var function_1 = require("fp-ts/lib/function");
var html_tags_1 = require("../../constants/html_tags");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var is_children_1 = __importDefault(require("../../helpers/is-children"));
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var nullable_1 = require("../../helpers/nullable");
var remove_surrounding_block_1 = require("../../helpers/remove-surrounding-block");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var slots_1 = require("../../helpers/slots");
var helpers_1 = require("./helpers");
var SPECIAL_PROPERTIES = {
    V_IF: 'v-if',
    V_FOR: 'v-for',
    V_ELSE: 'v-else',
    V_ELSE_IF: 'v-else-if',
    V_ON: 'v-on',
    V_ON_AT: '@',
    V_BIND: 'v-bind',
};
/**
 * blockToVue executed after processBinding,
 * when processBinding is executed,
 * SLOT_PREFIX from `slot` change to `$slots.`
 */
var SLOT_PREFIX = '$slots.';
// TODO: Maybe in the future allow defining `string | function` as values
var BINDING_MAPPERS = {
    innerHTML: 'v-html',
};
var NODE_MAPPERS = {
    Fragment: function (json, options, scope) {
        var children = json.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes);
        var shouldAddDivFallback = options.vueVersion === 2 && (scope === null || scope === void 0 ? void 0 : scope.isRootNode) && children.length > 1;
        var childrenStr = children.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('\n');
        if (shouldAddDivFallback) {
            console.warn('WARNING: Vue 2 forbids multiple root elements. You provided a root Fragment with multiple elements. Wrapping elements in div as a workaround.');
            return "<div>".concat(childrenStr, "</div>");
        }
        else {
            return childrenStr;
        }
    },
    For: function (_json, options) {
        var _a, _b;
        var _c;
        var json = _json;
        var keyValue = json.bindings.key || { code: 'index', type: 'single' };
        var forValue = "(".concat(json.scope.forName, ", index) in ").concat((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code);
        if (options.vueVersion >= 3) {
            // TODO: tmk key goes on different element (parent vs child) based on Vue 2 vs Vue 3
            return "<template :key=\"".concat((0, helpers_1.encodeQuotes)((keyValue === null || keyValue === void 0 ? void 0 : keyValue.code) || 'index'), "\" v-for=\"").concat((0, helpers_1.encodeQuotes)(forValue), "\">\n        ").concat(json.children.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('\n'), "\n      </template>");
        }
        // Vue 2 can only handle one root element
        var firstChild = json.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes)[0];
        // Edge-case for when the parent is a `Show`, we need to pass down the `v-if` prop.
        var jsonIf = json.properties[SPECIAL_PROPERTIES.V_IF];
        return firstChild
            ? (0, function_1.pipe)(firstChild, (0, helpers_1.addBindingsToJson)({ key: keyValue }), (0, helpers_1.addPropertiesToJson)(__assign((_a = {}, _a[SPECIAL_PROPERTIES.V_FOR] = forValue, _a), (jsonIf ? (_b = {}, _b[SPECIAL_PROPERTIES.V_IF] = jsonIf, _b) : {}))), function (block) { return (0, exports.blockToVue)(block, options); })
            : '';
    },
    Show: function (json, options, scope) {
        var _a, _b, _c, _d, _e, _f;
        var _g, _h;
        var ifValue = ((_g = json.bindings.when) === null || _g === void 0 ? void 0 : _g.code) || '';
        var defaultShowTemplate = "\n    <template ".concat(SPECIAL_PROPERTIES.V_IF, "=\"").concat((0, helpers_1.encodeQuotes)(ifValue), "\">\n      ").concat(json.children.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('\n'), "\n    </template>\n    ").concat((0, is_mitosis_node_1.isMitosisNode)(json.meta.else)
            ? "\n        <template ".concat(SPECIAL_PROPERTIES.V_ELSE, ">\n          ").concat((0, exports.blockToVue)(json.meta.else, options), "\n        </template>")
            : '', "\n    ");
        switch (options.vueVersion) {
            case 3:
                return defaultShowTemplate;
            case 2:
                // if it is not the root node, the default show template can be used
                // as Vue 2 only has this limitation at root level
                if (!(scope === null || scope === void 0 ? void 0 : scope.isRootNode)) {
                    return defaultShowTemplate;
                }
                var children_1 = json.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes);
                // Vue 2 can only handle one root element, so we just take the first one.
                // TO-DO: warn user of multi-children Show.
                var firstChild = children_1[0];
                var elseBlock = json.meta.else;
                var hasShowChild = (firstChild === null || firstChild === void 0 ? void 0 : firstChild.name) === 'Show';
                var childElseBlock = firstChild === null || firstChild === void 0 ? void 0 : firstChild.meta.else;
                var allShowChildrenWithoutElse = children_1.every(function (x) { return x.name === 'Show' && !x.meta.else; });
                if (allShowChildrenWithoutElse && (0, is_mitosis_node_1.isMitosisNode)(elseBlock)) {
                    /**
                     * This is when we mimic an if-else chain by only providing `Show` elements as children, none of which have an `else` block
                     *
                     * <show when={foo} else={else-1}>
                     *  <show when={bar}> <bar-code> </show>
                     *  <show when={x}> <x-code> </show>
                     *  <show when={y}> <y-code> </show>
                     * </show>
                     *
                     * What we want in this case is:
                     *
                     * <else-1 if={!foo} />
                     * <bar-code v-else-if={bar} />
                     * <x-code v-else-if={x} />
                     * <y-code v-else />
                     */
                    var ifString = (0, function_1.pipe)(elseBlock, (0, helpers_1.addPropertiesToJson)((_a = {}, _a[SPECIAL_PROPERTIES.V_IF] = (0, helpers_1.invertBooleanExpression)(ifValue), _a)), function (block) { return (0, exports.blockToVue)(block, options); });
                    var childrenStrings = children_1.map(function (child, idx) {
                        var _a, _b;
                        var _c;
                        var isLast = idx === children_1.length - 1;
                        var innerBlock = child.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes)[0];
                        if (!isLast) {
                            var childIfValue = (_c = child.bindings.when) === null || _c === void 0 ? void 0 : _c.code;
                            var elseIfString = (0, function_1.pipe)(innerBlock, (0, helpers_1.addPropertiesToJson)((_a = {}, _a[SPECIAL_PROPERTIES.V_ELSE_IF] = childIfValue, _a)), function (block) { return (0, exports.blockToVue)(block, options); });
                            return elseIfString;
                        }
                        else {
                            var elseString = (0, function_1.pipe)(innerBlock, (0, helpers_1.addPropertiesToJson)((_b = {}, _b[SPECIAL_PROPERTIES.V_ELSE] = '', _b)), function (block) { return (0, exports.blockToVue)(block, options); });
                            return elseString;
                        }
                    });
                    return "\n            ".concat(ifString, "\n            ").concat(childrenStrings.join('\n'), "\n          ");
                }
                else if (firstChild &&
                    (0, is_mitosis_node_1.isMitosisNode)(elseBlock) &&
                    hasShowChild &&
                    (0, is_mitosis_node_1.isMitosisNode)(childElseBlock)) {
                    /**
                     * This is special edge logic to handle 2 nested Show elements in Vue 2.
                     * We need to invert the logic to make it work, due to no-template-root-element limitations in Vue 2.
                     *
                     * <show when={foo} else={else-1}>
                     *  <show when={bar}> <bar-code> </show>
                     *
                     *  <show when={x}> <x-code> </show>
                     *
                     *  <show when={y}> <y-code> </show>
                     * </show>
                     *
                     *
                     *
                     *
                     * foo: true && bar: true => if-code
                     * foo: true && bar: false => else-2
                     * foo: false && bar: true?? => else-1
                     *
                     *
                     * map to:
                     *
                     * <else-1 if={!foo} />
                     * <else-2 v-else-if={!bar} />
                     * <if-code v-else />
                     *
                     */
                    var ifString = (0, function_1.pipe)(elseBlock, (0, helpers_1.addPropertiesToJson)((_b = {}, _b[SPECIAL_PROPERTIES.V_IF] = (0, helpers_1.invertBooleanExpression)(ifValue), _b)), function (block) { return (0, exports.blockToVue)(block, options); });
                    var childIfValue = (0, function_1.pipe)(((_h = firstChild.bindings.when) === null || _h === void 0 ? void 0 : _h.code) || '', helpers_1.invertBooleanExpression);
                    var elseIfString = (0, function_1.pipe)(childElseBlock, (0, helpers_1.addPropertiesToJson)((_c = {}, _c[SPECIAL_PROPERTIES.V_ELSE_IF] = childIfValue, _c)), function (block) { return (0, exports.blockToVue)(block, options); });
                    var firstChildOfFirstChild = firstChild.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes)[0];
                    var elseString = firstChildOfFirstChild
                        ? (0, function_1.pipe)(firstChildOfFirstChild, (0, helpers_1.addPropertiesToJson)((_d = {}, _d[SPECIAL_PROPERTIES.V_ELSE] = '', _d)), function (block) { return (0, exports.blockToVue)(block, options); })
                        : '';
                    return "\n\n            ".concat(ifString, "\n\n            ").concat(elseIfString, "\n\n            ").concat(elseString, "\n\n          ");
                }
                else {
                    var ifString = firstChild
                        ? (0, function_1.pipe)(firstChild, (0, helpers_1.addPropertiesToJson)((_e = {}, _e[SPECIAL_PROPERTIES.V_IF] = ifValue, _e)), function (block) { return (0, exports.blockToVue)(block, options); })
                        : '';
                    var elseString = (0, is_mitosis_node_1.isMitosisNode)(elseBlock)
                        ? (0, function_1.pipe)(elseBlock, (0, helpers_1.addPropertiesToJson)((_f = {}, _f[SPECIAL_PROPERTIES.V_ELSE] = '', _f)), function (block) {
                            return (0, exports.blockToVue)(block, options);
                        })
                        : '';
                    return "\n                    ".concat(ifString, "\n                    ").concat(elseString, "\n                  ");
                }
        }
    },
    Slot: function (json, options) {
        var _a, _b, _c;
        var slotName = ((_a = json.bindings.name) === null || _a === void 0 ? void 0 : _a.code) || json.properties.name;
        var renderChildren = function () { var _a; return (_a = json.children) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('\n'); };
        if (!slotName) {
            var key = Object.keys(json.bindings).find(Boolean);
            if (!key) {
                if (!((_b = json.children) === null || _b === void 0 ? void 0 : _b.length)) {
                    return '<slot/>';
                }
                return "<slot>".concat(renderChildren(), "</slot>");
            }
            return "\n        <template #".concat(key, ">\n          ").concat((_c = json.bindings[key]) === null || _c === void 0 ? void 0 : _c.code, "\n        </template>\n      ");
        }
        if (slotName === 'default') {
            return "<slot>".concat(renderChildren(), "</slot>");
        }
        return "<slot name=\"".concat((0, slots_1.stripSlotPrefix)(slotName, SLOT_PREFIX).toLowerCase(), "\">").concat(renderChildren(), "</slot>");
    },
};
var SPECIAL_HTML_TAGS = ['style', 'script'];
var stringifyBinding = function (node) {
    return function (_a) {
        var key = _a[0], value = _a[1];
        var isValidHtmlTag = html_tags_1.VALID_HTML_TAGS.includes(node.name);
        if (value.type === 'spread') {
            return ''; // we handle this after
        }
        else if (key === 'class') {
            return ":class=\"_classStringToObject(".concat(value === null || value === void 0 ? void 0 : value.code, ")\"");
            // TODO: support dynamic classes as objects somehow like Vue requires
            // https://vuejs.org/v2/guide/class-and-style.html
        }
        else {
            // TODO: proper babel transform to replace. Util for this
            var useValue = (value === null || value === void 0 ? void 0 : value.code) || '';
            if (key.startsWith('on') && isValidHtmlTag) {
                // handle html native on[event] props
                var _b = value.arguments, cusArgs = _b === void 0 ? ['event'] : _b;
                var event_1 = key.replace('on', '').toLowerCase();
                var isAssignmentExpression = useValue.includes('=');
                var eventHandlerValue = (0, function_1.pipe)((0, replace_identifiers_1.replaceIdentifiers)({
                    code: useValue,
                    from: cusArgs[0],
                    to: '$event',
                }), isAssignmentExpression ? function_1.identity : remove_surrounding_block_1.removeSurroundingBlock, remove_surrounding_block_1.removeSurroundingBlock, helpers_1.encodeQuotes);
                var eventHandlerKey = "".concat(SPECIAL_PROPERTIES.V_ON_AT).concat(event_1);
                return "".concat(eventHandlerKey, "=\"").concat(eventHandlerValue, "\"");
            }
            else if (key.startsWith('on')) {
                // handle on[custom event] props
                var _c = node.bindings[key].arguments, cusArgs = _c === void 0 ? ['event'] : _c;
                return ":".concat(key, "=\"(").concat(cusArgs.join(','), ") => ").concat((0, helpers_1.encodeQuotes)(useValue), "\"");
            }
            else if (key === 'ref') {
                return "ref=\"".concat((0, helpers_1.encodeQuotes)(useValue), "\"");
            }
            else if (BINDING_MAPPERS[key]) {
                return "".concat(BINDING_MAPPERS[key], "=\"").concat((0, helpers_1.encodeQuotes)(useValue.replace(/"/g, "\\'")), "\"");
            }
            else {
                return ":".concat(key, "=\"").concat((0, helpers_1.encodeQuotes)(useValue), "\"");
            }
        }
    };
};
var stringifySpreads = function (_a) {
    var node = _a.node, spreadType = _a.spreadType;
    var spreads = Object.values(node.bindings)
        .filter(nullable_1.checkIsDefined)
        .filter(function (binding) { return binding.type === 'spread' && binding.spreadType === spreadType; })
        .map(function (value) { return (value.code === 'props' ? '$props' : value.code); });
    if (spreads.length === 0) {
        return '';
    }
    var stringifiedValue = spreads.length > 1 ? "{".concat(spreads.map(function (spread) { return "...".concat(spread); }).join(', '), "}") : spreads[0];
    var key = spreadType === 'normal' ? SPECIAL_PROPERTIES.V_BIND : SPECIAL_PROPERTIES.V_ON;
    return " ".concat(key, "=\"").concat((0, helpers_1.encodeQuotes)(stringifiedValue), "\" ");
};
var getBlockBindings = function (node) {
    var stringifiedProperties = Object.entries(node.properties)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        if (key === 'className') {
            return '';
        }
        else if (key === SPECIAL_PROPERTIES.V_ELSE) {
            return "".concat(key);
        }
        else if (typeof value === 'string') {
            return "".concat(key, "=\"").concat((0, helpers_1.encodeQuotes)(value), "\"");
        }
    })
        .join(' ');
    var stringifiedBindings = Object.entries(node.bindings)
        .map(stringifyBinding(node))
        .join(' ');
    return [
        stringifiedProperties,
        stringifiedBindings,
        stringifySpreads({ node: node, spreadType: 'normal' }),
        stringifySpreads({ node: node, spreadType: 'event-handlers' }),
    ].join(' ');
};
var blockToVue = function (node, options, scope) {
    var _a;
    var nodeMapper = NODE_MAPPERS[node.name];
    if (nodeMapper) {
        return nodeMapper(node, options, scope);
    }
    if ((0, is_children_1.default)({ node: node })) {
        return "<slot/>";
    }
    if (SPECIAL_HTML_TAGS.includes(node.name)) {
        // Vue doesn't allow style/script tags in templates, but does support them through dynamic components.
        node.bindings.is = { code: "'".concat(node.name, "'"), type: 'single' };
        node.name = 'component';
    }
    if (node.properties._text) {
        return "".concat(node.properties._text);
    }
    var textCode = (_a = node.bindings._text) === null || _a === void 0 ? void 0 : _a.code;
    if (textCode) {
        if ((0, slots_1.isSlotProperty)(textCode, SLOT_PREFIX)) {
            var slotName = (0, slots_1.stripSlotPrefix)(textCode, SLOT_PREFIX).toLowerCase();
            if (slotName === 'default')
                return "<slot/>";
            return "<slot name=\"".concat(slotName, "\"/>");
        }
        return "{{".concat(textCode, "}}");
    }
    var str = "<".concat(node.name, " ");
    str += getBlockBindings(node);
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(node.name)) {
        return str + ' />';
    }
    str += '>';
    if (node.children) {
        str += node.children.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('');
    }
    return str + "</".concat(node.name, ">");
};
exports.blockToVue = blockToVue;
