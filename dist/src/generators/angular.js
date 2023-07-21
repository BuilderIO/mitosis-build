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
exports.componentToAngular = exports.blockToAngular = void 0;
var function_1 = require("fp-ts/lib/function");
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var html_tags_1 = require("../constants/html_tags");
var dedent_1 = require("../helpers/dedent");
var fast_clone_1 = require("../helpers/fast-clone");
var get_components_used_1 = require("../helpers/get-components-used");
var get_custom_imports_1 = require("../helpers/get-custom-imports");
var get_prop_functions_1 = require("../helpers/get-prop-functions");
var get_props_1 = require("../helpers/get-props");
var get_props_ref_1 = require("../helpers/get-props-ref");
var get_refs_1 = require("../helpers/get-refs");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var indent_1 = require("../helpers/indent");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var is_upper_case_1 = require("../helpers/is-upper-case");
var map_refs_1 = require("../helpers/map-refs");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var render_imports_1 = require("../helpers/render-imports");
var replace_identifiers_1 = require("../helpers/replace-identifiers");
var slots_1 = require("../helpers/slots");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var collect_css_1 = require("../helpers/styles/collect-css");
var plugins_1 = require("../modules/plugins");
var mitosis_node_1 = require("../types/mitosis-node");
var merge_options_1 = require("../helpers/merge-options");
var process_code_1 = require("../helpers/plugins/process-code");
var BUILT_IN_COMPONENTS = new Set(['Show', 'For', 'Fragment', 'Slot']);
var mappers = {
    Fragment: function (json, options) {
        return "<ng-container>".concat(json.children
            .map(function (item) { return (0, exports.blockToAngular)(item, options); })
            .join('\n'), "</ng-container>");
    },
    Slot: function (json, options) {
        var renderChildren = function () { var _a; return (_a = json.children) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (0, exports.blockToAngular)(item, options); }).join('\n'); };
        return "<ng-content ".concat(Object.entries(__assign(__assign({}, json.bindings), json.properties))
            .map(function (_a) {
            var binding = _a[0], value = _a[1];
            if (value && binding === 'name') {
                var selector = (0, function_1.pipe)((0, lodash_1.isString)(value) ? value : value.code, slots_1.stripSlotPrefix, lodash_1.kebabCase);
                return "select=\"[".concat(selector, "]\"");
            }
        })
            .join('\n'), ">").concat(Object.entries(json.bindings)
            .map(function (_a) {
            var binding = _a[0], value = _a[1];
            if (value && binding !== 'name') {
                return value.code;
            }
        })
            .join('\n')).concat(renderChildren(), "</ng-content>");
    },
};
var generateNgModule = function (content, name, componentsUsed, component, bootstrapMapper) {
    return "import { NgModule } from \"@angular/core\";\nimport { CommonModule } from \"@angular/common\";\n\n".concat(content, "\n\n@NgModule({\n  declarations: [").concat(name, "],\n  imports: [CommonModule").concat(componentsUsed.length ? ', ' + componentsUsed.map(function (comp) { return "".concat(comp, "Module"); }).join(', ') : '', "],\n  exports: [").concat(name, "],\n  ").concat(bootstrapMapper ? bootstrapMapper(name, componentsUsed, component) : '', "\n})\nexport class ").concat(name, "Module {}");
};
// TODO: Maybe in the future allow defining `string | function` as values
var BINDINGS_MAPPER = {
    innerHTML: 'innerHTML',
    style: 'ngStyle',
};
var blockToAngular = function (json, options, blockOptions) {
    var _a, _b, _c, _d;
    if (options === void 0) { options = {}; }
    if (blockOptions === void 0) { blockOptions = {}; }
    var childComponents = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.childComponents) || [];
    var isValidHtmlTag = html_tags_1.VALID_HTML_TAGS.includes(json.name.trim());
    if (mappers[json.name]) {
        return mappers[json.name](json, options);
    }
    if ((0, is_children_1.default)({ node: json })) {
        return "<ng-content></ng-content>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    var textCode = (_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code;
    if (textCode) {
        if ((0, slots_1.isSlotProperty)(textCode)) {
            var selector = (0, function_1.pipe)(textCode, slots_1.stripSlotPrefix, lodash_1.kebabCase);
            return "<ng-content select=\"[".concat(selector, "]\"></ng-content>");
        }
        return "{{".concat(textCode, "}}");
    }
    var str = '';
    var needsToRenderSlots = [];
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        var indexName = json.scope.indexName;
        str += "<ng-container *ngFor=\"let ".concat(json.scope.forName, " of ").concat((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code).concat(indexName ? "; let ".concat(indexName, " = index") : '', "\">");
        str += json.children.map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); }).join('\n');
        str += "</ng-container>";
    }
    else if (json.name === 'Show') {
        str += "<ng-container *ngIf=\"".concat((_c = json.bindings.when) === null || _c === void 0 ? void 0 : _c.code, "\">");
        str += json.children.map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); }).join('\n');
        str += "</ng-container>";
    }
    else {
        var elSelector = childComponents.find(function (impName) { return impName === json.name; })
            ? (0, lodash_1.kebabCase)(json.name)
            : json.name;
        str += "<".concat(elSelector, " ");
        // TODO: spread support for angular
        // if (json.bindings._spread) {
        //   str += `v-bind="${stripStateAndPropsRefs(
        //     json.bindings._spread as string,
        //   )}"`;
        // }
        for (var key in json.properties) {
            if (key.startsWith('$')) {
                continue;
            }
            var value = json.properties[key];
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
        for (var key in json.bindings) {
            if (((_d = json.bindings[key]) === null || _d === void 0 ? void 0 : _d.type) === 'spread') {
                continue;
            }
            if (key.startsWith('$')) {
                continue;
            }
            var _e = json.bindings[key], code = _e.code, _f = _e.arguments, cusArgs = _f === void 0 ? ['event'] : _f;
            // TODO: proper babel transform to replace. Util for this
            if (key.startsWith('on')) {
                var event_1 = key.replace('on', '');
                event_1 = event_1.charAt(0).toLowerCase() + event_1.slice(1);
                if (event_1 === 'change' && json.name === 'input' /* todo: other tags */) {
                    event_1 = 'input';
                }
                // TODO: proper babel transform to replace. Util for this
                var eventName = cusArgs[0];
                var regexp = new RegExp('(^|\\n|\\r| |;|\\(|\\[|!)' + eventName + '(\\?\\.|\\.|\\(| |;|\\)|$)', 'g');
                var replacer = '$1$event$2';
                var finalValue = (0, remove_surrounding_block_1.removeSurroundingBlock)(code.replace(regexp, replacer));
                str += " (".concat(event_1, ")=\"").concat(finalValue, "\" ");
            }
            else if (key === 'class') {
                str += " [class]=\"".concat(code, "\" ");
            }
            else if (key === 'ref') {
                str += " #".concat(code, " ");
            }
            else if ((0, slots_1.isSlotProperty)(key)) {
                var lowercaseKey = (0, function_1.pipe)(key, slots_1.stripSlotPrefix, function (x) { return x.toLowerCase(); });
                needsToRenderSlots.push("".concat(code.replace(/(\/\>)|\>/, " ".concat(lowercaseKey, ">"))));
            }
            else if (BINDINGS_MAPPER[key]) {
                str += " [".concat(BINDINGS_MAPPER[key], "]=\"").concat(code, "\"  ");
            }
            else if (isValidHtmlTag || key.includes('-')) {
                // standard html elements need the attr to satisfy the compiler in many cases: eg: svg elements and [fill]
                str += " [attr.".concat(key, "]=\"").concat(code, "\" ");
            }
            else {
                str += "[".concat(key, "]=\"").concat(code, "\" ");
            }
        }
        if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (needsToRenderSlots.length > 0) {
            str += needsToRenderSlots.map(function (el) { return el; }).join('');
        }
        if (json.children) {
            str += json.children.map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); }).join('\n');
        }
        str += "</".concat(elSelector, ">");
    }
    return str;
};
exports.blockToAngular = blockToAngular;
var processAngularCode = function (_a) {
    var contextVars = _a.contextVars, outputVars = _a.outputVars, domRefs = _a.domRefs, stateVars = _a.stateVars, replaceWith = _a.replaceWith;
    return function (code) {
        return (0, function_1.pipe)((0, strip_state_and_props_refs_1.DO_NOT_USE_VARS_TRANSFORMS)(code, {
            contextVars: contextVars,
            domRefs: domRefs,
            outputVars: outputVars,
            stateVars: stateVars,
        }), function (newCode) { return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(newCode, { replaceWith: replaceWith }); });
    };
};
var DEFAULT_OPTIONS = {
    preserveImports: false,
    preserveFileExtensions: false,
};
var componentToAngular = function (userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var _component = _a.component;
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(_component);
        var contextVars = Object.keys(((_b = json === null || json === void 0 ? void 0 : json.context) === null || _b === void 0 ? void 0 : _b.get) || {});
        var metaOutputVars = ((_d = (_c = json.meta) === null || _c === void 0 ? void 0 : _c.useMetadata) === null || _d === void 0 ? void 0 : _d.outputs) || [];
        var outputVars = (0, lodash_1.uniq)(__spreadArray(__spreadArray([], metaOutputVars, true), (0, get_prop_functions_1.getPropFunctions)(json), true));
        var stateVars = Object.keys((json === null || json === void 0 ? void 0 : json.state) || {});
        var options = (0, merge_options_1.initializeOptions)({
            target: 'angular',
            component: _component,
            defaults: DEFAULT_OPTIONS,
            userOptions: userOptions,
        });
        options.plugins = __spreadArray(__spreadArray([], (options.plugins || []), true), [
            (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType) {
                switch (codeType) {
                    case 'hooks':
                        return (0, function_1.flow)(processAngularCode({
                            replaceWith: 'this',
                            contextVars: contextVars,
                            outputVars: outputVars,
                            domRefs: Array.from((0, get_refs_1.getRefs)(json)),
                            stateVars: stateVars,
                        }), function (code) {
                            var allMethodNames = Object.entries(json.state)
                                .filter(function (_a) {
                                var _ = _a[0], value = _a[1];
                                return (value === null || value === void 0 ? void 0 : value.type) === 'function' || (value === null || value === void 0 ? void 0 : value.type) === 'method';
                            })
                                .map(function (_a) {
                                var key = _a[0];
                                return key;
                            });
                            return (0, replace_identifiers_1.replaceIdentifiers)({
                                code: code,
                                from: allMethodNames,
                                to: function (name) { return "this.".concat(name); },
                            });
                        });
                    case 'bindings':
                        return function (code) {
                            var newLocal = processAngularCode({
                                contextVars: [],
                                outputVars: outputVars,
                                domRefs: [], // the template doesn't need the this keyword.
                            })(code);
                            return newLocal.replace(/"/g, '&quot;');
                        };
                    case 'hooks-deps':
                    case 'state':
                    case 'context-set':
                    case 'properties':
                    case 'dynamic-jsx-elements':
                    case 'types':
                        return function (x) { return x; };
                }
            }),
        ], false);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var _o = (0, get_props_ref_1.getPropsRef)(json, true), forwardProp = _o[0], hasPropRef = _o[1];
        var childComponents = [];
        var propsTypeRef = json.propsTypeRef !== 'any' ? json.propsTypeRef : undefined;
        json.imports.forEach(function (_a) {
            var imports = _a.imports;
            Object.keys(imports).forEach(function (key) {
                if (imports[key] === 'default') {
                    childComponents.push(key);
                }
            });
        });
        var customImports = (0, get_custom_imports_1.getCustomImports)(json);
        var _p = json.exports, localExports = _p === void 0 ? {} : _p;
        var localExportVars = Object.keys(localExports)
            .filter(function (key) { return localExports[key].usedInLocal; })
            .map(function (key) { return "".concat(key, " = ").concat(key, ";"); });
        var injectables = contextVars.map(function (variableName) {
            var _a, _b, _c, _d;
            var variableType = (_a = json === null || json === void 0 ? void 0 : json.context) === null || _a === void 0 ? void 0 : _a.get[variableName].name;
            if ((_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.injectables) {
                return (_c = options === null || options === void 0 ? void 0 : options.experimental) === null || _c === void 0 ? void 0 : _c.injectables(variableName, variableType);
            }
            if ((_d = options === null || options === void 0 ? void 0 : options.experimental) === null || _d === void 0 ? void 0 : _d.inject) {
                return "@Inject(forwardRef(() => ".concat(variableType, ")) public ").concat(variableName, ": ").concat(variableType);
            }
            return "public ".concat(variableName, " : ").concat(variableType);
        });
        var hasConstructor = Boolean(injectables.length || ((_e = json.hooks) === null || _e === void 0 ? void 0 : _e.onInit));
        var props = (0, get_props_1.getProps)(json);
        // prevent jsx props from showing up as @Input
        if (hasPropRef) {
            props.delete(forwardProp);
        }
        props.delete('children');
        // remove props for outputs
        outputVars.forEach(function (variableName) {
            props.delete(variableName);
        });
        var outputs = outputVars.map(function (variableName) {
            var _a, _b;
            if ((_a = options === null || options === void 0 ? void 0 : options.experimental) === null || _a === void 0 ? void 0 : _a.outputs) {
                return (_b = options === null || options === void 0 ? void 0 : options.experimental) === null || _b === void 0 ? void 0 : _b.outputs(json, variableName);
            }
            return "@Output() ".concat(variableName, " = new EventEmitter()");
        });
        var hasOnMount = Boolean((_f = json.hooks) === null || _f === void 0 ? void 0 : _f.onMount);
        var domRefs = (0, get_refs_1.getRefs)(json);
        var jsRefs = Object.keys(json.refs).filter(function (ref) { return !domRefs.has(ref); });
        var componentsUsed = Array.from((0, get_components_used_1.getComponentsUsed)(json)).filter(function (item) {
            return item.length && (0, is_upper_case_1.isUpperCase)(item[0]) && !BUILT_IN_COMPONENTS.has(item);
        });
        (0, map_refs_1.mapRefs)(json, function (refName) {
            var isDomRef = domRefs.has(refName);
            return "this.".concat(isDomRef ? '' : '_').concat(refName).concat(isDomRef ? '.nativeElement' : '');
        });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        var css = (0, collect_css_1.collectCss)(json);
        if (options.prettier !== false) {
            css = tryFormat(css, 'css');
        }
        var template = json.children
            .map(function (item) { return (0, exports.blockToAngular)(item, options, { childComponents: childComponents }); })
            .join('\n');
        if (options.prettier !== false) {
            template = tryFormat(template, 'html');
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            valueMapper: processAngularCode({
                replaceWith: 'this',
                contextVars: contextVars,
                outputVars: outputVars,
                domRefs: Array.from(domRefs),
                stateVars: stateVars,
            }),
        });
        // Preparing built in component metadata parameters
        var componentMetadata = __assign(__assign({ selector: "'".concat((0, lodash_1.kebabCase)(json.name || 'my-component'), ", ").concat(json.name, "'"), template: "`\n        ".concat((0, indent_1.indent)(template, 8).replace(/`/g, '\\`').replace(/\$\{/g, '\\${'), "\n        `") }, (css.length
            ? {
                styles: "[`".concat((0, indent_1.indent)(css, 8), "`]"),
            }
            : {})), (options.standalone
            ? // TODO: also add child component imports here as well
                {
                    standalone: 'true',
                    imports: "[".concat(__spreadArray(['CommonModule'], componentsUsed, true).join(', '), "]"),
                }
            : {}));
        // Taking into consideration what user has passed in options and allowing them to override the default generated metadata
        Object.entries(json.meta.angularConfig || {}).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            componentMetadata[key] = value;
        });
        var getPropsDefinition = function (_a) {
            var json = _a.json;
            if (!json.defaultProps)
                return '';
            var defalutPropsString = Object.keys(json.defaultProps)
                .map(function (prop) {
                var _a;
                var value = json.defaultProps.hasOwnProperty(prop)
                    ? (_a = json.defaultProps[prop]) === null || _a === void 0 ? void 0 : _a.code
                    : 'undefined';
                return "".concat(prop, ": ").concat(value);
            })
                .join(',');
            return "const defaultProps = {".concat(defalutPropsString, "};\n");
        };
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    import { ", " ", " Component ", "", " } from '@angular/core';\n    ", "\n\n    ", "\n    ", "\n    ", "\n\n    @Component({\n      ", "\n    })\n    export class ", " {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n    }\n  "], ["\n    import { ", " ", " Component ", "", " } from '@angular/core';\n    ", "\n\n    ", "\n    ", "\n    ", "\n\n    @Component({\n      ", "\n    })\n    export class ", " {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n    }\n  "])), outputs.length ? 'Output, EventEmitter, \n' : '', ((_g = options === null || options === void 0 ? void 0 : options.experimental) === null || _g === void 0 ? void 0 : _g.inject) ? 'Inject, forwardRef,' : '', domRefs.size ? ', ViewChild, ElementRef' : '', props.size ? ', Input' : '', options.standalone ? "import { CommonModule } from '@angular/common';" : '', json.types ? json.types.join('\n') : '', getPropsDefinition({ json: json }), (0, render_imports_1.renderPreComponent)({
            component: json,
            target: 'angular',
            excludeMitosisComponents: !options.standalone && !options.preserveImports,
            preserveFileExtensions: options.preserveFileExtensions,
            componentsUsed: componentsUsed,
            importMapper: options === null || options === void 0 ? void 0 : options.importMapper,
        }), Object.entries(componentMetadata)
            .map(function (_a) {
            var k = _a[0], v = _a[1];
            return "".concat(k, ": ").concat(v);
        })
            .join(','), json.name, localExportVars.join('\n'), customImports.map(function (name) { return "".concat(name, " = ").concat(name); }).join('\n'), Array.from(props)
            .filter(function (item) { return !(0, slots_1.isSlotProperty)(item) && item !== 'children'; })
            .map(function (item) {
            var propType = propsTypeRef ? "".concat(propsTypeRef, "[\"").concat(item, "\"]") : 'any';
            var propDeclaration = "@Input() ".concat(item, ": ").concat(propType);
            if (json.defaultProps && json.defaultProps.hasOwnProperty(item)) {
                propDeclaration += " = defaultProps[\"".concat(item, "\"]");
            }
            return propDeclaration;
        })
            .join('\n'), outputs.join('\n'), Array.from(domRefs)
            .map(function (refName) { return "@ViewChild('".concat(refName, "') ").concat(refName, ": ElementRef"); })
            .join('\n'), dataString, jsRefs
            .map(function (ref) {
            var argument = json.refs[ref].argument;
            var typeParameter = json.refs[ref].typeParameter;
            return "private _".concat(ref).concat(typeParameter ? ": ".concat(typeParameter) : '').concat(argument
                ? " = ".concat(processAngularCode({
                    replaceWith: 'this.',
                    contextVars: contextVars,
                    outputVars: outputVars,
                    domRefs: Array.from(domRefs),
                    stateVars: stateVars,
                })(argument))
                : '', ";");
        })
            .join('\n'), !hasConstructor
            ? ''
            : "constructor(\n".concat(injectables.join(',\n'), ") {\n            ").concat(!((_h = json.hooks) === null || _h === void 0 ? void 0 : _h.onInit)
                ? ''
                : "\n              ".concat((_j = json.hooks.onInit) === null || _j === void 0 ? void 0 : _j.code, "\n              "), "\n          }\n          "), !hasOnMount
            ? ''
            : "ngOnInit() {\n\n              ".concat(!((_k = json.hooks) === null || _k === void 0 ? void 0 : _k.onMount)
                ? ''
                : "\n                ".concat((_l = json.hooks.onMount) === null || _l === void 0 ? void 0 : _l.code, "\n                "), "\n            }"), !((_m = json.hooks.onUpdate) === null || _m === void 0 ? void 0 : _m.length)
            ? ''
            : "ngAfterContentChecked() {\n              ".concat(json.hooks.onUpdate.reduce(function (code, hook) {
                code += hook.code;
                return code + '\n';
            }, ''), "\n            }"), !json.hooks.onUnMount
            ? ''
            : "ngOnDestroy() {\n              ".concat(json.hooks.onUnMount.code, "\n            }"));
        if (options.standalone !== true) {
            str = generateNgModule(str, json.name, componentsUsed, json, options.bootstrapMapper);
        }
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        if (options.prettier !== false) {
            str = tryFormat(str, 'typescript');
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)({ json: json, code: str, plugins: options.plugins });
        }
        return str;
    };
};
exports.componentToAngular = componentToAngular;
var tryFormat = function (str, parser) {
    try {
        return (0, standalone_1.format)(str, {
            parser: parser,
            plugins: [
                // To support running in browsers
                require('prettier/parser-typescript'),
                require('prettier/parser-postcss'),
                require('prettier/parser-html'),
                require('prettier/parser-babel'),
            ],
            htmlWhitespaceSensitivity: 'ignore',
        });
    }
    catch (err) {
        console.warn('Could not prettify', { string: str }, err);
    }
    return str;
};
var templateObject_1;
