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
var json5_1 = __importDefault(require("json5"));
var lodash_1 = require("lodash");
var dedent_1 = require("../../helpers/dedent");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var helpers_1 = require("./helpers");
var getCompositionPropDefinition = function (_a) {
    var options = _a.options, component = _a.component, props = _a.props;
    var isTs = options.typescript;
    var str = 'const props = ';
    if (component.defaultProps) {
        var generic = isTs ? "<".concat(component.propsTypeRef, ">") : '';
        var defalutPropsString = props
            .map(function (prop) {
            var _a;
            var value = component.defaultProps.hasOwnProperty(prop)
                ? (_a = component.defaultProps[prop]) === null || _a === void 0 ? void 0 : _a.code
                : 'undefined';
            return "".concat(prop, ": ").concat(value);
        })
            .join(',');
        str += "withDefaults(defineProps".concat(generic, "(), {").concat(defalutPropsString, "})");
    }
    else if (isTs && component.propsTypeRef && component.propsTypeRef !== 'any') {
        str += "defineProps<".concat(component.propsTypeRef, ">()");
    }
    else {
        str += "defineProps(".concat(json5_1.default.stringify(props), ")");
    }
    return str;
};
function generateCompositionApiScript(component, options, template, props, onUpdateWithDeps, onUpdateWithoutDeps) {
    var _a, _b, _c, _d, _e, _f, _g;
    var isTs = options.typescript;
    var refs = (0, get_state_object_string_1.getStateObjectStringFromComponent)(component, {
        data: true,
        functions: false,
        getters: false,
        format: 'variables',
        valueMapper: function (code, _, typeParameter) {
            return isTs && typeParameter ? "ref<".concat(typeParameter, ">(").concat(code, ")") : "ref(".concat(code, ")");
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
        methods += " function _classStringToObject(str".concat(isTs ? ': string' : '', ") {\n      const obj").concat(isTs ? ': Record<string, boolean>' : '', " = {};\n      if (typeof str !== 'string') { return obj }\n      const classNames = str.trim().split(/\\s+/);\n      for (const name of classNames) {\n        obj[name] = true;\n      }\n      return obj;\n    } ");
    }
    var getterKeys = Object.keys((0, lodash_1.pickBy)(component.state, function (i) { return (i === null || i === void 0 ? void 0 : i.type) === 'getter'; }));
    var str = (0, dedent_1.dedent)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n  "], ["\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n    ", "\n    ", "\n    ", "\n\n    ", "\n\n    ", "\n    ", "\n  "])), props.length ? getCompositionPropDefinition({ component: component, props: props, options: options }) : '', refs, (_a = Object.entries(component.context.get)) === null || _a === void 0 ? void 0 : _a.map(function (_a) {
        var key = _a[0], context = _a[1];
        return "const ".concat(key, " = inject(").concat((0, helpers_1.getContextKey)(context), ")");
    }).join('\n'), (_b = Object.values(component.context.set)) === null || _b === void 0 ? void 0 : _b.map(function (contextSet) {
        var contextValue = (0, helpers_1.getContextValue)(contextSet);
        var key = (0, helpers_1.getContextKey)(contextSet);
        return "provide(".concat(key, ", ").concat(contextValue, ")");
    }).join('\n'), (_c = Object.keys(component.refs)) === null || _c === void 0 ? void 0 : _c.map(function (key) {
        if (isTs) {
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
    }).join('\n')) || '', (onUpdateWithoutDeps === null || onUpdateWithoutDeps === void 0 ? void 0 : onUpdateWithoutDeps.map(function (hook) { return "onUpdated(() => {".concat(hook.code, "})"); }).join('\n')) || '', (onUpdateWithDeps === null || onUpdateWithDeps === void 0 ? void 0 : onUpdateWithDeps.map(function (hook) {
        return "watch(() => ".concat((0, helpers_1.processBinding)({
            code: hook.deps || '',
            options: options,
            json: component,
        }), ", (").concat((0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(hook.deps), ") => { ").concat(hook.code, " }, {immediate: true})");
    }).join('\n')) || '', methods !== null && methods !== void 0 ? methods : '');
    return str;
}
exports.generateCompositionApiScript = generateCompositionApiScript;
var templateObject_1;
