"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCompositionApiScript = void 0;
var dedent_1 = __importDefault(require("dedent"));
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var helpers_1 = require("./helpers");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var getCompositionPropDefinition = function (_a) {
    var options = _a.options, component = _a.component, props = _a.props;
    var str = 'const props = ';
    if (component.defaultProps) {
        var generic = options.typescript ? "<".concat(component.propsTypeRef, ">") : '';
        str += "withDefaults(defineProps".concat(generic, "(), ").concat(json5_1.default.stringify(component.defaultProps), ")");
    }
    else if (options.typescript && component.propsTypeRef && component.propsTypeRef !== 'any') {
        str += "defineProps<".concat(component.propsTypeRef, ">()");
    }
    else {
        str += "defineProps(".concat(json5_1.default.stringify(props), ")");
    }
    return str;
};
function generateCompositionApiScript(component, options, template, props, onUpdateWithDeps, onUpdateWithoutDeps) {
    var _a, _b, _c, _d, _e, _f, _g;
    var refs = (0, get_state_object_string_1.getStateObjectStringFromComponent)(component, {
        data: true,
        functions: false,
        getters: false,
        format: 'variables',
        valueMapper: function (code, _, typeParameter) {
            return options.typescript && typeParameter ? "ref<".concat(typeParameter, ">(").concat(code, ")") : "ref(".concat(code, ")");
        },
        keyPrefix: 'const',
    });
    var methods = (0, get_state_object_string_1.getStateObjectStringFromComponent)(component, {
        data: false,
        getters: false,
        functions: true,
        format: 'variables',
    });
    if (template.includes('_classStringToObject')) {
        methods += " function _classStringToObject(str) {\n      const obj = {};\n      if (typeof str !== 'string') { return obj }\n      const classNames = str.trim().split(/\\s+/);\n      for (const name of classNames) {\n        obj[name] = true;\n      }\n      return obj;\n    } ";
    }
    var getterKeys = Object.keys((0, lodash_1.pickBy)(component.state, function (i) { return (i === null || i === void 0 ? void 0 : i.type) === 'getter'; }));
    var str = (0, dedent_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n  "], ["\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n  "])), props.length ? getCompositionPropDefinition({ component: component, props: props, options: options }) : '', refs, (_a = Object.keys(component.context.get)) === null || _a === void 0 ? void 0 : _a.map(function (key) { return "const ".concat(key, " = inject(").concat(component.context.get[key].name, ")"); }).join('\n'), (_b = Object.values(component.context.set)) === null || _b === void 0 ? void 0 : _b.map(function (contextSet) {
        return "provide(".concat(contextSet.name, ", ").concat((0, helpers_1.getContextValue)({
            json: component,
            options: options,
        })(contextSet), ")");
    }).join('\n'), (_c = Object.keys(component.refs)) === null || _c === void 0 ? void 0 : _c.map(function (key) {
        if (options.typescript) {
            return "const ".concat(key, " = ref<").concat(component.refs[key].typeParameter, ">()");
        }
        else {
            return "const ".concat(key, " = ref(null)");
        }
    }).join('\n'), (_e = (_d = component.hooks.onInit) === null || _d === void 0 ? void 0 : _d.code) !== null && _e !== void 0 ? _e : '', !((_f = component.hooks.onMount) === null || _f === void 0 ? void 0 : _f.code) ? '' : "onMounted(() => { ".concat(component.hooks.onMount.code, "})"), !((_g = component.hooks.onUnMount) === null || _g === void 0 ? void 0 : _g.code)
        ? ''
        : "onUnmounted(() => { ".concat(component.hooks.onUnMount.code, "})"), (getterKeys === null || getterKeys === void 0 ? void 0 : getterKeys.map(function (key) {
        var _a, _b;
        var code = (_b = (_a = component.state[key]) === null || _a === void 0 ? void 0 : _a.code) === null || _b === void 0 ? void 0 : _b.toString();
        if (!code) {
            return '';
        }
        // transform `foo() { return this.bar }` to `() => { return bar.value }`
        var getterAsFunction = code.replace(key, '').trim().replace(/^\(\)/, '() =>');
        var computedCode = "const ".concat(key, " = computed(").concat(getterAsFunction, ")");
        return computedCode;
    }).join('\n')) || '', (onUpdateWithoutDeps === null || onUpdateWithoutDeps === void 0 ? void 0 : onUpdateWithoutDeps.map(function (hook) { return "onUpdated(() => ".concat(hook.code, ")"); }).join('\n')) || '', (onUpdateWithDeps === null || onUpdateWithDeps === void 0 ? void 0 : onUpdateWithDeps.map(function (hook) {
        return "watch(() => ".concat(hook.deps, ", (").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(hook.deps), ") => { ").concat(hook.code, " })");
    }).join('\n')) || '', methods !== null && methods !== void 0 ? methods : '');
    return str;
}
exports.generateCompositionApiScript = generateCompositionApiScript;
var templateObject_1;
