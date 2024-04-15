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
var html_tags_1 = require("../../constants/html_tags");
var dedent_1 = require("../../helpers/dedent");
var fast_clone_1 = require("../../helpers/fast-clone");
var get_components_used_1 = require("../../helpers/get-components-used");
var get_custom_imports_1 = require("../../helpers/get-custom-imports");
var get_prop_functions_1 = require("../../helpers/get-prop-functions");
var get_props_1 = require("../../helpers/get-props");
var get_props_ref_1 = require("../../helpers/get-props-ref");
var get_refs_1 = require("../../helpers/get-refs");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var indent_1 = require("../../helpers/indent");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var is_upper_case_1 = require("../../helpers/is-upper-case");
var map_refs_1 = require("../../helpers/map-refs");
var merge_options_1 = require("../../helpers/merge-options");
var process_code_1 = require("../../helpers/plugins/process-code");
var remove_surrounding_block_1 = require("../../helpers/remove-surrounding-block");
var render_imports_1 = require("../../helpers/render-imports");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var slots_1 = require("../../helpers/slots");
var strip_meta_properties_1 = require("../../helpers/strip-meta-properties");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var collect_css_1 = require("../../helpers/styles/collect-css");
var helpers_1 = require("../../helpers/styles/helpers");
var plugins_1 = require("../../modules/plugins");
var mitosis_node_1 = require("../../types/mitosis-node");
var function_1 = require("fp-ts/lib/function");
var lodash_1 = require("lodash");
var standalone_1 = require("prettier/standalone");
var traverse_1 = __importDefault(require("traverse"));
var is_children_1 = __importDefault(require("../../helpers/is-children"));
var on_mount_1 = require("../helpers/on-mount");
var helpers_2 = require("./helpers");
var types_1 = require("./types");
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
var preprocessCssAsJson = function (json) {
    (0, traverse_1.default)(json).forEach(function (item) {
        var _a, _b;
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            if ((0, helpers_1.nodeHasCss)(item)) {
                if ((_b = (_a = item.bindings.css) === null || _a === void 0 ? void 0 : _a.code) === null || _b === void 0 ? void 0 : _b.includes('&quot;')) {
                    item.bindings.css.code = item.bindings.css.code.replace(/&quot;/g, '"');
                }
            }
        }
    });
};
var generateNgModule = function (content, name, componentsUsed, component, bootstrapMapper) {
    return "import { NgModule } from \"@angular/core\";\nimport { CommonModule } from \"@angular/common\";\n\n".concat(content, "\n\n@NgModule({\n  declarations: [").concat(name, "],\n  imports: [CommonModule").concat(componentsUsed.length ? ', ' + componentsUsed.map(function (comp) { return "".concat(comp, "Module"); }).join(', ') : '', "],\n  exports: [").concat(name, "],\n  ").concat(bootstrapMapper ? bootstrapMapper(name, componentsUsed, component) : '', "\n})\nexport class ").concat(name, "Module {}");
};
// TODO: Maybe in the future allow defining `string | function` as values
var BINDINGS_MAPPER = {
    innerHTML: 'innerHTML',
    style: 'ngStyle',
};
var handleObjectBindings = function (code) {
    var objectCode = code.replace(/^{/, '').replace(/}$/, '');
    objectCode = objectCode.replace(/\/\/.*\n/g, '');
    var spreadOutObjects = objectCode
        .split(',')
        .filter(function (item) { return item.includes('...'); })
        .map(function (item) { return item.replace('...', '').trim(); });
    var objectKeys = objectCode
        .split(',')
        .filter(function (item) { return !item.includes('...'); })
        .map(function (item) { return item.trim(); });
    var otherObjs = objectKeys.map(function (item) {
        return "{ ".concat(item, " }");
    });
    var temp = "".concat(spreadOutObjects.join(', '), ", ").concat(otherObjs.join(', '));
    if (temp.endsWith(', ')) {
        temp = temp.slice(0, -2);
    }
    if (temp.startsWith(', ')) {
        temp = temp.slice(2);
    }
    // handle template strings
    if (temp.includes('`')) {
        // template str
        var str = temp.match(/`[^`]*`/g);
        var values = str && str[0].match(/\${[^}]*}/g);
        var forValues = values === null || values === void 0 ? void 0 : values.map(function (val) { return val.slice(2, -1); }).join(' + ');
        if (str && forValues) {
            temp = temp.replace(str[0], forValues);
        }
    }
    return temp;
};
var processCodeBlockInTemplate = function (code) {
    // contains helper calls as Angular doesn't support JS expressions in templates
    if (code.startsWith('{')) {
        // Objects cannot be spread out directly in Angular so we need to use `useObjectWrapper`
        return "\"useObjectWrapper(".concat(handleObjectBindings(code), ")\" ");
    }
    else if (code.startsWith('Object.values')) {
        var stripped = code.replace('Object.values', '');
        return "\"useObjectDotValues".concat(stripped, "\" ");
    }
    else if (code.includes('JSON.stringify')) {
        var obj = code.match(/JSON.stringify\([^)]*\)/g);
        return "\"useJsonStringify(".concat(obj, ")\" ");
    }
    else if (code.includes(' as ')) {
        var asIndex = code.indexOf('as');
        var asCode = code.slice(0, asIndex - 1);
        return "\"$any".concat(asCode, ")\"");
    }
    else {
        return "\"".concat(code, "\" ");
    }
};
var processEventBinding = function (key, code, nodeName, customArg) {
    var event = key.replace('on', '');
    event = event.charAt(0).toLowerCase() + event.slice(1);
    if (event === 'change' && nodeName === 'input' /* todo: other tags */) {
        event = 'input';
    }
    // TODO: proper babel transform to replace. Util for this
    var eventName = customArg;
    var regexp = new RegExp('(^|\\n|\\r| |;|\\(|\\[|!)' + eventName + '(\\?\\.|\\.|\\(| |;|\\)|$)', 'g');
    var replacer = '$1$event$2';
    var finalValue = (0, remove_surrounding_block_1.removeSurroundingBlock)(code.replace(regexp, replacer));
    return " (".concat(event, ")=\"").concat(finalValue, "\" ");
};
var stringifyBinding = function (node, options, blockOptions) {
    return function (_a) {
        var key = _a[0], binding = _a[1];
        if ((binding === null || binding === void 0 ? void 0 : binding.type) === 'spread') {
            return;
        }
        if (key.startsWith('$')) {
            return;
        }
        if (key === 'key') {
            return;
        }
        if (key === 'attributes') {
            // TODO: contains ternary operator which needs to be handled
            return;
        }
        var keyToUse = BINDINGS_MAPPER[key] || key;
        var _b = binding, code = _b.code, _c = _b.arguments, cusArgs = _c === void 0 ? ['event'] : _c;
        // TODO: proper babel transform to replace. Util for this
        if (keyToUse.startsWith('on')) {
            return processEventBinding(keyToUse, code, node.name, cusArgs[0]);
        }
        else if (keyToUse === 'class') {
            return " [class]=\"".concat(code, "\" ");
        }
        else if (keyToUse === 'ref') {
            return " #".concat(code, " ");
        }
        else if ((html_tags_1.VALID_HTML_TAGS.includes(node.name.trim()) || keyToUse.includes('-')) &&
            !blockOptions.nativeAttributes.includes(keyToUse) &&
            !Object.values(BINDINGS_MAPPER).includes(keyToUse)) {
            // standard html elements need the attr to satisfy the compiler in many cases: eg: svg elements and [fill]
            return " [attr.".concat(keyToUse, "]=\"").concat(code, "\" ");
        }
        else {
            return "[".concat(keyToUse, "]=").concat(processCodeBlockInTemplate(code));
        }
    };
};
var handleNgOutletBindings = function (node) {
    var allProps = '';
    var events = '';
    for (var key in node.bindings) {
        if (key.startsWith('"')) {
            continue;
        }
        if (key.startsWith('$')) {
            continue;
        }
        var _a = node.bindings[key], code = _a.code, _b = _a.arguments, cusArgs = _b === void 0 ? ['event'] : _b;
        if (code.includes('?')) {
            // TODO handle ternary
            continue;
        }
        else if (key.includes('props.')) {
            allProps += "".concat(key.replace('props.', ''), ": ").concat(code, ", ");
        }
        else if (key.includes('.')) {
            // TODO: handle arbitrary spread props
            allProps += "".concat(key.split('.')[1], ": ").concat(code, ",");
        }
        else if (key.startsWith('on')) {
            events += processEventBinding(key, code, node.name, cusArgs[0]);
        }
        else {
            var codeToUse = processCodeBlockInTemplate(code);
            var keyToUse = key.includes('-') ? "'".concat(key, "'") : key;
            allProps += "".concat(keyToUse, ": ").concat(codeToUse, ", ");
        }
    }
    if (allProps.endsWith(', ')) {
        allProps = allProps.slice(0, -2);
    }
    if (allProps.startsWith(', ')) {
        allProps = allProps.slice(2);
    }
    return [allProps, events];
};
var blockToAngular = function (json, options, blockOptions) {
    var _a, _b, _c;
    if (options === void 0) { options = {}; }
    if (blockOptions === void 0) { blockOptions = {
        nativeAttributes: [],
    }; }
    var childComponents = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.childComponents) || [];
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
        if (textCode.includes('JSON.stringify')) {
            var obj = textCode.replace('JSON.stringify', '');
            obj = obj.replace(/\(.*?\)/, '');
            return "{{useJsonStringify".concat(obj, "}}");
        }
        return "{{".concat(textCode, "}}");
    }
    var str = '';
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        var indexName = json.scope.indexName;
        str += "<ng-container *ngFor=\"let ".concat(json.scope.forName, " of ").concat((_b = json.bindings.each) === null || _b === void 0 ? void 0 : _b.code).concat(indexName ? "; let ".concat(indexName, " = index") : '', "\">");
        str += json.children.map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); }).join('\n');
        str += "</ng-container>";
    }
    else if (json.name === 'Show') {
        var condition = (_c = json.bindings.when) === null || _c === void 0 ? void 0 : _c.code;
        if (condition === null || condition === void 0 ? void 0 : condition.includes('typeof')) {
            var wordAfterTypeof = condition.split('typeof')[1].trim();
            condition = condition.replace("typeof ".concat(wordAfterTypeof), "useTypeOf(".concat(wordAfterTypeof, ")"));
        }
        str += "<ng-container *ngIf=\"".concat(condition, "\">");
        str += json.children.map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); }).join('\n');
        str += "</ng-container>";
    }
    else if (json.name.includes('.')) {
        var elSelector = childComponents.find(function (impName) { return impName === json.name; })
            ? (0, lodash_1.kebabCase)(json.name)
            : json.name;
        var _d = handleNgOutletBindings(json), allProps = _d[0], events = _d[1];
        str += "<ng-container ".concat(events, " *ngComponentOutlet=\"\n      ").concat(elSelector.replace('state.', '').replace('props.', ''), ";\n      inputs: { ").concat(allProps, " };\n      content: myContent;\n      \">  ");
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
        var stringifiedBindings = Object.entries(json.bindings)
            .map(stringifyBinding(json, options, blockOptions))
            .join('');
        str += stringifiedBindings;
        if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
            return str + ' />';
        }
        str += '>';
        if (json.children) {
            str += json.children.map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); }).join('\n');
        }
        str += "</".concat(elSelector, ">");
    }
    return str;
};
exports.blockToAngular = blockToAngular;
var traverseToGetAllDynamicComponents = function (json, options, blockOptions) {
    var components = new Set();
    var dynamicTemplate = '';
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item) && item.name.includes('.') && item.name.split('.').length === 2) {
            var children = item.children
                .map(function (child) { return (0, exports.blockToAngular)(child, options, blockOptions); })
                .join('\n');
            dynamicTemplate = "<ng-template #".concat(item.name.split('.')[1].toLowerCase() + 'Template', ">").concat(children, "</ng-template>");
            components.add(item.name);
        }
    });
    return {
        components: components,
        dynamicTemplate: dynamicTemplate,
    };
};
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
var componentToAngular = function (userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var _component = _a.component;
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(_component);
        var useMetadata = (_b = json.meta) === null || _b === void 0 ? void 0 : _b.useMetadata;
        var contextVars = Object.keys(((_c = json === null || json === void 0 ? void 0 : json.context) === null || _c === void 0 ? void 0 : _c.get) || {});
        // TODO: Why is 'outputs' used here and shouldn't it be typed in packages/core/src/types/metadata.ts
        var metaOutputVars = (useMetadata === null || useMetadata === void 0 ? void 0 : useMetadata.outputs) || [];
        var outputVars = (0, lodash_1.uniq)(__spreadArray(__spreadArray([], metaOutputVars, true), (0, get_prop_functions_1.getPropFunctions)(json), true));
        var stateVars = Object.keys((json === null || json === void 0 ? void 0 : json.state) || {});
        var options = (0, merge_options_1.initializeOptions)({
            target: 'angular',
            component: _component,
            defaults: types_1.DEFAULT_ANGULAR_OPTIONS,
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
        var _l = (0, get_props_ref_1.getPropsRef)(json, true), forwardProp = _l[0], hasPropRef = _l[1];
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
        var _m = json.exports, localExports = _m === void 0 ? {} : _m;
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
        var hasConstructor = Boolean(injectables.length || ((_d = json.hooks) === null || _d === void 0 ? void 0 : _d.onInit));
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
        var domRefs = (0, get_refs_1.getRefs)(json);
        var jsRefs = Object.keys(json.refs).filter(function (ref) { return !domRefs.has(ref); });
        var componentsUsed = Array.from((0, get_components_used_1.getComponentsUsed)(json)).filter(function (item) {
            return item.length && (0, is_upper_case_1.isUpperCase)(item[0]) && !types_1.BUILT_IN_COMPONENTS.has(item);
        });
        (0, map_refs_1.mapRefs)(json, function (refName) {
            var isDomRef = domRefs.has(refName);
            return "this.".concat(isDomRef ? '' : '_').concat(refName).concat(isDomRef ? '.nativeElement' : '');
        });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)({ json: json, plugins: options.plugins });
        }
        preprocessCssAsJson(json);
        var css = (0, collect_css_1.collectCss)(json);
        if (options.prettier !== false) {
            css = tryFormat(css, 'css');
        }
        var helperFunctions = new Set();
        var template = json.children
            .map(function (item) {
            var _a, _b;
            var tmpl = (0, exports.blockToAngular)(item, options, {
                childComponents: childComponents,
                nativeAttributes: (_b = (_a = useMetadata === null || useMetadata === void 0 ? void 0 : useMetadata.angular) === null || _a === void 0 ? void 0 : _a.nativeAttributes) !== null && _b !== void 0 ? _b : [],
            });
            (0, helpers_2.getAppropriateTemplateFunctionKeys)(tmpl).forEach(function (key) {
                return helperFunctions.add(helpers_2.HELPER_FUNCTIONS[key]);
            });
            return tmpl;
        })
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
        var _o = traverseToGetAllDynamicComponents(json, options, {
            childComponents: childComponents,
            nativeAttributes: (_f = (_e = useMetadata === null || useMetadata === void 0 ? void 0 : useMetadata.angular) === null || _e === void 0 ? void 0 : _e.nativeAttributes) !== null && _f !== void 0 ? _f : [],
        }), dynamicComponents = _o.components, dynamicTemplate = _o.dynamicTemplate;
        // Preparing built in component metadata parameters
        var componentMetadata = __assign(__assign({ selector: "'".concat((0, lodash_1.kebabCase)(json.name || 'my-component'), ", ").concat(json.name, "'"), template: "`\n        ".concat((0, indent_1.indent)(dynamicTemplate, 8).replace(/`/g, '\\`').replace(/\$\{/g, '\\${'), "\n        ").concat((0, indent_1.indent)(template, 8).replace(/`/g, '\\`').replace(/\$\{/g, '\\${'), "\n        `") }, (css.length
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
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    import { ", " ", " Component ", "", " ", " } from '@angular/core';\n    ", "\n\n    ", "\n    ", "\n    ", "\n\n    @Component({\n      ", "\n    })\n    export default class ", " {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      \n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n    }\n  "], ["\n    import { ", " ", " Component ", "", " ", " } from '@angular/core';\n    ", "\n\n    ", "\n    ", "\n    ", "\n\n    @Component({\n      ", "\n    })\n    export default class ", " {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      \n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n    }\n  "])), outputs.length ? 'Output, EventEmitter, \n' : '', ((_g = options === null || options === void 0 ? void 0 : options.experimental) === null || _g === void 0 ? void 0 : _g.inject) ? 'Inject, forwardRef,' : '', domRefs.size || dynamicComponents.size ? ', ViewChild, ElementRef' : '', props.size ? ', Input' : '', dynamicComponents.size ? ', ViewContainerRef, TemplateRef' : '', options.standalone ? "import { CommonModule } from '@angular/common';" : '', json.types ? json.types.join('\n') : '', getPropsDefinition({ json: json }), (0, render_imports_1.renderPreComponent)({
            explicitImportFileExtension: options.explicitImportFileExtension,
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
            var propDeclaration = "@Input() ".concat(item, "!: ").concat(propType);
            if (json.defaultProps && json.defaultProps.hasOwnProperty(item)) {
                propDeclaration += " = defaultProps[\"".concat(item, "\"]");
            }
            return propDeclaration;
        })
            .join('\n'), outputs.join('\n'), Array.from(domRefs)
            .map(function (refName) { return "@ViewChild('".concat(refName, "') ").concat(refName, "!: ElementRef"); })
            .join('\n'), Array.from(dynamicComponents)
            .map(function (component) {
            return "@ViewChild('".concat(component
                .split('.')[1]
                .toLowerCase(), "Template', { static: true }) ").concat(component
                .split('.')[1]
                .toLowerCase(), "TemplateRef!: TemplateRef<any>");
        })
            .join('\n'), dynamicComponents.size ? 'myContent?: any[][];' : '', dataString, helperFunctions.size ? Array.from(helperFunctions).join('\n') : '', jsRefs
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
            .join('\n'), !hasConstructor && !dynamicComponents.size
            ? ''
            : "constructor(\n".concat(injectables.join(',\n')).concat(dynamicComponents.size ? '\nprivate vcRef: ViewContainerRef,\n' : '', ") {\n            ").concat(!((_h = json.hooks) === null || _h === void 0 ? void 0 : _h.onInit)
                ? ''
                : "\n              ".concat((_j = json.hooks.onInit) === null || _j === void 0 ? void 0 : _j.code, "\n              "), "\n          }\n          "), !json.hooks.onMount.length && !dynamicComponents.size
            ? ''
            : "ngOnInit() {\n              ".concat((0, on_mount_1.stringifySingleScopeOnMount)(json), "\n              ").concat(dynamicComponents.size
                ? "\n              this.myContent = [".concat(Array.from(dynamicComponents)
                    .map(function (component) {
                    return "this.vcRef.createEmbeddedView(this.".concat(component
                        .split('.')[1]
                        .toLowerCase(), "TemplateRef).rootNodes");
                })
                    .join(', '), "];\n              ")
                : '', "\n            }"), !((_k = json.hooks.onUpdate) === null || _k === void 0 ? void 0 : _k.length)
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
