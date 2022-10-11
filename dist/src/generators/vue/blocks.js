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
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var is_children_1 = __importDefault(require("../../helpers/is-children"));
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var remove_surrounding_block_1 = require("../../helpers/remove-surrounding-block");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var slots_1 = require("../../helpers/slots");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var jsx_1 = require("../../parsers/jsx");
var helpers_1 = require("./helpers");
var SPECIAL_PROPERTIES = {
    V_IF: 'v-if',
    V_FOR: 'v-for',
    V_ELSE: 'v-else',
    V_ELSE_IF: 'v-else-if',
};
// TODO: Maybe in the future allow defining `string | function` as values
var BINDING_MAPPERS = {
    innerHTML: 'v-html',
};
var NODE_MAPPERS = {
    Fragment: function (json, options, scope) {
        if (options.vueVersion === 2 && (scope === null || scope === void 0 ? void 0 : scope.isRootNode)) {
            throw new Error('Vue 2 template should have a single root element');
        }
        return json.children.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('\n');
    },
    For: function (_json, options) {
        var _a, _b;
        var _c;
        var json = _json;
        var keyValue = json.bindings.key || { code: 'index' };
        var forValue = "(".concat(json.scope.forName, ", index) in ").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_c = json.bindings.each) === null || _c === void 0 ? void 0 : _c.code));
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
        var ifValue = (0, slots_1.replaceSlotsInString)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_g = json.bindings.when) === null || _g === void 0 ? void 0 : _g.code), function (slotName) { return "$slots.".concat(slotName); });
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
                            var childIfValue = (0, function_1.pipe)((_c = child.bindings.when) === null || _c === void 0 ? void 0 : _c.code, strip_state_and_props_refs_1.stripStateAndPropsRefs);
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
                    var childIfValue = (0, function_1.pipe)((_h = firstChild.bindings.when) === null || _h === void 0 ? void 0 : _h.code, strip_state_and_props_refs_1.stripStateAndPropsRefs, helpers_1.invertBooleanExpression);
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
        var _a, _b;
        if (!json.bindings.name) {
            var key = Object.keys(json.bindings).find(Boolean);
            if (!key)
                return '<slot />';
            return "\n        <template #".concat(key, ">\n        ").concat((_a = json.bindings[key]) === null || _a === void 0 ? void 0 : _a.code, "\n        </template>\n      ");
        }
        var strippedTextCode = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings.name.code);
        return "<slot name=\"".concat((0, slots_1.stripSlotPrefix)(strippedTextCode).toLowerCase(), "\">").concat((_b = json.children) === null || _b === void 0 ? void 0 : _b.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('\n'), "</slot>");
    },
};
var stringifyBinding = function (node) {
    return function (_a) {
        var key = _a[0], value = _a[1];
        if (key === '_spread') {
            return '';
        }
        else if (key === 'class') {
            return " :class=\"_classStringToObject(".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value === null || value === void 0 ? void 0 : value.code, {
                replaceWith: '',
            }), ")\" ");
            // TODO: support dynamic classes as objects somehow like Vue requires
            // https://vuejs.org/v2/guide/class-and-style.html
        }
        else {
            // TODO: proper babel transform to replace. Util for this
            var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value === null || value === void 0 ? void 0 : value.code);
            if (key.startsWith('on')) {
                var _b = value.arguments, cusArgs = _b === void 0 ? ['event'] : _b;
                var event_1 = key.replace('on', '').toLowerCase();
                if (event_1 === 'change' && node.name === 'input') {
                    event_1 = 'input';
                }
                var isAssignmentExpression = useValue.includes('=');
                var valueWRenamedEvent = (0, replace_identifiers_1.replaceIdentifiers)({
                    code: useValue,
                    from: cusArgs[0],
                    to: '$event',
                });
                // TODO: proper babel transform to replace. Util for this
                if (isAssignmentExpression) {
                    return " @".concat(event_1, "=\"").concat((0, helpers_1.encodeQuotes)((0, remove_surrounding_block_1.removeSurroundingBlock)(valueWRenamedEvent)), "\" ");
                }
                else {
                    return " @".concat(event_1, "=\"").concat((0, helpers_1.encodeQuotes)((0, remove_surrounding_block_1.removeSurroundingBlock)((0, remove_surrounding_block_1.removeSurroundingBlock)(valueWRenamedEvent))), "\" ");
                }
            }
            else if (key === 'ref') {
                return " ref=\"".concat((0, helpers_1.encodeQuotes)(useValue), "\" ");
            }
            else if (BINDING_MAPPERS[key]) {
                return " ".concat(BINDING_MAPPERS[key], "=\"").concat((0, helpers_1.encodeQuotes)(useValue.replace(/"/g, "\\'")), "\" ");
            }
            else {
                return " :".concat(key, "=\"").concat((0, helpers_1.encodeQuotes)(useValue), "\" ");
            }
        }
    };
};
var blockToVue = function (node, options, scope) {
    var _a, _b;
    var nodeMapper = NODE_MAPPERS[node.name];
    if (nodeMapper) {
        return nodeMapper(node, options, scope);
    }
    if ((0, is_children_1.default)(node)) {
        return "<slot/>";
    }
    if (node.name === 'style') {
        // Vue doesn't allow <style>...</style> in templates, but does support the synonymous
        // <component is="'style'">...</component>
        node.name = 'component';
        node.bindings.is = { code: "'style'" };
    }
    if (node.properties._text) {
        return "".concat(node.properties._text);
    }
    var textCode = (_a = node.bindings._text) === null || _a === void 0 ? void 0 : _a.code;
    if (textCode) {
        var strippedTextCode = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(textCode);
        if ((0, slots_1.isSlotProperty)(strippedTextCode)) {
            return "<slot name=\"".concat((0, slots_1.stripSlotPrefix)(strippedTextCode).toLowerCase(), "\"/>");
        }
        return "{{".concat(strippedTextCode, "}}");
    }
    var str = '';
    str += "<".concat(node.name, " ");
    if ((_b = node.bindings._spread) === null || _b === void 0 ? void 0 : _b.code) {
        str += "v-bind=\"".concat((0, helpers_1.encodeQuotes)((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(node.bindings._spread.code)), "\"");
    }
    for (var key in node.properties) {
        var value = node.properties[key];
        if (key === 'className') {
            continue;
        }
        else if (key === SPECIAL_PROPERTIES.V_ELSE) {
            str += " ".concat(key, " ");
        }
        else if (typeof value === 'string') {
            str += " ".concat(key, "=\"").concat((0, helpers_1.encodeQuotes)(value), "\" ");
        }
    }
    var stringifiedBindings = Object.entries(node.bindings)
        .map(function (_a) {
        var k = _a[0], v = _a[1];
        return stringifyBinding(node)([k, v]);
    })
        .join('');
    str += stringifiedBindings;
    if (jsx_1.selfClosingTags.has(node.name)) {
        return str + ' />';
    }
    str += '>';
    if (node.children) {
        str += node.children.map(function (item) { return (0, exports.blockToVue)(item, options); }).join('');
    }
    return str + "</".concat(node.name, ">");
};
exports.blockToVue = blockToVue;