"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToQwik = void 0;
var standalone_1 = require("prettier/standalone");
var fast_clone_1 = require("../../helpers/fast-clone");
var collect_css_1 = require("../../helpers/styles/collect-css");
var state_1 = require("../../helpers/state");
var add_prevent_default_1 = require("./helpers/add-prevent-default");
var convert_method_to_function_1 = require("./helpers/convert-method-to-function");
var jsx_1 = require("./jsx");
var src_generator_1 = require("./src-generator");
var plugins_1 = require("../../modules/plugins");
var stable_inject_1 = require("./helpers/stable-inject");
var merge_options_1 = require("../../helpers/merge-options");
var state_2 = require("./helpers/state");
var transform_code_1 = require("./helpers/transform-code");
Error.stackTraceLimit = 9999;
var DEBUG = false;
var PLUGINS = [
    function () { return ({
        json: {
            post: function (json) {
                (0, add_prevent_default_1.addPreventDefault)(json);
                return json;
            },
        },
    }); },
];
var DEFAULT_OPTIONS = {
    plugins: PLUGINS,
};
var componentToQwik = function (userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return function (_a) {
        var _b, _c, _d, _e;
        var _component = _a.component, path = _a.path;
        // Make a copy we can safely mutate, similar to babel's toolchain
        var component = (0, fast_clone_1.fastClone)(_component);
        var options = (0, merge_options_1.mergeOptions)(DEFAULT_OPTIONS, userOptions);
        component = (0, plugins_1.runPreJsonPlugins)(component, options.plugins);
        component = (0, plugins_1.runPostJsonPlugins)(component, options.plugins);
        var isTypeScript = !!options.typescript;
        var file = new src_generator_1.File(component.name + (isTypeScript ? '.ts' : '.js'), {
            isPretty: true,
            isJSX: true,
            isTypeScript: isTypeScript,
            isModule: true,
            isBuilder: false,
        }, '@builder.io/qwik', '');
        try {
            emitImports(file, component);
            emitTypes(file, component);
            emitExports(file, component);
            var metadata = component.meta.useMetadata || {};
            var isLightComponent = ((_c = (_b = metadata === null || metadata === void 0 ? void 0 : metadata.qwik) === null || _b === void 0 ? void 0 : _b.component) === null || _c === void 0 ? void 0 : _c.isLight) || false;
            var mutable_1 = ((_d = metadata === null || metadata === void 0 ? void 0 : metadata.qwik) === null || _d === void 0 ? void 0 : _d.mutable) || [];
            var imports_1 = ((_e = metadata === null || metadata === void 0 ? void 0 : metadata.qwik) === null || _e === void 0 ? void 0 : _e.imports) || {};
            Object.keys(imports_1).forEach(function (key) { return file.import(imports_1[key], key); });
            var state_3 = (0, state_2.emitStateMethodsAndRewriteBindings)(file, component, metadata);
            var hasState_1 = (0, state_1.checkHasState)(component);
            var css_1 = null;
            var componentFn = (0, src_generator_1.arrowFnBlock)(['props'], [
                function () {
                    var _a, _b;
                    css_1 = emitUseStyles(file, component);
                    emitUseContext(file, component);
                    emitUseRef(file, component);
                    hasState_1 && (0, state_2.emitUseStore)(file, state_3);
                    emitUseContextProvider(file, component);
                    emitUseClientEffect(file, component);
                    emitUseMount(file, component);
                    emitUseTask(file, component);
                    emitUseCleanup(file, component);
                    emitTagNameHack(file, component, (_a = component.meta.useMetadata) === null || _a === void 0 ? void 0 : _a.elementTag);
                    emitTagNameHack(file, component, (_b = component.meta.useMetadata) === null || _b === void 0 ? void 0 : _b.componentElementTag);
                    emitJSX(file, component, mutable_1);
                },
            ], [(component.propsTypeRef || 'any') + (isLightComponent ? '&{key?:any}' : '')]);
            file.src.const(component.name, isLightComponent
                ? componentFn
                : (0, src_generator_1.invoke)(file.import(file.qwikModule, 'component$'), [componentFn]), true, true);
            file.exportDefault(component.name);
            emitStyles(file, css_1);
            DEBUG && file.exportConst('COMPONENT', JSON.stringify(component));
            var sourceFile = file.toString();
            sourceFile = (0, plugins_1.runPreCodePlugins)(sourceFile, options.plugins);
            sourceFile = (0, plugins_1.runPostCodePlugins)(sourceFile, options.plugins);
            return sourceFile;
        }
        catch (e) {
            console.error(e);
            return e.stack || String(e);
        }
    };
};
exports.componentToQwik = componentToQwik;
function emitExports(file, component) {
    Object.keys(component.exports || {}).forEach(function (key) {
        var exportObj = component.exports[key];
        var code = exportObj.code.startsWith('export ') ? exportObj.code : "export ".concat(exportObj.code);
        file.src.emit(code);
    });
}
function emitTagNameHack(file, component, metadataValue) {
    if (typeof metadataValue === 'string' && metadataValue) {
        file.src.emit(metadataValue, '=', (0, convert_method_to_function_1.convertMethodToFunction)(metadataValue, (0, state_2.getStateMethodsAndGetters)(component.state), (0, state_2.getLexicalScopeVars)(component)), ';');
    }
}
function emitUseClientEffect(file, component) {
    if (component.hooks.onMount) {
        // This is called useMount, but in practice it is used as
        // useClientEffect. Not sure if this is correct, but for now.
        var code = component.hooks.onMount.code;
        file.src.emit(file.import(file.qwikModule, 'useClientEffect$').localName, '(()=>{', code, '});');
    }
}
function emitUseMount(file, component) {
    if (component.hooks.onInit) {
        var code = component.hooks.onInit.code;
        file.src.emit(file.import(file.qwikModule, 'useMount$').localName, '(()=>{', code, '});');
    }
}
function emitUseTask(file, component) {
    if (component.hooks.onUpdate) {
        component.hooks.onUpdate.forEach(function (onUpdate) {
            file.src.emit(file.import(file.qwikModule, 'useTask$').localName, '(({track})=>{');
            emitTrackExpressions(file.src, onUpdate.deps);
            file.src.emit((0, transform_code_1.convertTypeScriptToJS)(onUpdate.code));
            file.src.emit('});');
        });
    }
}
function emitTrackExpressions(src, deps) {
    if (!deps) {
        return;
    }
    var dependencies = deps.substring(1, deps.length - 1).split(',');
    dependencies.forEach(function (dep) {
        src.emit("track(() => ".concat(dep, ");"));
    });
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
    if (file.options.isPretty) {
        file.src.emit('\n\n');
    }
    file.src.emit('return ', (0, jsx_1.renderJSXNodes)(file, directives, handlers, component.children, styles, parentSymbolBindings));
}
function emitUseContextProvider(file, component) {
    Object.entries(component.context.set).forEach(function (_a) {
        var _ctxKey = _a[0], context = _a[1];
        file.src.emit("\n      ".concat(file.import(file.qwikModule, 'useContextProvider').localName, "(\n        ").concat(context.name, ", ").concat(file.import(file.qwikModule, 'useStore').localName, "({\n      "));
        for (var _i = 0, _b = Object.entries(context.value || {}); _i < _b.length; _i++) {
            var _c = _b[_i], prop = _c[0], propValue = _c[1];
            file.src.emit("".concat(prop, ": "));
            switch (propValue === null || propValue === void 0 ? void 0 : propValue.type) {
                case 'getter':
                    file.src.emit("(()=>{\n            ".concat(extractGetterBody(propValue.code), "\n          })()"));
                    break;
                case 'function':
                case 'method':
                    throw new Error('Qwik: Functions are not supported in context');
                case 'property':
                    file.src.emit((0, stable_inject_1.stableInject)(propValue.code));
                    break;
            }
            file.src.emit(',');
        }
        file.src.emit('}));');
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
        if (file.options.isPretty) {
            file.src.emit('\n\n');
        }
    }
    return css;
}
function emitStyles(file, css) {
    if (!css) {
        return;
    }
    if (file.options.isPretty) {
        file.src.emit('\n\n');
        try {
            css = (0, standalone_1.format)(css, {
                parser: 'css',
                plugins: [
                    // To support running in browsers
                    require('prettier/parser-postcss'),
                ],
            });
        }
        catch (e) {
            throw new Error(e +
                '\n' +
                '========================================================================\n' +
                css +
                '\n\n========================================================================');
        }
    }
    file.exportConst('STYLES', '`\n' + css.replace(/`/g, '\\`') + '`\n');
}
function emitTypes(file, component) {
    var _a;
    if (file.options.isTypeScript) {
        (_a = component.types) === null || _a === void 0 ? void 0 : _a.forEach(function (t) { return file.src.emit(t, '\n'); });
    }
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
function extractGetterBody(code) {
    var start = code.indexOf('{');
    var end = code.lastIndexOf('}');
    return code.substring(start + 1, end).trim();
}
