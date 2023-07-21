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
exports.componentToReact = exports.componentToPreact = exports.contextPropDrillingKey = void 0;
var core_1 = require("@babel/core");
var hash_sum_1 = __importDefault(require("hash-sum"));
var json5_1 = __importDefault(require("json5"));
var standalone_1 = require("prettier/standalone");
var bindings_1 = require("../../helpers/bindings");
var create_mitosis_node_1 = require("../../helpers/create-mitosis-node");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var get_props_ref_1 = require("../../helpers/get-props-ref");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var getters_to_functions_1 = require("../../helpers/getters-to-functions");
var handle_missing_state_1 = require("../../helpers/handle-missing-state");
var is_root_text_node_1 = require("../../helpers/is-root-text-node");
var map_refs_1 = require("../../helpers/map-refs");
var merge_options_1 = require("../../helpers/merge-options");
var process_code_1 = require("../../helpers/plugins/process-code");
var process_http_requests_1 = require("../../helpers/process-http-requests");
var render_imports_1 = require("../../helpers/render-imports");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var replace_new_lines_in_strings_1 = require("../../helpers/replace-new-lines-in-strings");
var state_1 = require("../../helpers/state");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var collect_css_1 = require("../../helpers/styles/collect-css");
var collect_styled_components_1 = require("../../helpers/styles/collect-styled-components");
var helpers_1 = require("../../helpers/styles/helpers");
var plugins_1 = require("../../modules/plugins");
var context_1 = require("../helpers/context");
var react_native_1 = require("../react-native");
var blocks_1 = require("./blocks");
var helpers_2 = require("./helpers");
var state_2 = require("./state");
exports.contextPropDrillingKey = '_context';
/**
 * If the root Mitosis component only has 1 child, and it is a `Show`/`For` node, then we need to wrap it in a fragment.
 * Otherwise, we end up with invalid React render code.
 */
var isRootSpecialNode = function (json) {
    return json.children.length === 1 && ['Show', 'For'].includes(json.children[0].name);
};
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
        code += "\nconst ".concat(ref, " = useRef").concat(typeParameter && options.typescript ? "<".concat(typeParameter, ">") : '', "(").concat((0, state_2.processHookCode)({
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
                str += "\n          ".concat(exports.contextPropDrillingKey, ".").concat(name_1, " = ").concat((0, get_state_object_string_1.stringifyContextValue)(value), ";\n        ");
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
                            value: (0, bindings_1.createSingleBinding)({
                                code: (0, get_state_object_string_1.stringifyContextValue)(value),
                            }),
                        },
                    }))),
                ];
            }
            else if (ref) {
                json.children = [
                    (0, create_mitosis_node_1.createMitosisNode)(__assign({ name: "".concat(name_2, ".Provider"), children: json.children }, (ref && {
                        bindings: {
                            value: (0, bindings_1.createSingleBinding)({ code: ref }),
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
var componentToPreact = function (reactOptions) {
    if (reactOptions === void 0) { reactOptions = {}; }
    return (0, exports.componentToReact)(__assign(__assign({}, reactOptions), { preact: true }));
};
exports.componentToPreact = componentToPreact;
var componentToReact = function (reactOptions) {
    if (reactOptions === void 0) { reactOptions = {}; }
    return function (_a) {
        var component = _a.component, path = _a.path;
        var json = (0, fast_clone_1.fastClone)(component);
        var target = reactOptions.preact
            ? 'preact'
            : reactOptions.type === 'native'
                ? 'reactNative'
                : reactOptions.type === 'taro'
                    ? 'taro'
                    : reactOptions.rsc
                        ? 'rsc'
                        : 'react';
        var stateType = reactOptions.stateType || 'useState';
        var DEFAULT_OPTIONS = {
            addUseClientDirectiveIfNeeded: true,
            stateType: stateType,
            stylesType: 'styled-jsx',
            type: 'dom',
            plugins: stateType === 'variables'
                ? [
                    (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType, json) { return function (code, hookType) {
                        if (codeType === 'types')
                            return code;
                        code = (0, replace_identifiers_1.replaceNodes)({
                            code: code,
                            nodeMaps: Object.entries(json.state)
                                .filter(function (_a) {
                                var key = _a[0], value = _a[1];
                                return (value === null || value === void 0 ? void 0 : value.type) === 'getter';
                            })
                                .map(function (_a) {
                                var key = _a[0], value = _a[1];
                                var expr = core_1.types.memberExpression(core_1.types.identifier('state'), core_1.types.identifier(key));
                                return {
                                    from: expr,
                                    // condition: (path) => !types.isObjectMethod(path.parent),
                                    to: core_1.types.callExpression(expr, []),
                                };
                            }),
                        });
                        code = (0, replace_identifiers_1.replaceStateIdentifier)(null)(code);
                        return code;
                    }; }),
                ]
                : [],
        };
        var options = (0, merge_options_1.initializeOptions)({
            target: target,
            component: component,
            defaults: DEFAULT_OPTIONS,
            userOptions: reactOptions,
        });
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var str = _componentToReact(json, options);
        str +=
            '\n\n\n' +
                json.subComponents.map(function (item) { return _componentToReact(item, options, true); }).join('\n\n\n');
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
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
                console.error('Format error for file:');
                throw err;
            }
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToReact = componentToReact;
// TODO: import target components when they are required
var getDefaultImport = function (json, options) {
    var preact = options.preact, type = options.type;
    if (preact) {
        return "\n    /** @jsx h */\n    import { h, Fragment } from 'preact';\n    ";
    }
    if (type === 'native') {
        return "\n    import * as React from 'react';\n    import { FlatList, ScrollView, View, StyleSheet, Image, Text } from 'react-native';\n    ";
    }
    if (type === 'taro') {
        return "\n    import * as React from 'react';\n    ";
    }
    return "import * as React from 'react';";
};
var getPropsDefinition = function (_a) {
    var json = _a.json;
    if (!json.defaultProps)
        return '';
    var defaultPropsString = Object.keys(json.defaultProps)
        .map(function (prop) {
        var _a;
        var value = json.defaultProps.hasOwnProperty(prop)
            ? (_a = json.defaultProps[prop]) === null || _a === void 0 ? void 0 : _a.code
            : 'undefined';
        return "".concat(prop, ": ").concat(value);
    })
        .join(',');
    return "".concat(json.name, ".defaultProps = {").concat(defaultPropsString, "};");
};
var _componentToReact = function (json, options, isSubComponent) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (isSubComponent === void 0) { isSubComponent = false; }
    (0, process_http_requests_1.processHttpRequests)(json);
    (0, handle_missing_state_1.handleMissingState)(json);
    (0, helpers_2.processTagReferences)(json, options);
    var contextStr = provideContext(json, options);
    var componentHasStyles = (0, helpers_1.hasCss)(json);
    if (options.stateType === 'useState') {
        (0, getters_to_functions_1.gettersToFunctions)(json);
        (0, state_2.updateStateSetters)(json, options);
    }
    if (!json.name) {
        json.name = 'MyComponent';
    }
    // const domRefs = getRefs(json);
    var allRefs = Object.keys(json.refs);
    (0, map_refs_1.mapRefs)(json, function (refName) { return "".concat(refName, ".current"); });
    // Always use state if we are generate Builder react code
    var hasState = options.stateType === 'builder' || (0, state_1.checkHasState)(json);
    var _r = (0, get_props_ref_1.getPropsRef)(json), forwardRef = _r[0], hasPropRef = _r[1];
    var isForwardRef = !options.preact && Boolean(((_a = json.meta.useMetadata) === null || _a === void 0 ? void 0 : _a.forwardRef) || hasPropRef);
    if (isForwardRef) {
        var meta = (_b = json.meta.useMetadata) === null || _b === void 0 ? void 0 : _b.forwardRef;
        options.forwardRef = meta || forwardRef;
    }
    var forwardRefType = options.typescript && json.propsTypeRef && forwardRef && json.propsTypeRef !== 'any'
        ? "<".concat(json.propsTypeRef, "[\"").concat(forwardRef, "\"]>")
        : '';
    var useStateCode = options.stateType === 'useState' ? (0, state_2.getUseStateCode)(json, options) : '';
    if (options.plugins) {
        json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
    }
    var css = options.stylesType === 'styled-jsx'
        ? (0, collect_css_1.collectCss)(json)
        : options.stylesType === 'style-tag'
            ? (0, collect_css_1.collectCss)(json, {
                prefix: (0, hash_sum_1.default)(json),
            })
            : null;
    var styledComponentsCode = (options.stylesType === 'styled-components' &&
        componentHasStyles &&
        (0, collect_styled_components_1.collectStyledComponents)(json)) ||
        '';
    if (options.format !== 'lite') {
        (0, strip_meta_properties_1.stripMetaProperties)(json);
    }
    var reactLibImports = new Set();
    if (useStateCode.includes('useState')) {
        reactLibImports.add('useState');
    }
    if ((0, context_1.hasContext)(json) && options.contextType !== 'prop-drill') {
        reactLibImports.add('useContext');
    }
    if (allRefs.length) {
        reactLibImports.add('useRef');
    }
    if (!options.preact && hasPropRef) {
        reactLibImports.add('forwardRef');
    }
    if (((_c = json.hooks.onMount) === null || _c === void 0 ? void 0 : _c.code) ||
        ((_d = json.hooks.onUnMount) === null || _d === void 0 ? void 0 : _d.code) ||
        ((_e = json.hooks.onUpdate) === null || _e === void 0 ? void 0 : _e.length) ||
        ((_f = json.hooks.onInit) === null || _f === void 0 ? void 0 : _f.code)) {
        reactLibImports.add('useEffect');
    }
    var hasCustomStyles = !!((_g = json.style) === null || _g === void 0 ? void 0 : _g.length);
    var shouldInjectCustomStyles = hasCustomStyles &&
        (options.stylesType === 'styled-components' || options.stylesType === 'emotion');
    var wrap = (0, helpers_2.wrapInFragment)(json) ||
        (0, is_root_text_node_1.isRootTextNode)(json) ||
        (componentHasStyles &&
            (options.stylesType === 'styled-jsx' || options.stylesType === 'style-tag')) ||
        shouldInjectCustomStyles ||
        isRootSpecialNode(json);
    var _s = getRefsString(json, allRefs, options), hasStateArgument = _s[0], refsString = _s[1];
    // NOTE: `collectReactNativeStyles` must run before style generation in the component generation body, as it has
    // side effects that delete styles bindings from the JSON.
    var reactNativeStyles = options.stylesType === 'react-native' && componentHasStyles
        ? (0, react_native_1.collectReactNativeStyles)(json)
        : undefined;
    var propType = json.propsTypeRef || 'any';
    var componentArgs = ["props".concat(options.typescript ? ":".concat(propType) : ''), options.forwardRef]
        .filter(Boolean)
        .join(',');
    var componentBody = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    return (\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n    );\n  "], ["\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    return (\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n      ", "\n    );\n  "])), options.contextType === 'prop-drill'
        ? "const ".concat(exports.contextPropDrillingKey, " = { ...props['").concat(exports.contextPropDrillingKey, "'] };")
        : '', hasStateArgument ? '' : refsString, hasState
        ? options.stateType === 'mobx'
            ? "const state = useLocalObservable(() => (".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), "));")
            : options.stateType === 'useState'
                ? useStateCode
                : options.stateType === 'solid'
                    ? "const state = useMutable(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
                    : options.stateType === 'builder'
                        ? "const state = useBuilderState(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
                        : options.stateType === 'variables'
                            ? (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
                                format: 'variables',
                                keyPrefix: 'const',
                                valueMapper: function (code, type, _, key) {
                                    if (type === 'getter')
                                        return "".concat(key, " = function ").concat(code.replace('get ', ''));
                                    if (type === 'function')
                                        return "".concat(key, " = function ").concat(code);
                                    return code;
                                },
                            })
                            : "const state = useLocalProxy(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");")
        : '', hasStateArgument ? refsString : '', getContextString(json, options), (0, helpers_2.getCode)((_h = json.hooks.init) === null || _h === void 0 ? void 0 : _h.code, options), contextStr || '', ((_j = json.hooks.onInit) === null || _j === void 0 ? void 0 : _j.code)
        ? "\n        useEffect(() => {\n          ".concat((0, state_2.processHookCode)({
            str: json.hooks.onInit.code,
            options: options,
        }), "\n        }, [])\n        ")
        : '', ((_k = json.hooks.onMount) === null || _k === void 0 ? void 0 : _k.code)
        ? "useEffect(() => {\n          ".concat((0, state_2.processHookCode)({
            str: json.hooks.onMount.code,
            options: options,
        }), "\n        }, [])")
        : '', (_m = (_l = json.hooks.onUpdate) === null || _l === void 0 ? void 0 : _l.map(function (hook) { return "useEffect(() => {\n          ".concat((0, state_2.processHookCode)({ str: hook.code, options: options }), "\n        },\n        ").concat(hook.deps ? (0, state_2.processHookCode)({ str: hook.deps, options: options }) : '', ")"); }).join(';')) !== null && _m !== void 0 ? _m : '', ((_o = json.hooks.onUnMount) === null || _o === void 0 ? void 0 : _o.code)
        ? "useEffect(() => {\n          return () => {\n            ".concat((0, state_2.processHookCode)({
            str: json.hooks.onUnMount.code,
            options: options,
        }), "\n          }\n        }, [])")
        : '', wrap ? (0, helpers_2.openFrag)(options) : '', json.children.map(function (item) { return (0, blocks_1.blockToReact)(item, options, json, []); }).join('\n'), componentHasStyles && options.stylesType === 'styled-jsx'
        ? "<style jsx>{`".concat(css, "`}</style>")
        : '', componentHasStyles && options.stylesType === 'style-tag'
        ? "<style>{`".concat(css, "`}</style>")
        : '', shouldInjectCustomStyles ? "<style>{`".concat(json.style, "`}</style>") : '', wrap ? (0, helpers_2.closeFrag)(options) : '');
    var isRsc = options.rsc && ((_q = (_p = json.meta.useMetadata) === null || _p === void 0 ? void 0 : _p.rsc) === null || _q === void 0 ? void 0 : _q.componentType) === 'server';
    var shouldAddUseClientDirective = options.addUseClientDirectiveIfNeeded && !isRsc;
    var str = (0, dedent_1.dedent)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n    ", "\n    ", "\n    ", "\n    ", "function ", "(", ") {\n    ", "\n  }", "\n\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n\n  "], ["\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n    ", "\n    ", "\n    ", "\n    ", "function ", "(", ") {\n    ", "\n  }", "\n\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n\n  "])), shouldAddUseClientDirective ? "'use client';" : '', getDefaultImport(json, options), styledComponentsCode ? "import styled from 'styled-components';\n" : '', reactLibImports.size
        ? "import { ".concat(Array.from(reactLibImports).join(', '), " } from '").concat(options.preact ? 'preact/hooks' : 'react', "'")
        : '', componentHasStyles && options.stylesType === 'emotion' && options.format !== 'lite'
        ? "/** @jsx jsx */\n    import { jsx } from '@emotion/react'".trim()
        : '', !hasState
        ? ''
        : options.stateType === 'valtio'
            ? "import { useLocalProxy } from 'valtio/utils';"
            : options.stateType === 'solid'
                ? "import { useMutable } from 'react-solid-state';"
                : options.stateType === 'mobx'
                    ? "import { useLocalObservable, observer } from 'mobx-react-lite';"
                    : '', json.types && options.typescript ? json.types.join('\n') : '', (0, render_imports_1.renderPreComponent)({
        component: json,
        target: options.type === 'native' ? 'reactNative' : 'react',
    }), isForwardRef ? "const ".concat(json.name, " = forwardRef").concat(forwardRefType, "(") : '', json.name, componentArgs, componentBody, isForwardRef ? ')' : '', getPropsDefinition({ json: json }), reactNativeStyles
        ? "const styles = StyleSheet.create(".concat(json5_1.default.stringify(reactNativeStyles), ");")
        : '', styledComponentsCode !== null && styledComponentsCode !== void 0 ? styledComponentsCode : '', isSubComponent
        ? ''
        : options.stateType === 'mobx'
            ? "\n      const observed".concat(json.name, " = observer(").concat(json.name, ");\n      export default observed").concat(json.name, ";\n    ")
            : "export default ".concat(json.name, ";"));
    return (0, replace_new_lines_in_strings_1.stripNewlinesInStrings)(str);
};
var templateObject_1, templateObject_2;
