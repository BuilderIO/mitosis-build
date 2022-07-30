"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToQwik = void 0;
var collect_css_1 = require("../../helpers/styles/collect-css");
var convertMethodToFunction_1 = require("./convertMethodToFunction");
var jsx_1 = require("./jsx");
var src_generator_1 = require("./src-generator");
var babel_transform_1 = require("../../helpers/babel-transform");
Error.stackTraceLimit = 9999;
// TODO(misko): styles are not processed.
var DEBUG = true;
var componentToQwik = function (userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return function (_a) {
        var _b, _c;
        var component = _a.component, path = _a.path;
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
            var state_1 = emitStateMethodsAndRewriteBindings(file, component);
            var hasState_1 = Boolean(Object.keys(component.state).length);
            var css_1 = null;
            var topLevelElement_1 = isLightComponent ? null : getTopLevelElement(component);
            var componentBody = (0, src_generator_1.arrowFnBlock)(['props'], [
                function () {
                    css_1 = emitUseStyles(file, component);
                    emitUseContext(file, component);
                    emitUseRef(file, component);
                    hasState_1 && emitUseStore(file, state_1);
                    emitUseContextProvider(file, component);
                    emitUseMount(file, component);
                    emitUseWatch(file, component);
                    emitUseCleanup(file, component);
                    emitTagNameHack(file, component);
                    emitJSX(file, component, topLevelElement_1);
                },
            ], [component.propsTypeRef || 'any']);
            file.src.const(component.name, isLightComponent
                ? componentBody
                : (0, src_generator_1.invoke)(file.import(file.qwikModule, 'component$'), __spreadArray([
                    componentBody
                ], (topLevelElement_1 ? ["{tagName:\"".concat(topLevelElement_1, "\"}")] : []), true)), true, true);
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
        file.src.emit(elementTag, '=', (0, convertMethodToFunction_1.convertMethodToFunction)(elementTag, stateToMethodOrGetter(component.state), getLexicalScopeVars(component)), ';');
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
            file.src.emit(file.import(file.qwikModule, 'useWatch$').localName, '((track)=>{');
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
function emitJSX(file, component, topLevelElement) {
    var directives = new Map();
    var handlers = new Map();
    var styles = new Map();
    var parentSymbolBindings = {};
    var children = component.children;
    if (topLevelElement && children.length == 1) {
        var child = children[0];
        children[0] = __assign(__assign({}, child), { name: 'Host' });
        file.import(file.qwikModule, 'Host');
    }
    file.src.emit('return ', (0, jsx_1.renderJSXNodes)(file, directives, handlers, children, styles, parentSymbolBindings));
}
function emitUseContextProvider(file, component) {
    Object.keys(component.context.set).forEach(function (ctxKey) {
        var context = component.context.set[ctxKey];
        file.src.emit(file.import(file.qwikModule, 'useContextProvider').localName, '(', context.name, ',', file.import(file.qwikModule, 'useStore').localName, '({');
        context.value &&
            Object.keys(context.value).forEach(function (prop) {
                var propValue = context.value[prop];
                file.src.emit(prop, ':');
                if (isGetter(propValue)) {
                    file.src.emit('(()=>{', extractGetterBody(propValue), '})(),');
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
    var css = (0, collect_css_1.collectCss)(component);
    if (css) {
        file.src.emit(file.import(file.qwikModule, 'useScopedStyles$').localName, '(STYLES);');
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
    var _a, _b;
    if (file.options.isTypeScript) {
        (_a = component.types) === null || _a === void 0 ? void 0 : _a.forEach(function (t) { return file.src.emit(t, '\n'); });
        (_b = component.interfaces) === null || _b === void 0 ? void 0 : _b.forEach(function (i) { return file.src.emit(i); });
    }
}
function emitStateMethodsAndRewriteBindings(file, component) {
    var lexicalArgs = getLexicalScopeVars(component);
    var state = emitStateMethods(file, component.state, lexicalArgs);
    var methodMap = stateToMethodOrGetter(component.state);
    rewriteCodeExpr(component, methodMap, lexicalArgs);
    return state;
}
function rewriteCodeExpr(obj, methodMap, lexicalArgs) {
    if (obj && typeof obj == 'object') {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) { return rewriteCodeExpr(item, methodMap, lexicalArgs); });
        }
        else {
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                if (typeof value == 'string') {
                    if (value.startsWith(CODE_PREFIX) || key == 'code') {
                        obj[key] = (0, convertMethodToFunction_1.convertMethodToFunction)(value, methodMap, lexicalArgs);
                    }
                }
                rewriteCodeExpr(value, methodMap, lexicalArgs);
            });
        }
    }
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
var CODE_PREFIX = '@builder.io/mitosis/';
var FUNCTION = CODE_PREFIX + 'function:';
var METHOD = CODE_PREFIX + 'method:';
var GETTER = CODE_PREFIX + 'method:get ';
function emitStateMethods(file, componentState, lexicalArgs) {
    var state = {};
    var stateInit = [state];
    var methodMap = stateToMethodOrGetter(componentState);
    Object.keys(componentState).forEach(function (key) {
        var code = componentState[key];
        if (isCode(code)) {
            var codeIisGetter = isGetter(code);
            var prefixIdx = code.indexOf(':') + 1;
            if (codeIisGetter) {
                prefixIdx += 'get '.length;
            }
            else if (isFunction(code)) {
                prefixIdx += 'function '.length;
            }
            code = code.substring(prefixIdx);
            code = (0, convertMethodToFunction_1.convertMethodToFunction)(code, methodMap, lexicalArgs).replace('(', "(".concat(lexicalArgs.join(','), ","));
            var functionName = code.split(/\(/)[0];
            if (codeIisGetter) {
                stateInit.push("state.".concat(key, "=").concat(functionName, "(").concat(lexicalArgs.join(','), ")"));
            }
            if (!file.options.isTypeScript) {
                // Erase type information
                code = convertTypeScriptToJS(code);
            }
            file.exportConst(functionName, 'function ' + code, true);
        }
        else {
            state[key] = code;
        }
    });
    return stateInit;
}
function convertTypeScriptToJS(code) {
    return (0, babel_transform_1.babelTransformExpression)(code, {});
}
function isGetter(code) {
    return typeof code === 'string' && code.startsWith(GETTER);
}
function isCode(code) {
    return typeof code === 'string' && code.startsWith(CODE_PREFIX);
}
function isFunction(code) {
    return typeof code === 'string' && code.startsWith(FUNCTION);
}
function extractGetterBody(code) {
    var start = code.indexOf('{');
    var end = code.lastIndexOf('}');
    return code.substring(start + 1, end).trim();
}
function stateToMethodOrGetter(state) {
    var methodMap = {};
    Object.keys(state).forEach(function (key) {
        var code = state[key];
        if (typeof code == 'string' && code.startsWith(METHOD)) {
            methodMap[key] = code.startsWith(GETTER) ? 'getter' : 'method';
        }
    });
    return methodMap;
}
/**
 * Return a top-level element for the component.
 *
 * WHAT: If the component has a single root element, than this returns the element name.
 *
 * WHY: This is useful to pull the root element into the component's host and those saving unnecessary wrapping.
 *
 * @param component
 */
function getTopLevelElement(component) {
    var _a;
    if (((_a = component.children) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        var child = component.children[0];
        if (child['@type'] === '@builder.io/mitosis/node' && startsLowerCase(child.name)) {
            return child.name;
        }
    }
    return null;
}
function startsLowerCase(name) {
    return name.length > 0 && name[0].toLowerCase() === name[0];
}
