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
exports.componentToReact = exports.blockToReact = void 0;
var core_1 = require("@babel/core");
var dedent_1 = __importDefault(require("dedent"));
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var function_literal_prefix_1 = require("../constants/function-literal-prefix");
var method_literal_prefix_1 = require("../constants/method-literal-prefix");
var babel_transform_1 = require("../helpers/babel-transform");
var capitalize_1 = require("../helpers/capitalize");
var collect_css_1 = require("../helpers/styles/collect-css");
var create_mitosis_node_1 = require("../helpers/create-mitosis-node");
var fast_clone_1 = require("../helpers/fast-clone");
var filter_empty_text_nodes_1 = require("../helpers/filter-empty-text-nodes");
var get_refs_1 = require("../helpers/get-refs");
var get_props_ref_1 = require("../helpers/get-props-ref");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var getters_to_functions_1 = require("../helpers/getters-to-functions");
var handle_missing_state_1 = require("../helpers/handle-missing-state");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var is_valid_attribute_name_1 = require("../helpers/is-valid-attribute-name");
var map_refs_1 = require("../helpers/map-refs");
var process_http_requests_1 = require("../helpers/process-http-requests");
var process_tag_references_1 = require("../helpers/process-tag-references");
var render_imports_1 = require("../helpers/render-imports");
var replace_new_lines_in_strings_1 = require("../helpers/replace-new-lines-in-strings");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var plugins_1 = require("../modules/plugins");
var jsx_1 = require("../parsers/jsx");
var context_1 = require("./helpers/context");
var react_native_1 = require("./react-native");
var collect_styled_components_1 = require("../helpers/styles/collect-styled-components");
var helpers_1 = require("../helpers/styles/helpers");
var slots_1 = require("../helpers/slots");
/**
 * If the root Mitosis component only has 1 child, and it is a `Show` node, then we need to wrap it in a fragment.
 * Otherwise, we end up with invalid React render code.
 *
 */
var isRootShowNode = function (json) {
    return json.children.length === 1 && ['Show'].includes(json.children[0].name);
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
            return "{".concat(processBinding('props.children', options), "}");
        }
        var slotProp = processBinding(json.bindings.name.code, options).replace('name=', '');
        return "{".concat(slotProp, "}");
    },
    Fragment: function (json, options) {
        var wrap = wrapInFragment(json);
        return "".concat(wrap ? '<>' : '').concat(json.children
            .map(function (item) { return (0, exports.blockToReact)(item, options); })
            .join('\n')).concat(wrap ? '</>' : '');
    },
    For: function (json, options) {
        var _a, _b;
        var wrap = wrapInFragment(json);
        var forArguments = (((_a = json === null || json === void 0 ? void 0 : json.scope) === null || _a === void 0 ? void 0 : _a.For) || []).join(',');
        return "{".concat(processBinding((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code, options), "?.map((").concat(forArguments, ") => (\n      ").concat(wrap ? '<>' : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, exports.blockToReact)(item, options); })
            .join('\n')).concat(wrap ? '</>' : '', "\n    ))}");
    },
    Show: function (json, options) {
        var _a;
        var wrap = wrapInFragment(json);
        return "{".concat(processBinding((_a = json.bindings.when) === null || _a === void 0 ? void 0 : _a.code, options), " ? (\n      ").concat(wrap ? '<>' : '').concat(json.children
            .filter(filter_empty_text_nodes_1.filterEmptyTextNodes)
            .map(function (item) { return (0, exports.blockToReact)(item, options); })
            .join('\n')).concat(wrap ? '</>' : '', "\n    ) : ").concat(!json.meta.else ? 'null' : (0, exports.blockToReact)(json.meta.else, options), "}");
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
        var processed = processBinding(json.bindings._text.code, options);
        if (options.type === 'native') {
            return "<Text>{".concat(processed, "}</Text>");
        }
        return "{".concat(processed, "}");
    }
    var str = '';
    str += "<".concat(json.name, " ");
    if ((_b = json.bindings._spread) === null || _b === void 0 ? void 0 : _b.code) {
        str += " {...(".concat(processBinding(json.bindings._spread.code, options), ")} ");
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
        var useBindingValue = processBinding(value, options);
        if (key.startsWith('on')) {
            var _e = json.bindings[key].arguments, cusArgs = _e === void 0 ? ['event'] : _e;
            str += " ".concat(key, "={(").concat(cusArgs.join(','), ") => ").concat(updateStateSettersInCode(useBindingValue, options), " } ");
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
        code += "\nconst ".concat(ref, " = useRef").concat(typeParameter ? "<".concat(typeParameter, ">") : '', "(").concat(processBinding(updateStateSettersInCode(argument, options), options), ");");
    }
    return [hasStateArgument, code];
};
/**
 * Removes all `this.` references.
 */
var stripThisRefs = function (str, options) {
    if (options.stateType !== 'useState') {
        return str;
    }
    return str.replace(/this\.([a-zA-Z_\$0-9]+)/g, '$1');
};
var processBinding = function (str, options) {
    if (options.stateType !== 'useState') {
        return str;
    }
    if ((0, slots_1.isSlotProperty)(str)) {
        return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(str, {
            includeState: true,
            includeProps: false,
        });
    }
    return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(str, {
        includeState: true,
        includeProps: false,
    });
};
var getUseStateCode = function (json, options) {
    var str = '';
    var state = json.state;
    var valueMapper = function (val) {
        var x = processBinding(updateStateSettersInCode(val, options), options);
        return stripThisRefs(x, options);
    };
    var lineItemDelimiter = '\n\n\n';
    for (var key in state) {
        var value = state[key];
        var defaultCase = "const [".concat(key, ", set").concat((0, capitalize_1.capitalize)(key), "] = useState(() => (").concat(valueMapper(json5_1.default.stringify(value)), "))");
        if (typeof value === 'string') {
            if (value.startsWith(function_literal_prefix_1.functionLiteralPrefix)) {
                var useValue = value.replace(function_literal_prefix_1.functionLiteralPrefix, '');
                var mappedVal = valueMapper(useValue);
                str += mappedVal;
            }
            else if (value.startsWith(method_literal_prefix_1.methodLiteralPrefix)) {
                var methodValue = value.replace(method_literal_prefix_1.methodLiteralPrefix, '');
                var useValue = methodValue.replace(/^(get )?/, 'function ');
                str += valueMapper(useValue);
            }
            else {
                str += defaultCase;
            }
        }
        else {
            str += defaultCase;
        }
        str += lineItemDelimiter;
    }
    return str;
};
var updateStateSetters = function (json, options) {
    if (options.stateType !== 'useState') {
        return;
    }
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var values = item.bindings[key];
                var newValue = updateStateSettersInCode(values === null || values === void 0 ? void 0 : values.code, options);
                if (newValue !== (values === null || values === void 0 ? void 0 : values.code)) {
                    item.bindings[key] = {
                        code: newValue,
                        arguments: values === null || values === void 0 ? void 0 : values.arguments,
                    };
                }
            }
        }
    });
};
function addProviderComponents(json, options) {
    for (var key in json.context.set) {
        var _a = json.context.set[key], name_1 = _a.name, value = _a.value;
        if (value) {
            json.children = [
                (0, create_mitosis_node_1.createMitosisNode)(__assign({ name: "".concat(name_1, ".Provider"), children: json.children }, (value && {
                    bindings: {
                        value: {
                            code: (0, get_state_object_string_1.getMemberObjectString)(value),
                        },
                    },
                }))),
            ];
        }
    }
}
var updateStateSettersInCode = function (value, options) {
    if (options.stateType !== 'useState') {
        return value;
    }
    return (0, babel_transform_1.babelTransformExpression)(value, {
        AssignmentExpression: function (path) {
            var node = path.node;
            if (core_1.types.isMemberExpression(node.left)) {
                if (core_1.types.isIdentifier(node.left.object)) {
                    // TODO: utillity to properly trace this reference to the beginning
                    if (node.left.object.name === 'state') {
                        // TODO: ultimately support other property access like strings
                        var propertyName = node.left.property.name;
                        path.replaceWith(core_1.types.callExpression(core_1.types.identifier("set".concat((0, capitalize_1.capitalize)(propertyName))), [
                            node.right,
                        ]));
                    }
                }
            }
        },
    });
};
function getContextString(component, options) {
    var str = '';
    for (var key in component.context.get) {
        str += "\n      const ".concat(key, " = useContext(").concat(component.context.get[key].name, ");\n    ");
    }
    return str;
}
var getInitCode = function (json, options) {
    var _a;
    return processBinding(((_a = json.hooks.init) === null || _a === void 0 ? void 0 : _a.code) || '', options);
};
var DEFAULT_OPTIONS = {
    stateType: 'useState',
    stylesType: 'styled-jsx',
};
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
    addProviderComponents(json, options);
    var componentHasStyles = (0, helpers_1.hasCss)(json);
    if (options.stateType === 'useState') {
        (0, getters_to_functions_1.gettersToFunctions)(json);
        updateStateSetters(json, options);
    }
    // const domRefs = getRefs(json);
    var allRefs = Object.keys(json.refs);
    (0, map_refs_1.mapRefs)(json, function (refName) { return "".concat(refName, ".current"); });
    var hasState = Boolean(Object.keys(json.state).length);
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
    var useStateCode = stateType === 'useState' && getUseStateCode(json, options);
    if (options.plugins) {
        json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
    }
    var css = stylesType === 'styled-jsx' && (0, collect_css_1.collectCss)(json);
    var styledComponentsCode = stylesType === 'styled-components' && componentHasStyles && (0, collect_styled_components_1.collectStyledComponents)(json);
    if (options.format !== 'lite') {
        (0, strip_meta_properties_1.stripMetaProperties)(json);
    }
    var reactLibImports = new Set();
    if (useStateCode && useStateCode.includes('useState')) {
        reactLibImports.add('useState');
    }
    if ((0, context_1.hasContext)(json)) {
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
        (componentHasStyles && stylesType === 'styled-jsx') ||
        isRootShowNode(json);
    var _o = getRefsString(json, allRefs, options), hasStateArgument = _o[0], refsString = _o[1];
    var nativeStyles = stylesType === 'react-native' && componentHasStyles && (0, react_native_1.collectReactNativeStyles)(json);
    var propsArgs = 'props';
    if (json.propsTypeRef) {
        propsArgs = "props: ".concat(json.propsTypeRef);
    }
    var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n  ", "\n  ", "\n  ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "", "function ", "(", "", ") {\n    ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      return (\n        ", "\n        ", "\n        ", "\n        ", "\n      );\n    }", "\n\n    ", "\n\n    ", "\n  "], ["\n  ", "\n  ", "\n  ", "\n  ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "", "function ", "(", "", ") {\n    ", "\n      ", "\n      ", "\n      ", "\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      return (\n        ", "\n        ", "\n        ", "\n        ", "\n      );\n    }", "\n\n    ", "\n\n    ", "\n  "])), options.type !== 'native'
        ? ''
        : "\n  import * as React from 'react';\n  import { View, StyleSheet, Image, Text } from 'react-native';\n  ", styledComponentsCode ? "import styled from 'styled-components';\n" : '', reactLibImports.size ? "import { ".concat(Array.from(reactLibImports).join(', '), " } from 'react'") : '', componentHasStyles && stylesType === 'emotion' && options.format !== 'lite'
        ? "/** @jsx jsx */\n    import { jsx } from '@emotion/react'".trim()
        : '', hasState && stateType === 'valtio' ? "import { useLocalProxy } from 'valtio/utils';" : '', hasState && stateType === 'solid' ? "import { useMutable } from 'react-solid-state';" : '', stateType === 'mobx' && hasState
        ? "import { useLocalObservable } from 'mobx-react-lite';"
        : '', json.types ? json.types.join('\n') : '', json.interfaces ? (_g = json.interfaces) === null || _g === void 0 ? void 0 : _g.join('\n') : '', (0, render_imports_1.renderPreComponent)({ component: json, target: 'react' }), isSubComponent ? '' : 'export default ', isForwardRef ? "forwardRef".concat(forwardRefType ? "<".concat(forwardRefType, ">") : '', "(") : '', json.name || 'MyComponent', propsArgs, isForwardRef ? ", ".concat(options.forwardRef) : '', hasStateArgument ? '' : refsString, hasState
        ? stateType === 'mobx'
            ? "const state = useLocalObservable(() => (".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), "));")
            : stateType === 'useState'
                ? useStateCode
                : stateType === 'solid'
                    ? "const state = useMutable(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
                    : stateType === 'builder'
                        ? "var state = useBuilderState(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
                        : "const state = useLocalProxy(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
        : '', hasStateArgument ? refsString : '', getContextString(json, options), getInitCode(json, options), ((_h = json.hooks.onInit) === null || _h === void 0 ? void 0 : _h.code)
        ? "\n          useEffect(() => {\n            ".concat(processBinding(updateStateSettersInCode(json.hooks.onInit.code, options), options), "\n          })\n          ")
        : '', ((_j = json.hooks.onMount) === null || _j === void 0 ? void 0 : _j.code)
        ? "useEffect(() => {\n            ".concat(processBinding(updateStateSettersInCode(json.hooks.onMount.code, options), options), "\n          }, [])")
        : '', ((_k = json.hooks.onUpdate) === null || _k === void 0 ? void 0 : _k.length)
        ? json.hooks.onUpdate
            .map(function (hook) { return "useEffect(() => {\n            ".concat(processBinding(updateStateSettersInCode(hook.code, options), options), "\n          }, \n          ").concat(hook.deps ? processBinding(updateStateSettersInCode(hook.deps, options), options) : '', ")"); })
            .join(';')
        : '', ((_l = json.hooks.onUnMount) === null || _l === void 0 ? void 0 : _l.code)
        ? "useEffect(() => {\n            return () => {\n              ".concat(processBinding(updateStateSettersInCode(json.hooks.onUnMount.code, options), options), "\n            }\n          }, [])")
        : '', wrap ? '<>' : '', json.children.map(function (item) { return (0, exports.blockToReact)(item, options); }).join('\n'), componentHasStyles && stylesType === 'styled-jsx' ? "<style jsx>{`".concat(css, "`}</style>") : '', wrap ? '</>' : '', isForwardRef ? ')' : '', !nativeStyles
        ? ''
        : "\n      const styles = StyleSheet.create(".concat(json5_1.default.stringify(nativeStyles), ");\n    "), styledComponentsCode ? styledComponentsCode : '');
    str = (0, replace_new_lines_in_strings_1.stripNewlinesInStrings)(str);
    return str;
};
var templateObject_1;
