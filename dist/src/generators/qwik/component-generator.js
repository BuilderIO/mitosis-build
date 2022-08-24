"use strict";
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
exports.componentToQwik = void 0;
var babel_transform_1 = require("../../helpers/babel-transform");
var fast_clone_1 = require("../../helpers/fast-clone");
var collect_css_1 = require("../../helpers/styles/collect-css");
var mitosis_component_1 = require("../../types/mitosis-component");
var state_1 = require("../../helpers/state");
var add_prevent_default_1 = require("./add-prevent-default");
var convert_method_to_function_1 = require("./convert-method-to-function");
var jsx_1 = require("./jsx");
var src_generator_1 = require("./src-generator");
var plugins_1 = require("../../modules/plugins");
var traverse_1 = __importDefault(require("traverse"));
Error.stackTraceLimit = 9999;
// TODO(misko): styles are not processed.
var DEBUG = false;
var componentToQwik = function (userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return function (_a) {
        var _b, _c, _d, _e;
        var _component = _a.component, path = _a.path;
        // Make a copy we can safely mutate, similar to babel's toolchain
        var component = (0, fast_clone_1.fastClone)(_component);
        if (userOptions.plugins) {
            component = (0, plugins_1.runPreJsonPlugins)(component, userOptions.plugins);
        }
        (0, add_prevent_default_1.addPreventDefault)(component);
        if (userOptions.plugins) {
            component = (0, plugins_1.runPostJsonPlugins)(component, userOptions.plugins);
        }
        var file = new src_generator_1.File(component.name + '.js', {
            isPretty: true,
            isJSX: true,
            isTypeScript: false,
            isModule: true,
            isBuilder: false,
        }, '@builder.io/qwik', '');
        try {
            emitImports(file, component);
            emitTypes(file, component);
            var metadata = component.meta.useMetadata || {};
            var isLightComponent = ((_c = (_b = metadata === null || metadata === void 0 ? void 0 : metadata.qwik) === null || _b === void 0 ? void 0 : _b.component) === null || _c === void 0 ? void 0 : _c.isLight) || false;
            var mutable_1 = ((_d = metadata === null || metadata === void 0 ? void 0 : metadata.qwik) === null || _d === void 0 ? void 0 : _d.mutable) || [];
            var imports_1 = (_e = metadata === null || metadata === void 0 ? void 0 : metadata.qwik) === null || _e === void 0 ? void 0 : _e.imports;
            imports_1 && Object.keys(imports_1).forEach(function (key) { return file.import(imports_1[key], key); });
            var state_2 = emitStateMethodsAndRewriteBindings(file, component, metadata);
            var hasState_1 = (0, state_1.checkHasState)(component);
            var css_1 = null;
            var componentBody = (0, src_generator_1.arrowFnBlock)(['props'], [
                function () {
                    css_1 = emitUseStyles(file, component);
                    emitUseContext(file, component);
                    emitUseRef(file, component);
                    hasState_1 && emitUseStore(file, state_2);
                    emitUseContextProvider(file, component);
                    emitUseMount(file, component);
                    emitUseWatch(file, component);
                    emitUseCleanup(file, component);
                    emitTagNameHack(file, component);
                    emitJSX(file, component, mutable_1);
                },
            ], [component.propsTypeRef || 'any']);
            file.src.const(component.name, isLightComponent
                ? componentBody
                : (0, src_generator_1.invoke)(file.import(file.qwikModule, 'component$'), [componentBody]), true, true);
            file.exportDefault(component.name);
            emitStyles(file, css_1);
            DEBUG && file.exportConst('COMPONENT', JSON.stringify(component, null, 2));
            return '// GENERATED BY MITOSIS\n\n' + file.toString();
        }
        catch (e) {
            console.error(e);
            return e.stack || String(e);
        }
    };
};
exports.componentToQwik = componentToQwik;
function emitTagNameHack(file, component) {
    var _a;
    var elementTag = (_a = component.meta.useMetadata) === null || _a === void 0 ? void 0 : _a.elementTag;
    if (elementTag) {
        file.src.emit(elementTag, '=', (0, convert_method_to_function_1.convertMethodToFunction)(elementTag, stateToMethodOrGetter(component.state), getLexicalScopeVars(component)), ';');
    }
}
function emitUseMount(file, component) {
    if (component.hooks.onMount) {
        // This is called useMount, but in practice it is used as
        // useClientEffect. Not sure if this is correct, but for now.
        var code = component.hooks.onMount.code;
        file.src.emit(file.import(file.qwikModule, 'useClientEffect$').localName, '(()=>{', code, '});');
    }
}
function emitUseWatch(file, component) {
    if (component.hooks.onUpdate) {
        component.hooks.onUpdate.forEach(function (onUpdate) {
            file.src.emit(file.import(file.qwikModule, 'useWatch$').localName, '(({track})=>{');
            emitTrackExpressions(file.src, onUpdate.deps);
            file.src.emit(convertTypeScriptToJS(onUpdate.code));
            file.src.emit('});');
        });
    }
}
function emitTrackExpressions(src, deps) {
    if (deps && deps.startsWith('[') && deps.endsWith(']')) {
        var dependencies = deps.substring(1, deps.length - 1).split(',');
        dependencies.forEach(function (dep) {
            var lastDotIdx = dep.lastIndexOf('.');
            if (lastDotIdx > 0) {
                var objExp = dep.substring(0, lastDotIdx).replace(/\?$/, '');
                var objProp = dep.substring(lastDotIdx + 1);
                objExp && src.emit(objExp, '&&track(', objExp, ',"', objProp, '");');
            }
        });
    }
}
function emitUseCleanup(file, component) {
    if (component.hooks.onUnMount) {
        var code = component.hooks.onUnMount.code;
        file.src.emit(file.import(file.qwikModule, 'useCleanup$').localName, '(()=>{', code, '});');
    }
}
function emitJSX(file, component, mutable) {
    var directives = new Map();
    var handlers = new Map();
    var styles = new Map();
    var parentSymbolBindings = {};
    var mutablePredicate = mutable.length > 0
        ? function (code) {
            return !!mutable.find(function (txt) {
                return code.indexOf(txt) !== -1;
            });
        }
        : undefined;
    file.src.emit('return ', (0, jsx_1.renderJSXNodes)(file, directives, handlers, component.children, styles, parentSymbolBindings, mutablePredicate));
}
function emitUseContextProvider(file, component) {
    Object.keys(component.context.set).forEach(function (ctxKey) {
        var context = component.context.set[ctxKey];
        file.src.emit(file.import(file.qwikModule, 'useContextProvider').localName, '(', context.name, ',', file.import(file.qwikModule, 'useStore').localName, '({');
        context.value &&
            Object.keys(context.value).forEach(function (prop) {
                var propValue = context.value[prop];
                file.src.emit(prop, ':');
                if ((propValue === null || propValue === void 0 ? void 0 : propValue.type) === 'getter') {
                    file.src.emit('(()=>{', extractGetterBody(propValue.code), '})(),');
                }
                else if (typeof propValue == 'function') {
                    throw new Error('Qwik: Functions are not supported in context');
                }
                else {
                    file.src.emit(JSON.stringify(propValue));
                }
            });
        file.src.emit('})', ');');
    });
}
function emitUseContext(file, component) {
    Object.keys(component.context.get).forEach(function (ctxKey) {
        var context = component.context.get[ctxKey];
        file.src.emit('const ', ctxKey, '=', file.import(file.qwikModule, 'useContext').localName, '(', context.name, ');');
    });
}
function emitUseRef(file, component) {
    Object.keys(component.refs).forEach(function (refKey) {
        file.src.emit("const ", refKey, '=', file.import(file.qwikModule, 'useRef').localName, '();');
    });
}
function emitUseStyles(file, component) {
    var css = (0, collect_css_1.collectCss)(component, { prefix: component.name });
    if (css) {
        file.src.emit(file.import(file.qwikModule, 'useStylesScoped$').localName, '(STYLES);');
    }
    return css;
}
function emitStyles(file, css) {
    if (css) {
        file.exportConst('STYLES', '`' + css.replace(/`/g, '\\`') + '`');
    }
}
/**
 * @param file
 * @param stateInit
 */
function emitUseStore(file, stateInit) {
    var state = stateInit[0];
    var hasState = state && Object.keys(state).length > 0;
    if (hasState) {
        file.src.emit('const state=', file.import(file.qwikModule, 'useStore').localName, '(');
        file.src.emit(JSON.stringify(state));
        file.src.emit(');');
    }
    else {
        // TODO hack for now so that `state` variable is defined, even though it is never read.
        file.src.emit('const state={};');
    }
}
function emitTypes(file, component) {
    var _a;
    if (file.options.isTypeScript) {
        (_a = component.types) === null || _a === void 0 ? void 0 : _a.forEach(function (t) { return file.src.emit(t, '\n'); });
    }
}
function emitStateMethodsAndRewriteBindings(file, component, metadata) {
    var _a;
    var lexicalArgs = getLexicalScopeVars(component);
    var state = emitStateMethods(file, component.state, lexicalArgs);
    var methodMap = stateToMethodOrGetter(component.state);
    rewriteCodeExpr(component, methodMap, lexicalArgs, (_a = metadata.qwik) === null || _a === void 0 ? void 0 : _a.replace);
    return state;
}
var checkIsObjectWithCodeBlock = function (obj) {
    return typeof obj == 'object' && (obj === null || obj === void 0 ? void 0 : obj.code) && typeof obj.code === 'string';
};
function rewriteCodeExpr(component, methodMap, lexicalArgs, replace) {
    if (replace === void 0) { replace = {}; }
    (0, traverse_1.default)(component).forEach(function (item) {
        if (!((0, mitosis_component_1.checkIsCodeValue)(item) || checkIsObjectWithCodeBlock(item))) {
            return;
        }
        var code = (0, convert_method_to_function_1.convertMethodToFunction)(item.code, methodMap, lexicalArgs);
        Object.keys(replace).forEach(function (key) {
            code = code.replace(key, replace[key]);
        });
        item.code = code;
    });
}
function getLexicalScopeVars(component) {
    return __spreadArray(__spreadArray(['props', 'state'], Object.keys(component.refs), true), Object.keys(component.context.get), true);
}
function emitImports(file, component) {
    var _a;
    // <SELF> is used for self-referencing within the file.
    file.import('<SELF>', component.name);
    (_a = component.imports) === null || _a === void 0 ? void 0 : _a.forEach(function (i) {
        Object.keys(i.imports).forEach(function (key) {
            var keyValue = i.imports[key];
            file.import(i.path.replace('.lite', '').replace('.tsx', ''), keyValue, key);
        });
    });
}
function emitStateMethods(file, componentState, lexicalArgs) {
    var stateValues = {};
    var stateInit = [stateValues];
    var methodMap = stateToMethodOrGetter(componentState);
    Object.keys(componentState).forEach(function (key) {
        var stateValue = componentState[key];
        if ((0, mitosis_component_1.checkIsCodeValue)(stateValue)) {
            var code = stateValue.code;
            var prefixIdx = 0;
            if (stateValue.type === 'getter') {
                prefixIdx += 'get '.length;
            }
            else if (stateValue.type === 'function') {
                prefixIdx += 'function '.length;
            }
            code = code.substring(prefixIdx);
            code = (0, convert_method_to_function_1.convertMethodToFunction)(code, methodMap, lexicalArgs).replace('(', "(".concat(lexicalArgs.join(','), ","));
            var functionName = code.split(/\(/)[0];
            if (stateValue.type === 'getter') {
                stateInit.push("state.".concat(key, "=").concat(functionName, "(").concat(lexicalArgs.join(','), ")"));
            }
            if (!file.options.isTypeScript) {
                // Erase type information
                code = convertTypeScriptToJS(code);
            }
            file.exportConst(functionName, 'function ' + code, true);
        }
        else {
            stateValues[key] = stateValue === null || stateValue === void 0 ? void 0 : stateValue.code;
        }
    });
    return stateInit;
}
function convertTypeScriptToJS(code) {
    return (0, babel_transform_1.babelTransformExpression)(code, {});
}
function extractGetterBody(code) {
    var start = code.indexOf('{');
    var end = code.lastIndexOf('}');
    return code.substring(start + 1, end).trim();
}
function stateToMethodOrGetter(state) {
    var methodMap = {};
    Object.keys(state).forEach(function (key) {
        var stateVal = state[key];
        if ((stateVal === null || stateVal === void 0 ? void 0 : stateVal.type) === 'getter' || (stateVal === null || stateVal === void 0 ? void 0 : stateVal.type) === 'method') {
            methodMap[key] = stateVal.type;
        }
    });
    return methodMap;
}
