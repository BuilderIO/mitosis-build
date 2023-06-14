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
exports.componentToMitosis = exports.blockToMitosis = exports.DEFAULT_FORMAT = void 0;
var json5_1 = __importDefault(require("json5"));
var standalone_1 = require("prettier/standalone");
var hooks_1 = require("../constants/hooks");
var html_tags_1 = require("../constants/html_tags");
var dedent_1 = require("../helpers/dedent");
var fast_clone_1 = require("../helpers/fast-clone");
var get_components_1 = require("../helpers/get-components");
var get_refs_1 = require("../helpers/get-refs");
var get_state_object_string_1 = require("../helpers/get-state-object-string");
var is_root_text_node_1 = require("../helpers/is-root-text-node");
var map_refs_1 = require("../helpers/map-refs");
var render_imports_1 = require("../helpers/render-imports");
var state_1 = require("../helpers/state");
var mitosis_node_1 = require("../types/mitosis-node");
var react_1 = require("./react");
exports.DEFAULT_FORMAT = 'legacy';
// Special isValidAttributeName for Mitosis so we can allow for $ in names
var isValidAttributeName = function (str) {
    return Boolean(str && /^[$a-z0-9\-_:]+$/i.test(str));
};
var blockToMitosis = function (json, toMitosisOptions, component) {
    var _a, _b, _c, _d, _e, _f;
    if (toMitosisOptions === void 0) { toMitosisOptions = {}; }
    var options = __assign({ format: exports.DEFAULT_FORMAT }, toMitosisOptions);
    if (options.format === 'react') {
        return (0, react_1.blockToReact)(json, {
            format: 'lite',
            stateType: 'useState',
            stylesType: 'emotion',
            type: 'dom',
            prettier: options.prettier,
        }, component);
    }
    if ((0, mitosis_node_1.checkIsForNode)(json)) {
        var needsWrapper = json.children.length !== 1;
        return "<For each={".concat((_a = json.bindings.each) === null || _a === void 0 ? void 0 : _a.code, "}>\n    {(").concat(json.scope.forName, ", index) =>\n      ").concat(needsWrapper ? '<>' : '', "\n        ").concat(json.children.map(function (child) { return (0, exports.blockToMitosis)(child, options, component); }), "}\n      ").concat(needsWrapper ? '</>' : '', "\n    </For>");
    }
    if (json.properties._text) {
        return json.properties._text;
    }
    if ((_b = json.bindings._text) === null || _b === void 0 ? void 0 : _b.code) {
        return "{".concat((_c = json.bindings._text) === null || _c === void 0 ? void 0 : _c.code, "}");
    }
    var str = '';
    str += "<".concat(json.name, " ");
    for (var key in json.properties) {
        var value = (json.properties[key] || '').replace(/"/g, '&quot;').replace(/\n/g, '\\n');
        if (!isValidAttributeName(key)) {
            console.warn('Skipping invalid attribute name:', key);
        }
        else {
            str += " ".concat(key, "=\"").concat(value, "\" ");
        }
    }
    for (var key in json.bindings) {
        var value = (_d = json.bindings[key]) === null || _d === void 0 ? void 0 : _d.code;
        if (((_e = json.bindings[key]) === null || _e === void 0 ? void 0 : _e.type) === 'spread') {
            str += " {...(".concat((_f = json.bindings[key]) === null || _f === void 0 ? void 0 : _f.code, ")} ");
        }
        else if (key.startsWith('on')) {
            str += " ".concat(key, "={event => ").concat(value.replace(/\s*;$/, ''), "} ");
        }
        else {
            if (!isValidAttributeName(key)) {
                console.warn('Skipping invalid attribute name:', key);
            }
            else {
                str += " ".concat(key, "={").concat(value, "} ");
            }
        }
    }
    if (html_tags_1.SELF_CLOSING_HTML_TAGS.has(json.name)) {
        return str + ' />';
    }
    // Self close by default if no children
    if (!json.children.length) {
        str += ' />';
        return str;
    }
    str += '>';
    if (json.children) {
        str += json.children.map(function (item) { return (0, exports.blockToMitosis)(item, options, component); }).join('\n');
    }
    str += "</".concat(json.name, ">");
    return str;
};
exports.blockToMitosis = blockToMitosis;
var getRefsString = function (json, refs) {
    var _a, _b;
    if (refs === void 0) { refs = Array.from((0, get_refs_1.getRefs)(json)); }
    var str = '';
    for (var _i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
        var ref = refs_1[_i];
        var typeParameter = ((_a = json['refs'][ref]) === null || _a === void 0 ? void 0 : _a.typeParameter) || '';
        var argument = ((_b = json['refs'][ref]) === null || _b === void 0 ? void 0 : _b.argument) || '';
        str += "\nconst ".concat(ref, " = useRef").concat(typeParameter ? "<".concat(typeParameter, ">") : '', "(").concat(argument, ");");
    }
    return str;
};
var mitosisCoreComponents = ['Show', 'For'];
var componentToMitosis = function (toMitosisOptions) {
    if (toMitosisOptions === void 0) { toMitosisOptions = {}; }
    return function (_a) {
        var _b, _c;
        var component = _a.component;
        var options = __assign({ format: exports.DEFAULT_FORMAT }, toMitosisOptions);
        if (options.format === 'react') {
            return (0, react_1.componentToReact)({
                format: 'lite',
                stateType: 'useState',
                stylesType: 'emotion',
                prettier: options.prettier,
            })({ component: component });
        }
        var json = (0, fast_clone_1.fastClone)(component);
        var domRefs = (0, get_refs_1.getRefs)(component);
        // grab refs not used for bindings
        var jsRefs = Object.keys(component.refs).filter(function (ref) { return domRefs.has(ref); });
        var refs = __spreadArray(__spreadArray([], jsRefs, true), Array.from(domRefs), true);
        (0, map_refs_1.mapRefs)(json, function (refName) {
            return "".concat(refName).concat(domRefs.has(refName) ? ".current" : '');
        });
        var addWrapper = json.children.length !== 1 || (0, is_root_text_node_1.isRootTextNode)(json);
        var components = Array.from((0, get_components_1.getComponents)(json));
        var mitosisComponents = components.filter(function (item) { return mitosisCoreComponents.includes(item); });
        var otherComponents = components.filter(function (item) { return !mitosisCoreComponents.includes(item); });
        var hasState = (0, state_1.checkHasState)(component);
        var needsMitosisCoreImport = Boolean(hasState || refs.length || mitosisComponents.length);
        var stringifiedUseMetadata = json5_1.default.stringify(component.meta.useMetadata);
        // TODO: smart only pull in imports as needed
        var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    export default function ", "(props) {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      return (", "\n        ", "\n        ", ")\n    }\n\n  "], ["\n    ", "\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    export default function ", "(props) {\n      ", "\n      ", "\n\n      ", "\n\n      ", "\n\n      return (", "\n        ", "\n        ", ")\n    }\n\n  "])), !needsMitosisCoreImport
            ? ''
            : "import { ".concat(!hasState ? '' : 'useStore, ', " ").concat(!refs.length ? '' : 'useRef, ', " ").concat(mitosisComponents.join(', '), " } from '@builder.io/mitosis';"), !otherComponents.length ? '' : "import { ".concat(otherComponents.join(','), " } from '@components';"), json.types ? json.types.join('\n') : '', (0, render_imports_1.renderPreComponent)({ component: json, target: 'mitosis' }), stringifiedUseMetadata && stringifiedUseMetadata !== '{}'
            ? "".concat(hooks_1.HOOKS.METADATA, "(").concat(stringifiedUseMetadata, ")")
            : '', component.name, !hasState ? '' : "const state = useStore(".concat((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), ");"), getRefsString(json, refs), !((_b = json.hooks.onMount) === null || _b === void 0 ? void 0 : _b.code) ? '' : "onMount(() => { ".concat(json.hooks.onMount.code, " })"), !((_c = json.hooks.onUnMount) === null || _c === void 0 ? void 0 : _c.code) ? '' : "onUnMount(() => { ".concat(json.hooks.onUnMount.code, " })"), addWrapper ? '<>' : '', json.children.map(function (item) { return (0, exports.blockToMitosis)(item, options, component); }).join('\n'), addWrapper ? '</>' : '');
        if (options.prettier !== false) {
            try {
                str = (0, standalone_1.format)(str, {
                    parser: 'typescript',
                    plugins: [
                        require('prettier/parser-typescript'), // To support running in browsers
                    ],
                });
            }
            catch (err) {
                console.error('Format error for file:', str, JSON.stringify(json, null, 2));
                throw err;
            }
        }
        return str;
    };
};
exports.componentToMitosis = componentToMitosis;
var templateObject_1;
