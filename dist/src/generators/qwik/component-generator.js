"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentToQwik = void 0;
var standalone_1 = require("prettier/standalone");
var babel_transform_1 = require("../../helpers/babel-transform");
var fast_clone_1 = require("../../helpers/fast-clone");
var merge_options_1 = require("../../helpers/merge-options");
var process_code_1 = require("../../helpers/plugins/process-code");
var render_imports_1 = require("../../helpers/render-imports");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var state_1 = require("../../helpers/state");
var collect_css_1 = require("../../helpers/styles/collect-css");
var plugins_1 = require("../../modules/plugins");
var add_prevent_default_1 = require("./helpers/add-prevent-default");
var stable_inject_1 = require("./helpers/stable-inject");
var state_2 = require("./helpers/state");
var jsx_1 = require("./jsx");
var src_generator_1 = require("./src-generator");
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
    (0, process_code_1.CODE_PROCESSOR_PLUGIN)(function (codeType, json) {
        switch (codeType) {
            case 'types':
                return function (c) { return c; };
            case 'bindings':
            case 'state':
            case 'context-set':
            case 'hooks':
            case 'hooks-deps':
            case 'properties':
            case 'dynamic-jsx-elements':
                // update signal getters to have `.value`
                return function (code, k) {
                    // `ref` should not update the signal value access
                    if (k === 'ref') {
                        return code;
                    }
                    Object.keys(json.refs).forEach(function (ref) {
                        code = (0, replace_identifiers_1.replaceIdentifiers)({
                            code: code,
                            from: ref,
                            to: function (x) { return (x === ref ? "".concat(x, ".value") : "".concat(ref, ".value.").concat(x)); },
                        });
                    });
                    // update signal getters to have `.value`
                    return (0, replace_identifiers_1.replaceStateIdentifier)(function (name) {
                        var state = json.state[name];
                        switch (state === null || state === void 0 ? void 0 : state.type) {
                            case 'getter':
                                return "".concat(name, ".value");
                            case 'function':
                            case 'method':
                            case 'property':
                            case undefined:
                                return "state.".concat(name);
                        }
                    })(code);
                };
        }
    }),
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
        var options = (0, merge_options_1.initializeOptions)({
            target: 'qwik',
            component: component,
            defaults: DEFAULT_OPTIONS,
            userOptions: userOptions,
        });
        component = (0, plugins_1.runPreJsonPlugins)({ json: component, plugins: options.plugins });
        component = (0, plugins_1.runPostJsonPlugins)({ json: component, plugins: options.plugins });
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
            var metadata_1 = component.meta.useMetadata;
            var isLightComponent = ((_c = (_b = metadata_1 === null || metadata_1 === void 0 ? void 0 : metadata_1.qwik) === null || _b === void 0 ? void 0 : _b.component) === null || _c === void 0 ? void 0 : _c.isLight) || false;
            var mutable_1 = ((_d = metadata_1 === null || metadata_1 === void 0 ? void 0 : metadata_1.qwik) === null || _d === void 0 ? void 0 : _d.mutable) || [];
            var imports_1 = ((_e = metadata_1 === null || metadata_1 === void 0 ? void 0 : metadata_1.qwik) === null || _e === void 0 ? void 0 : _e.imports) || {};
            Object.keys(imports_1).forEach(function (key) { return file.import(imports_1[key], key); });
            var state_3 = (0, state_2.emitStateMethodsAndRewriteBindings)(file, component, metadata_1);
            var hasState_1 = (0, state_1.checkHasState)(component);
            var css_1 = null;
            var emitStore_1 = function () { var _a; return hasState_1 && (0, state_2.emitUseStore)({ file: file, stateInit: state_3, isDeep: (_a = metadata_1 === null || metadata_1 === void 0 ? void 0 : metadata_1.qwik) === null || _a === void 0 ? void 0 : _a.hasDeepStore }); };
            var componentFn = (0, src_generator_1.arrowFnBlock)(['props'], [
                function () {
                    var _a, _b;
                    if ((_a = metadata_1 === null || metadata_1 === void 0 ? void 0 : metadata_1.qwik) === null || _a === void 0 ? void 0 : _a.setUseStoreFirst)
                        emitStore_1();
                    css_1 = emitUseStyles(file, component);
                    emitUseComputed(file, component);
                    emitUseContext(file, component);
                    emitUseRef(file, component);
                    if (!((_b = metadata_1 === null || metadata_1 === void 0 ? void 0 : metadata_1.qwik) === null || _b === void 0 ? void 0 : _b.setUseStoreFirst))
                        emitStore_1();
                    emitUseContextProvider(file, component);
                    emitUseClientEffect(file, component);
                    emitUseMount(file, component);
                    emitUseTask(file, component);
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
            sourceFile = (0, plugins_1.runPreCodePlugins)({
                json: component,
                code: sourceFile,
                plugins: options.plugins,
            });
            sourceFile = (0, plugins_1.runPostCodePlugins)({
                json: component,
                code: sourceFile,
                plugins: options.plugins,
            });
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
function emitUseClientEffect(file, component) {
    if (component.hooks.onMount) {
        // This is called useMount, but in practice it is used as
        // useClientEffect. Not sure if this is correct, but for now.
        var code = component.hooks.onMount.code;
        file.src.emit(file.import(file.qwikModule, 'useVisibleTask$').localName, '(()=>{', code, '});');
    }
}
function emitUseMount(file, component) {
    if (component.hooks.onInit) {
        var code = component.hooks.onInit.code;
        file.src.emit(file.import(file.qwikModule, 'useTask$').localName, '(()=>{', code, '});');
    }
}
function emitUseTask(file, component) {
    if (component.hooks.onUpdate) {
        component.hooks.onUpdate.forEach(function (onUpdate) {
            file.src.emit(file.import(file.qwikModule, 'useTask$').localName, '(({track})=>{');
            emitTrackExpressions(file.src, onUpdate.deps);
            file.src.emit((0, babel_transform_1.convertTypeScriptToJS)(onUpdate.code));
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
function emitJSX(file, component, mutable) {
    var directives = new Map();
    var handlers = new Map();
    var styles = new Map();
    var parentSymbolBindings = {};
    if (file.options.isPretty) {
        file.src.emit('\n\n');
    }
    file.src.emit('return ', (0, jsx_1.renderJSXNodes)(file, directives, handlers, component.children, styles, null, parentSymbolBindings));
}
function emitUseContextProvider(file, component) {
    Object.entries(component.context.set).forEach(function (_a) {
        var _ctxKey = _a[0], context = _a[1];
        file.src.emit("".concat(file.import(file.qwikModule, 'useContextProvider').localName, "(").concat(context.name, ", "));
        if (context.ref) {
            file.src.emit("".concat(context.ref));
        }
        else {
            file.src.emit("".concat(file.import(file.qwikModule, 'useStore').localName, "({"));
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
            file.src.emit('})');
        }
        file.src.emit(');');
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
        file.src.emit("const ", refKey, '=', file.import(file.qwikModule, 'useSignal').localName, "".concat(file.options.isTypeScript ? '<Element>' : '', "();"));
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
        var importPath = (0, render_imports_1.transformImportPath)({
            target: 'qwik',
            theImport: i,
            preserveFileExtensions: false,
        });
        Object.keys(i.imports).forEach(function (key) {
            var keyValue = i.imports[key];
            file.import(importPath, keyValue, key);
        });
    });
}
function extractGetterBody(code) {
    var start = code.indexOf('{');
    var end = code.lastIndexOf('}');
    return code.substring(start + 1, end).trim();
}
function emitUseComputed(file, component) {
    for (var _i = 0, _a = Object.entries(component.state); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], stateValue = _b[1];
        switch (stateValue === null || stateValue === void 0 ? void 0 : stateValue.type) {
            case 'getter':
                file.src.const("\n          ".concat(key, " = ").concat(file.import(file.qwikModule, 'useComputed$').localName, "(() => {\n            ").concat(extractGetterBody(stateValue.code), "\n          })\n        "));
                continue;
        }
    }
}
