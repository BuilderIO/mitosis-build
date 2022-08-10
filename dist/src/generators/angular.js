"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var dedent_1 = __importDefault(require("dedent"));
var standalone_1 = require("prettier/standalone");
var collect_css_1 = require("../helpers/styles/collect-css");
var fast_clone_1 = require("../helpers/fast-clone");
var get_refs_1 = require("../helpers/get-refs");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var map_refs_1 = require("../helpers/map-refs");
var render_imports_1 = require("../helpers/render-imports");
var strip_state_and_props_refs_1 = require("../helpers/strip-state-and-props-refs");
var jsx_1 = require("../parsers/jsx");
var plugins_1 = require("../modules/plugins");
var is_children_1 = __importDefault(require("../helpers/is-children"));
var get_props_1 = require("../helpers/get-props");
var get_props_ref_1 = require("../helpers/get-props-ref");
var get_prop_functions_1 = require("../helpers/get-prop-functions");
var lodash_1 = require("lodash");
var strip_meta_properties_1 = require("../helpers/strip-meta-properties");
var remove_surrounding_block_1 = require("../helpers/remove-surrounding-block");
var indent_1 = require("../helpers/indent");
var slots_1 = require("../helpers/slots");
var is_upper_case_1 = require("../helpers/is-upper-case");
var mappers = {
    Fragment: function (json, options, blockOptions) {
        return "<div>".concat(json.children
            .map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); })
            .join('\n'), "</div>");
    },
    Slot: function (json, options, blockOptions) {
        return "<ng-content ".concat(Object.keys(json.bindings)
            .map(function (binding) {
            var _a, _b, _c;
            if (binding === 'name') {
                var selector = (0, lodash_1.kebabCase)((_b = (_a = json.bindings.name) === null || _a === void 0 ? void 0 : _a.code) === null || _b === void 0 ? void 0 : _b.replace('props.slot', ''));
                return "select=\"[".concat(selector, "]\"");
            }
            return "".concat((_c = json.bindings[binding]) === null || _c === void 0 ? void 0 : _c.code);
        })
            .join('\n'), "></ng-content>");
    },
};
// TODO: Maybe in the future allow defining `string | function` as values
var BINDINGS_MAPPER = {
    innerHTML: 'innerHTML',
    style: 'ngStyle',
};
var blockToAngular = function (json, options, blockOptions) {
    var _a, _b, _c, _d, _e, _f;
    if (options === void 0) { options = {}; }
    if (blockOptions === void 0) { blockOptions = {}; }
    var contextVars = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.contextVars) || [];
    var outputVars = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.outputVars) || [];
    var childComponents = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.childComponents) || [];
    var domRefs = (blockOptions === null || blockOptions === void 0 ? void 0 : blockOptions.domRefs) || [];
    if (mappers[json.name]) {
        return mappers[json.name](json, options, blockOptions);
    }
    if ((0, is_children_1.default)(json)) {
        return "<ng-content></ng-content>";
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if (/props\.slot/.test((_a = json.bindings._text) === null || _a === void 0 ? void 0 : _a.code)) {
        var selector = (0, lodash_1.kebabCase)((_c = (_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code) === null || _c === void 0 ? void 0 : _c.replace('props.slot', ''));
        return "<ng-content select=\"[".concat(selector, "]\"></ng-content>");
    }
    if ((_d = json.bindings._text) === null || _d === void 0 ? void 0 : _d.code) {
        return "{{".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(json.bindings._text.code, {
            // the context is the class
            contextVars: [],
            outputVars: outputVars,
            domRefs: domRefs,
        }), "}}");
    }
    var str = '';
    var needsToRenderSlots = [];
    if (json.name === 'For') {
        str += "<ng-container *ngFor=\"let ".concat(json.properties._forName, " of ").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_e = json.bindings.each) === null || _e === void 0 ? void 0 : _e.code, {
            contextVars: contextVars,
            outputVars: outputVars,
            domRefs: domRefs,
        }), "\">");
        str += json.children.map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); }).join('\n');
        str += "</ng-container>";
    }
    else if (json.name === 'Show') {
        str += "<ng-container *ngIf=\"".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_f = json.bindings.when) === null || _f === void 0 ? void 0 : _f.code, {
            contextVars: contextVars,
            outputVars: outputVars,
            domRefs: domRefs,
        }), "\">");
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
            if (key === '_spread') {
                continue;
            }
            if (key.startsWith('$')) {
                continue;
            }
            var _g = json.bindings[key], code = _g.code, _h = _g.arguments, cusArgs = _h === void 0 ? ['event'] : _h;
            // TODO: proper babel transform to replace. Util for this
            var useValue = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
                contextVars: contextVars,
                outputVars: outputVars,
                domRefs: domRefs,
            });
            if (key.startsWith('on')) {
                var event_1 = key.replace('on', '').toLowerCase();
                if (event_1 === 'change' && json.name === 'input' /* todo: other tags */) {
                    event_1 = 'input';
                }
                // TODO: proper babel transform to replace. Util for this
                var eventName = cusArgs[0];
                var regexp = new RegExp('(^|\\n|\\r| |;|\\(|\\[|!)' + eventName + '(\\?\\.|\\.|\\(| |;|\\)|$)', 'g');
                var replacer = '$1$event$2';
                var finalValue = (0, remove_surrounding_block_1.removeSurroundingBlock)(useValue.replace(regexp, replacer));
                str += " (".concat(event_1, ")=\"").concat(finalValue, "\" ");
            }
            else if (key === 'class') {
                str += " [class]=\"".concat(useValue, "\" ");
            }
            else if (key === 'ref') {
                str += " #".concat(useValue, " ");
            }
            else if ((0, slots_1.isSlotProperty)(key)) {
                var lowercaseKey = key.replace('slot', '')[0].toLowerCase() + key.replace('slot', '').substring(1);
                needsToRenderSlots.push("".concat(useValue.replace(/(\/\>)|\>/, " ".concat(lowercaseKey, ">"))));
            }
            else if (BINDINGS_MAPPER[key]) {
                str += " [".concat(BINDINGS_MAPPER[key], "]=\"").concat(useValue.replace(/"/g, "\\'"), "\"  ");
            }
            else {
                str += " [".concat(key, "]='").concat(useValue, "' ");
            }
        }
        if (jsx_1.selfClosingTags.has(json.name)) {
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
var componentToAngular = function (options) {
    if (options === void 0) { options = {}; }
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var component = _a.component;
        // Make a copy we can safely mutate, similar to babel's toolchain
        var json = (0, fast_clone_1.fastClone)(component);
        if (options.plugins) {
            json = (0, plugins_1.runPreJsonPlugins)(json, options.plugins);
        }
        var _p = (0, get_props_ref_1.getPropsRef)(json, true), forwardProp = _p[0], hasPropRef = _p[1];
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
        var customImports = json.imports
            .filter(function (item) {
            return item.path.startsWith('.');
        })
            .map(function (item) {
            return Object.keys(item.imports).filter(function (item) { return item && !(0, is_upper_case_1.isUpperCase)(item[0]); });
        })
            .flat();
        var _q = component.exports, localExports = _q === void 0 ? {} : _q;
        var localExportVars = Object.keys(localExports)
            .filter(function (key) { return localExports[key].usedInLocal; })
            .map(function (key) { return "".concat(key, " = ").concat(key, ";"); });
        var metaOutputVars = ((_c = (_b = json.meta) === null || _b === void 0 ? void 0 : _b.useMetadata) === null || _c === void 0 ? void 0 : _c.outputs) || [];
        var contextVars = Object.keys(((_d = json === null || json === void 0 ? void 0 : json.context) === null || _d === void 0 ? void 0 : _d.get) || {});
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
        var hasConstructor = Boolean(injectables.length || ((_e = component.hooks) === null || _e === void 0 ? void 0 : _e.onInit));
        var props = (0, get_props_1.getProps)(component);
        // prevent jsx props from showing up as @Input
        if (hasPropRef) {
            props.delete(forwardProp);
        }
        props.delete('children');
        var outputVars = (0, lodash_1.uniq)(__spreadArray(__spreadArray([], metaOutputVars, true), (0, get_prop_functions_1.getPropFunctions)(component), true));
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
        var hasOnMount = Boolean((_f = component.hooks) === null || _f === void 0 ? void 0 : _f.onMount);
        var domRefs = (0, get_refs_1.getRefs)(json);
        var jsRefs = Object.keys(json.refs).filter(function (ref) { return !domRefs.has(ref); });
        var stateVars = Object.keys((json === null || json === void 0 ? void 0 : json.state) || {});
        (0, map_refs_1.mapRefs)(json, function (refName) {
            var isDomRef = domRefs.has(refName);
            return "this.".concat(isDomRef ? '' : '_').concat(refName).concat(isDomRef ? '.nativeElement' : '');
        });
        if (options.plugins) {
            json = (0, plugins_1.runPostJsonPlugins)(json, options.plugins);
        }
        var css = (0, collect_css_1.collectCss)(json);
        if (options.prettier !== false) {
            css = tryFormat(css, 'css');
        }
        var blockOptions = {
            contextVars: contextVars,
            outputVars: outputVars,
            domRefs: [],
            childComponents: childComponents,
        };
        var template = json.children
            .map(function (item) { return (0, exports.blockToAngular)(item, options, blockOptions); })
            .join('\n');
        if (options.prettier !== false) {
            template = tryFormat(template, 'html');
        }
        (0, strip_meta_properties_1.stripMetaProperties)(json);
        var dataString = (0, get_state_object_string_1.getStateObjectStringFromComponent)(json, {
            format: 'class',
            valueMapper: function (code) {
                return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(code, {
                    replaceWith: 'this.',
                    contextVars: contextVars,
                    outputVars: outputVars,
                    domRefs: Array.from(domRefs),
                    stateVars: stateVars,
                });
            },
        });
        var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    import { ", " ", " Component ", "", " } from '@angular/core';\n    ", "\n\n    ", "\n    ", "\n    ", "\n\n    @Component({\n      ", "\n      selector: '", "',\n      template: `\n        ", "\n      `,\n      ", "\n    })\n    export default class ", " {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n    }\n  "], ["\n    import { ", " ", " Component ", "", " } from '@angular/core';\n    ", "\n\n    ", "\n    ", "\n    ", "\n\n    @Component({\n      ", "\n      selector: '", "',\n      template: \\`\n        ", "\n      \\`,\n      ", "\n    })\n    export default class ", " {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n    }\n  "])), outputs.length ? 'Output, EventEmitter, \n' : '', ((_g = options === null || options === void 0 ? void 0 : options.experimental) === null || _g === void 0 ? void 0 : _g.inject) ? 'Inject, forwardRef,' : '', domRefs.size ? ', ViewChild, ElementRef' : '', props.size ? ', Input' : '', options.standalone ? "import { CommonModule } from '@angular/common';" : '', json.types ? json.types.join('\n') : '', json.interfaces ? (_h = json.interfaces) === null || _h === void 0 ? void 0 : _h.join('\n') : '', (0, render_imports_1.renderPreComponent)({ component: json, target: 'angular' }), options.standalone
            ? // TODO: also add child component imports here as well
                "\n        standalone: true,\n        imports: [CommonModule],\n      "
            : '', (0, lodash_1.kebabCase)(json.name || 'my-component'), (0, indent_1.indent)(template, 8).replace(/`/g, '\\`').replace(/\$\{/g, '\\${'), css.length
            ? "styles: [\n        `".concat((0, indent_1.indent)(css, 8), "`\n      ],")
            : '', component.name, localExportVars.join('\n'), customImports.map(function (name) { return "".concat(name, " = ").concat(name); }).join('\n'), Array.from(props)
            .filter(function (item) { return !(0, slots_1.isSlotProperty)(item) && item !== 'children'; })
            .map(function (item) {
            var propType = propsTypeRef ? "".concat(propsTypeRef, "[\"").concat(item, "\"]") : 'any';
            return "@Input() ".concat(item, ": ").concat(propType);
        })
            .join('\n'), outputs.join('\n'), Array.from(domRefs)
            .map(function (refName) { return "@ViewChild('".concat(refName, "') ").concat(refName, ": ElementRef"); })
            .join('\n'), dataString, jsRefs
            .map(function (ref) {
            var argument = component.refs[ref].argument;
            var typeParameter = component.refs[ref].typeParameter;
            return "private _".concat(ref).concat(typeParameter ? ": ".concat(typeParameter) : '').concat(argument
                ? " = ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(argument, {
                    replaceWith: 'this.',
                    contextVars: contextVars,
                    outputVars: outputVars,
                    domRefs: Array.from(domRefs),
                    stateVars: stateVars,
                }))
                : '', ";");
        })
            .join('\n'), !hasConstructor
            ? ''
            : "constructor(\n".concat(injectables.join(',\n'), ") {\n            ").concat(!((_j = component.hooks) === null || _j === void 0 ? void 0 : _j.onInit)
                ? ''
                : "\n              ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_k = component.hooks.onInit) === null || _k === void 0 ? void 0 : _k.code, {
                    replaceWith: 'this.',
                    contextVars: contextVars,
                    outputVars: outputVars,
                }), "\n              "), "\n          }\n          "), !hasOnMount
            ? ''
            : "ngOnInit() {\n              \n              ".concat(!((_l = component.hooks) === null || _l === void 0 ? void 0 : _l.onMount)
                ? ''
                : "\n                ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)((_m = component.hooks.onMount) === null || _m === void 0 ? void 0 : _m.code, {
                    replaceWith: 'this.',
                    contextVars: contextVars,
                    outputVars: outputVars,
                    domRefs: Array.from(domRefs),
                    stateVars: stateVars,
                }), "\n                "), "\n            }"), !((_o = component.hooks.onUpdate) === null || _o === void 0 ? void 0 : _o.length)
            ? ''
            : "ngAfterContentChecked() {\n              ".concat(component.hooks.onUpdate.reduce(function (code, hook) {
                code += (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(hook.code, {
                    replaceWith: 'this.',
                    contextVars: contextVars,
                    outputVars: outputVars,
                    domRefs: Array.from(domRefs),
                    stateVars: stateVars,
                });
                return code + '\n';
            }, ''), "\n            }"), !component.hooks.onUnMount
            ? ''
            : "ngOnDestroy() {\n              ".concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(component.hooks.onUnMount.code, {
                replaceWith: 'this.',
                contextVars: contextVars,
                outputVars: outputVars,
                domRefs: Array.from(domRefs),
                stateVars: stateVars,
            }), "\n            }"));
        if (options.plugins) {
            str = (0, plugins_1.runPreCodePlugins)(str, options.plugins);
        }
        if (options.prettier !== false) {
            str = tryFormat(str, 'typescript');
        }
        if (options.plugins) {
            str = (0, plugins_1.runPostCodePlugins)(str, options.plugins);
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
