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
exports.componentToReact = exports.componentToPreact = exports.blockToReact = exports.contextPropDrillingKey = void 0;
var dedent_1 = __importDefault(require("dedent"));
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var collect_css_1 = require("../../helpers/styles/collect-css");
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var fast_clone_1 = require("../../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../../helpers/filter-empty-text-nodes");
var get_refs_1 = require("../../helpers/get-refs");
var get_props_ref_1 = require("../../helpers/get-props-ref");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var getters_to_functions_1 = require("../../helpers/getters-to-functions");
var handle_missing_state_1 = require("../../helpers/handle-missing-state");
var is_valid_attribute_name_1 = require("../../helpers/is-valid-attribute-name");
var map_refs_1 = require("../../helpers/map-refs");
var process_http_requests_1 = require("../../helpers/process-http-requests");
var process_tag_references_1 = require("../../helpers/process-tag-references");
var render_imports_1 = require("../../helpers/render-imports");
var replace_new_lines_in_strings_1 = require("../../helpers/replace-new-lines-in-strings");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var plugins_1 = require("../../modules/plugins");
var jsx_1 = require("../../parsers/jsx");
var context_1 = require("../helpers/context");
var react_native_1 = require("../react-native");
var collect_styled_components_1 = require("../../helpers/styles/collect-styled-components");
var helpers_1 = require("../../helpers/styles/helpers");
var state_1 = require("../../helpers/state");
var state_2 = require("./state");
var helpers_2 = require("./helpers");
var hash_sum_1 = __importDefault(require("hash-sum"));
var for_1 = require("../../helpers/nodes/for");
exports.contextPropDrillingKey = '_context';
var openFrag = function (options) { return getFragment('open', options); };
var closeFrag = function (options) { return getFragment('close', options); };
function getFragment(type, options) {
    var tagName = options.preact ? 'Fragment' : '';
    return type === 'open' ? "<".concat(tagName, ">") : "</".concat(tagName, ">");
}
/**
 * If the root Mitosis component only has 1 child, and it is a `Show`/`For` node, then we need to wrap it in a fragment.
 * Otherwise, we end up with invalid React render code.
 *
 */
var isRootSpecialNode = function (json) {
    return json.children.length === 1 && ['Show', 'For'].includes(json.children[0].name);
};
var wrapInFragment = function (json) { return json.children.length !== 1; };
var NODE_MAPPERS = {
    Slot: function (json, options, parentSlots) {
        var _a;
        if (!json.bindings.name) {
            // TODO: update MitosisNode for simple code
            var key = Object.keys(json.bindings).find(Boolean);
            if (key && parentSlots) {
                var propKey = (0, lodash_1.camelCase)('Slot' + key[0].toUpperCase() + key.substring(1));
                parentSlots.push({ key: propKey, value: (_a = json.bindings[key]) === null || _a === void 0 ? void 0 : _a.code });
                return '';
            }
            return "{".concat((0, helpers_2.processBinding)('props.children', options), "}");
        }
        var slotProp = (0, helpers_2.processBinding)(json.bindings.name.code, options).replace('name=', '');
        return "{".concat(slotProp, "}");
    },
    Fragment: function (json, options) {
        var wrap = wrapInFragment(json);
        return "".concat(wrap ? getFragment('open', options) : '').concat(json.children
            .map(function (item) { return (0, exports.blockToReact)(item, options); })
            .join('\n')).concat(wrap ? getFragment('close', options) : '');
    },
    For: function (_json, options) {
        var _a;
        var json = _json;
        var wrap = wrapInFragment(json);
        var forArguments = (0, for_1.getForArguments)(json).join(', ');
        return "{".concat((0, helpers_2.processBinding)((_a = json.bindings.each) === null || _a === void 0 ? void 0 : _a.code, options), "?.map((").concat(forArguments, ") => (\n      ").concat(wrap ? openFrag(options) : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, exports.blockToReact)(item, options); })
            .join('\n')).concat(wrap ? closeFrag(options) : '', "\n    ))}");
    },
    Show: function (json, options) {
        var _a;
        var wrap = wrapInFragment(json);
        return "{".concat((0, helpers_2.processBinding)((_a = json.bindings.when) === null || _a === void 0 ? void 0 : _a.code, options), " ? (\n      ").concat(wrap ? openFrag(options) : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, exports.blockToReact)(item, options); })
            .join('\n')).concat(wrap ? closeFrag(options) : '', "\n    ) : ").concat(!json.meta.else ? 'null' : (0, exports.blockToReact)(json.meta.else, options), "}");
    },
};
// TODO: Maybe in the future allow defining `string | function` as values
var BINDING_MAPPERS = {
    ref: function (ref, value, options) {
        var regexp = /(.+)?props\.(.+)( |\)|;|\()?$/m;
        if (regexp.test(value)) {
            var match = regexp.exec(value);
            var prop = match === null || match === void 0 ? void 0 : match[2];
            if (prop) {
                return [ref, prop];
            }
        }
        return [ref, value];
    },
    innerHTML: function (_key, value) {
        return ['dangerouslySetInnerHTML', "{__html: ".concat(value.replace(/\s+/g, ' '), "}")];
    },
};
var blockToReact = function (json, options, parentSlots) {
    var _a, _b, _c;
    if (NODE_MAPPERS[json.name]) {
        return NODE_MAPPERS[json.name](json, options, parentSlots);
    }
    if (json.properties._text) {
        var text = json.properties._text;
        if (options.type === 'native' && text.trim().length) {
            return "<Text>".concat(text, "</Text>");
        }
        return text;
    }
    if ((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code) {
        var processed = (0, helpers_2.processBinding)(json.bindings._text.code, options);
        if (options.type === 'native') {
            return "<Text>{".concat(processed, "}</Text>");
        }
        return "{".concat(processed, "}");
    }
    var str = '';
    str += "<".concat(json.name, " ");
    if ((_b = json.bindings._spread) === null || _b === void 0 ? void 0 : _b.code) {
        str += " {...(".concat((0, helpers_2.processBinding)(json.bindings._spread.code, options), ")} ");
    }
    for (var key in json.properties) {
        var value = (json.properties[key] || '').replace(/"/g, '&quot;').replace(/\n/g, '\\n');
        if (key === 'class') {
            str += " className=\"".concat(value, "\" ");
        }
        else if (BINDING_MAPPERS[key]) {
            var mapper = BINDING_MAPPERS[key];
            if (typeof mapper === 'function') {
                var _d = mapper(key, value, options), newKey = _d[0], newValue = _d[1];
                str += " ".concat(newKey, "={").concat(newValue, "} ");
            }
            else {
                str += " ".concat(BINDING_MAPPERS[key], "=\"").concat(value, "\" ");
            }
        }
        else {
            if ((0, is_valid_attribute_name_1.isValidAttributeName)(key)) {
                str += " ".concat(key, "=\"").concat(value.replace(/"/g, '&quot;'), "\" ");
            }
        }
    }
    for (var key in json.bindings) {
        var value = String((_c = json.bindings[key]) === null || _c === void 0 ? void 0 : _c.code);
        if (key === '_spread') {
            continue;
        }
        if (key === 'css' && value.trim() === '{}') {
            continue;
        }
        var useBindingValue = (0, helpers_2.processBinding)(value, options);
        if (key.startsWith('on')) {
            var _e = json.bindings[key].arguments, cusArgs = _e === void 0 ? ['event'] : _e;
            str += " ".concat(key, "={(").concat(cusArgs.join(','), ") => ").concat((0, state_2.updateStateSettersInCode)(useBindingValue, options), " } ");
        }
        else if (key.startsWith('slot')) {
            // <Component slotProjected={<AnotherComponent />} />
            str += " ".concat(key, "={").concat(value, "} ");
        }
        else if (key === 'class') {
            str += " className={".concat(useBindingValue, "} ");
        }
        else if (BINDING_MAPPERS[key]) {
            var mapper = BINDING_MAPPERS[key];
            if (typeof mapper === 'function') {
                var _f = mapper(key, useBindingValue, options), newKey = _f[0], newValue = _f[1];
                str += " ".concat(newKey, "={").concat(newValue, "} ");
            }
            else {
                str += " ".concat(BINDING_MAPPERS[key], "={").concat(useBindingValue, "} ");
            }
        }
        else {
            if ((0, is_valid_attribute_name_1.isValidAttributeName)(key)) {
                str += " ".concat(key, "={").concat(useBindingValue, "} ");
            }
        }
    }
    if (jsx_1.selfClosingTags.has(json.name)) {
        return str + ' />';
    }
    // Self close by default if no children
    if (!json.children.length) {
        str += ' />';
        return str;
    }
    // TODO: update MitosisNode for simple code
    var needsToRenderSlots = [];
    var childrenNodes = '';
    if (json.children) {
        childrenNodes = json.children
            .map(function (item) { return (0, exports.blockToReact)(item, options, needsToRenderSlots); })
            .join('\n');
    }
    if (needsToRenderSlots.length) {
        needsToRenderSlots.forEach(function (_a) {
            var key = _a.key, value = _a.value;
            str += " ".concat(key, "={").concat(value, "} ");
        });
    }
    str += '>';
    if (json.children) {
        str += childrenNodes;
    }
    return str + "</".concat(json.name, ">");
};
exports.blockToReact = blockToReact;
var getRefsString = function (json, refs, options) {
    var _a, _b;
    var hasStateArgument = false;
    var code = '';
    var domRefs = (0, get_refs_1.getRefs)(json);
    for (var _i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
        var ref = refs_1[_i];
        var typeParameter = ((_a = json['refs'][ref]) === null || _a === void 0 ? void 0 : _a.typeParameter) || '';
        // domRefs must have null argument
        var argument = ((_b = json['refs'][ref]) === null || _b === void 0 ? void 0 : _b.argument) || (domRefs.has(ref) ? 'null' : '');
        hasStateArgument = /state\./.test(argument);
        code += "\nconst ".concat(ref, " = useRef").concat(typeParameter ? "<".concat(typeParameter, ">") : '', "(").concat((0, state_2.processHookCode)({
            str: argument,
            options: options,
        }), ");");
    }
    return [hasStateArgument, code];
};
function provideContext(json, options) {
    if (options.contextType === 'prop-drill') {
        var str = '';
        for (var key in json.context.set) {
            var _a = json.context.set[key], name_1 = _a.name, ref = _a.ref, value = _a.value;
            if (value) {
                str += "\n          ".concat(exports.contextPropDrillingKey, ".").concat(name_1, " = {\n            ...").concat(exports.contextPropDrillingKey, ".").concat(name_1, ",\n            ...").concat((0, get_state_object_string_1.stringifyContextValue)(value), "\n          }\n        ");
            }
            // TODO: support refs. I'm not sure what those are so unclear how to support them
        }
        return str;
    }
    else {
        for (var key in json.context.set) {
            var _b = json.context.set[key], name_2 = _b.name, ref = _b.ref, value = _b.value;
            if (value) {
                json.children = [
                    (0, create_mitosis_node_1.createMitosisNode)(__assign({ name: "".concat(name_2, ".Provider"), children: json.children }, (value && {
                        bindings: {
                            value: {
                                code: (0, get_state_object_string_1.stringifyContextValue)(value),
                            },
                        },
                    }))),
                ];
            }
            else if (ref) {
                json.children = [
                    (0, create_mitosis_node_1.createMitosisNode)(__assign({ name: 'Context.Provider', children: json.children }, (ref && {
                        bindings: {
                            value: {
                                code: ref,
                            },
                        },
                    }))),
                ];
            }
        }
    }
}
function getContextString(component, options) {
    var str = '';
    for (var key in component.context.get) {
        if (options.contextType === 'prop-drill') {
            str += "\n        const ".concat(key, " = ").concat(exports.contextPropDrillingKey, "['").concat(component.context.get[key].name, "'];\n      ");
        }
        else {
            str += "\n        const ".concat(key, " = useContext(").concat(component.context.get[key].name, ");\n      ");
        }
    }
    return str;
}
var getInitCode = function (json, options) {
    var _a;
    return (0, helpers_2.processBinding)(((_a = json.hooks.init) === null || _a === void 0 ? void 0 : _a.code) || '', options);
};
var DEFAULT_OPTIONS = {
    stateType: 'useState',
    stylesType: 'styled-jsx',
};
var componentToPreact = function (reactOptions) {
    if (reactOptions === void 0) { reactOptions = {}; }
    return (0, exports.componentToReact)(__assign(__assign({}, reactOptions), { preact: true }));
};
exports.componentToPreact = componentToPreact;
var componentToReact = function (reactOptions) {
    if (reactOptions === void 0) { reactOptions = {}; }
    return function (_a) {
        var component = _a.component;
        var json = (0, fast_clone_1.fastClone)(component);
        var options = __assign(__assign({}, DEFAULT_OPTIONS), reactOptions);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var str = _componentToReact(json, options);
        str +=
            '\n\n\n' +
                json.subComponents.map(function (item) { return _componentToReact(item, options, true); }).join('\n\n\n');
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
        }
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'typescript',
                    plugins: [
                        require('prettier/parser-typescript'),
                        require('prettier/parser-postcss'),
                    ],
                })
                    // Remove spaces between imports
                    .replace(/;\n\nimport\s/g, ';\nimport ');
            }
            catch (err) {
                console.error('Format error for file:', str, JSON.stringify(json, null, 2));
                throw err;
            }
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
        }
        return str;
    };
};
exports.componentToReact = componentToReact;
var _componentToReact = function (json, options, isSubComponent) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (isSubComponent === void 0) { isSubComponent = false; }
    (0, process_http_requests_1.processHttpRequests)(json);
    (0, handle_missing_state_1.handleMissingState)(json);
    (0, process_tag_references_1.processTagReferences)(json);
    var contextStr = provideContext(json, options);
    var componentHasStyles = (0, helpers_1.hasCss)(json);
    if (options.stateType === 'useState') {
        (0, getters_to_functions_1.gettersToFunctions)(json);
        (0, state_2.updateStateSetters)(json, options);
    }
    // const domRefs = getRefs(json);
    var allRefs = Object.keys(json.refs);
    (0, map_refs_1.mapRefs)(json, function (refName) { return "".concat(refName, ".current"); });
    var hasState = (0, state_1.checkHasState)(json);
    var _m = (0, get_props_ref_1.getPropsRef)(json), forwardRef = _m[0], hasPropRef = _m[1];
    var isForwardRef = Boolean(((_a = json.meta.useMetadata) === null || _a === void 0 ? void 0 : _a.forwardRef) || hasPropRef);
    if (isForwardRef) {
        var meta = (_b = json.meta.useMetadata) === null || _b === void 0 ? void 0 : _b.forwardRef;
        options.forwardRef = meta || forwardRef;
    }
    var forwardRefType = json.propsTypeRef && forwardRef && json.propsTypeRef !== 'any'
        ? "".concat(json.propsTypeRef, "[\"").concat(forwardRef, "\"]")
        : undefined;
    var stylesType = options.stylesType || 'emotion';
    var stateType = options.stateType || 'mobx';
    if (stateType === 'builder') {
        // Always use state if we are generate Builder react code
        hasState = true;
    }
    var useStateCode = stateType === 'useState' && (0, state_2.getUseStateCode)(json, options);
    if (options.plugins) {
        json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
    }
    var css = stylesType === 'styled-jsx'
        ? (0, collect_css_1.collectCss)(json)
        : stylesType === 'style-tag'
            ? (0, collect_css_1.collectCss)(json, {
                prefix: (0, hash_sum_1.default)(json),
            })
            : null;
    var styledComponentsCode = stylesType === 'styled-components' && componentHasStyles && (0, collect_styled_components_1.collectStyledComponents)(json);
    if (options.format !== 'lite') {
        (0, strip_meta_properties_1.stripMetaProperties)(json);
    }
    var reactLibImports = new Set();
    if (useStateCode && useStateCode.includes('useState')) {
        reactLibImports.add('useState');
    }
    if ((0, context_1.hasContext)(json) && options.contextType !== 'prop-drill') {
        reactLibImports.add('useContext');
    }
    if (allRefs.length) {
        reactLibImports.add('useRef');
    }
    if (hasPropRef) {
        reactLibImports.add('forwardRef');
    }
    if (((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code) ||
        ((_d = json.hooks.onUnMount) === null || _d === void 0 ? void 0 : _d.code) ||
        ((_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.length) ||
        ((_f = json.hooks.onInit) === null || _f === void 0 ? void 0 : _f.code)) {
        reactLibImports.add('useEffect');
    }
    var wrap = wrapInFragment(json) ||
        (componentHasStyles && (stylesType === 'styled-jsx' || stylesType === 'style-tag')) ||
        isRootSpecialNode(json);
    var _o = getRefsString(json, allRefs, options), hasStateArgument = _o[0], refsString = _o[1];
    var nativeStyles = stylesType === 'react-native' && componentHasStyles && (0, react_native_1.collectReactNativeStyles)(json);
    var propsArgs = "props: ".concat(json.propsTypeRef || 'any');
    var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n  ", "\n  ", "\n  ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "", "function ", "(", "", ") {\n    ", "\n    ", "\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      return (\n        ", "\n        ", "\n        ", "\n        ", "\n      );\n    }", "\n\n    ", "\n\n    ", "\n\n    ", "\n  "], ["\n  ", "\n  ", "\n  ", "\n  ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "", "function ", "(", "", ") {\n    ", "\n    ", "\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      return (\n        ", "\n        ", "\n        ", "\n        ", "\n      );\n    }", "\n\n    ", "\n\n    ", "\n\n    ", "\n  "])), options.preact
        ? "\n    /** @jsx h */\n    import { h, Fragment } from 'preact';\n    "
        : options.type !== 'native'
            ? "import * as React from 'react';"
            : "\n  import * as React from 'react';\n  import { View, StyleSheet, Image, Text } from 'react-native';\n  ", styledComponentsCode ? "import styled from 'styled-components';\n" : '', reactLibImports.size
        ? "import { ".concat(Array.from(reactLibImports).join(', '), " } from '").concat(options.preact ? 'preact/hooks' : 'react', "'")
        : '', componentHasStyles && stylesType === 'emotion' && options.format !== 'lite'
        ? "/** @jsx jsx */\n    import { jsx } from '@emotion/react'".trim()
        : '', hasState && stateType === 'valtio' ? "import { useLocalProxy } from 'valtio/utils';" : '', hasState && stateType === 'solid' ? "import { useMutable } from 'react-solid-state';" : '', stateType === 'mobx' && hasState
        ? "import { useLocalObservable } from 'mobx-react-lite';"
        : '', json.types ? json.types.join('\n') : '', (0, render_imports_1.renderPreComponent)({
        component: json,
        target: options.type === 'native' ? 'reactNative' : 'react',
    }), isSubComponent ? '' : 'export default ', isForwardRef ? "forwardRef".concat(forwardRefType ? "<".concat(forwardRefType, ">") : '', "(") : '', json.name || 'MyComponent', propsArgs, isForwardRef ? ", ".concat(options.forwardRef) : '', options.contextType === 'prop-drill'
        ? "const ".concat(exports.contextPropDrillingKey, " = { ...props['").concat(exports.contextPropDrillingKey, "'] };")
        : '', hasStateArgument ? '' : refsString, hasState
        ? stateType === 'mobx'
            ? "const state = useLocalObservable(() => (".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), "));")
            : stateType === 'useState'
                ? useStateCode
                : stateType === 'solid'
                    ? "const state = useMutable(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
                    : stateType === 'builder'
                        ? "const state = useBuilderState(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
                        : stateType === 'variables'
                            ? "const state = ".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ";")
                            : "const state = useLocalProxy(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
        : '', hasStateArgument ? refsString : '', getContextString(json, options), getInitCode(json, options), contextStr || '', ((_g = json.hooks.onInit) === null || _g === void 0 ? void 0 : _g.code)
        ? "\n          useEffect(() => {\n            ".concat((0, state_2.processHookCode)({
            str: json.hooks.onInit.code,
            options: options,
        }), "\n          })\n          ")
        : '', ((_h = json.hooks.onMount) === null || _h === void 0 ? void 0 : _h.code)
        ? "useEffect(() => {\n            ".concat((0, state_2.processHookCode)({
            str: json.hooks.onMount.code,
            options: options,
        }), "\n          }, [])")
        : '', (_k = (_j = json.hooks.onUpdate) === null || _j === void 0 ? void 0 : _j.map(function (hook) { return "useEffect(() => {\n            ".concat((0, state_2.processHookCode)({ str: hook.code, options: options }), "\n          }, \n          ").concat(hook.deps ? (0, state_2.processHookCode)({ str: hook.deps, options: options }) : '', ")"); }).join(';')) !== null && _k !== void 0 ? _k : '', ((_l = json.hooks.onUnMount) === null || _l === void 0 ? void 0 : _l.code)
        ? "useEffect(() => {\n            return () => {\n              ".concat((0, state_2.processHookCode)({
            str: json.hooks.onUnMount.code,
            options: options,
        }), "\n            }\n          }, [])")
        : '', wrap ? openFrag(options) : '', json.children.map(function (item) { return (0, exports.blockToReact)(item, options); }).join('\n'), componentHasStyles && stylesType === 'styled-jsx'
        ? "<style jsx>{`".concat(css, "`}</style>")
        : componentHasStyles && stylesType === 'style-tag'
            ? "<style>{`".concat(css, "`}</style>")
            : '', wrap ? closeFrag(options) : '', isForwardRef ? ')' : '', !json.defaultProps
        ? ''
        : "".concat(json.name || 'MyComponent', ".defaultProps = ").concat(json5_1.default.stringify(json.defaultProps), ";"), !nativeStyles
        ? ''
        : "\n      const styles = StyleSheet.create(".concat(json5_1.default.stringify(nativeStyles), ");\n    "), styledComponentsCode ? styledComponentsCode : '');
    str = (0, replace_new_lines_in_strings_1.stripNewlinesInStrings)(str);
    return str;
};
var templateObject_1;
