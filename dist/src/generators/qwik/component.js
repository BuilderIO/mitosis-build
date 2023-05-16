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
exports.addCommonStyles = exports.renderUseLexicalScope = exports.addComponent = exports.createFileSet = void 0;
var compile_away_builder_components_1 = require("../../plugins/compile-away-builder-components");
var directives_1 = require("./directives");
var handlers_1 = require("./helpers/handlers");
var stable_serialize_1 = require("./helpers/stable-serialize");
var styles_1 = require("./helpers/styles");
var jsx_1 = require("./jsx");
var src_generator_1 = require("./src-generator");
function createFileSet(options) {
    if (options === void 0) { options = {}; }
    var opts = __assign({ qwikLib: '@builder.io/qwik', qrlPrefix: './', output: 'ts', minify: false, jsx: true }, options);
    var extension = (opts.output == 'mjs' ? 'js' : opts.output) + (opts.jsx ? 'x' : '');
    var srcOptions = {
        isPretty: !opts.minify,
        isModule: opts.output != 'cjs',
        isTypeScript: opts.output == 'ts',
        isJSX: opts.jsx,
        isBuilder: true,
    };
    var fileSet = {
        high: new src_generator_1.File('high.' + extension, srcOptions, opts.qwikLib, opts.qrlPrefix),
        med: new src_generator_1.File('med.' + extension, srcOptions, opts.qwikLib, opts.qrlPrefix),
        low: new src_generator_1.File('low.' + extension, srcOptions, opts.qwikLib, opts.qrlPrefix),
    };
    Object.defineProperty(fileSet, 'CommonStyles', {
        enumerable: false,
        value: { styles: new Map(), symbolName: null },
    });
    return fileSet;
}
exports.createFileSet = createFileSet;
function getCommonStyles(fileSet) {
    return fileSet['CommonStyles'];
}
function addComponent(fileSet, component, opts) {
    if (opts === void 0) { opts = {}; }
    var _opts = __assign({ isRoot: false, shareStyles: false }, opts);
    (0, compile_away_builder_components_1.compileAwayBuilderComponentsFromTree)(component, __assign(__assign({}, compile_away_builder_components_1.components), { 
        // A set of components that should not be compiled away because they are implemented as runtime components.
        Image: undefined, CoreButton: undefined }));
    addBuilderBlockClass(component.children);
    var componentName = component.name;
    var handlers = (0, handlers_1.renderHandlers)(fileSet.high, componentName, component.children);
    // If the component has no handlers, than it is probably static
    // and so it is unlikely to be re-rendered on the client, therefore
    // put it in a low priority bucket.
    var isStatic = Array.from(handlers.keys()).reduce(function (p, v) { return p && v.indexOf('state') == -1; }, true);
    var onRenderFile = isStatic ? fileSet.low : fileSet.med;
    var componentFile = fileSet.med;
    var styles = _opts.shareStyles ? getCommonStyles(fileSet).styles : new Map();
    (0, styles_1.collectStyles)(component.children, styles);
    var useStyles = function () { return null; };
    if (styles.size) {
        if (_opts.shareStyles) {
            if (_opts.isRoot) {
                var symbolName = componentName + 'Styles';
                getCommonStyles(fileSet).symbolName = symbolName;
                useStyles = generateStyles(onRenderFile, fileSet.low, symbolName, false);
            }
        }
        else {
            var symbolName = componentName + 'Styles';
            onRenderFile.exportConst(symbolName, (0, styles_1.renderStyles)(styles));
            useStyles = generateStyles(onRenderFile, onRenderFile, symbolName, true);
        }
    }
    if (component.meta.cssCode) {
        var symbolName = componentName + 'UsrStyles';
        onRenderFile.exportConst(symbolName, (0, stable_serialize_1.stableJSONserialize)(component.meta.cssCode));
        useStyles = (function (fns) {
            return function () {
                var _this = this;
                fns.forEach(function (fn) { return fn.apply(_this); });
            };
        })([useStyles, generateStyles(onRenderFile, onRenderFile, symbolName, false)]);
    }
    var directives = new Map();
    var rootChildren = component.children;
    addComponentOnMount(onRenderFile, function () {
        return this.emit('return ', (0, jsx_1.renderJSXNodes)(onRenderFile, directives, handlers, rootChildren, styles, null, {}), ';');
    }, componentName, component, useStyles);
    componentFile.exportConst(componentName, (0, src_generator_1.invoke)(componentFile.import(componentFile.qwikModule, 'componentQrl'), [generateQrl(componentFile, onRenderFile, componentName + 'OnMount')], ['any', 'any']));
    directives.forEach(function (code, name) {
        fileSet.med.import(fileSet.med.qwikModule, 'h');
        fileSet.med.exportConst(name, code, true);
    });
    fileSet.low.exportConst('__proxyMerge__', directives_1.DIRECTIVES['__proxyMerge__'], true);
    fileSet.med.exportConst('__proxyMerge__', directives_1.DIRECTIVES['__proxyMerge__'], true);
    fileSet.high.exportConst('__proxyMerge__', directives_1.DIRECTIVES['__proxyMerge__'], true);
}
exports.addComponent = addComponent;
function generateStyles(fromFile, dstFile, symbol, scoped) {
    return function () {
        if (this.file.options.isPretty) {
            this.emit('\n\n');
        }
        this.emit((0, src_generator_1.invoke)(fromFile.import(fromFile.qwikModule, scoped ? 'useStylesScopedQrl' : 'useStylesQrl'), [
            generateQrl(fromFile, dstFile, symbol),
        ]), ';');
        if (this.file.options.isPretty) {
            this.emit('\n\n');
        }
    };
}
function addBuilderBlockClass(children) {
    children.forEach(function (child) {
        var props = child.properties;
        if (props['builder-id']) {
            props.class = (props.class ? props.class + ' ' : '') + 'builder-block';
        }
    });
}
function renderUseLexicalScope(file) {
    return function () {
        if (this.file.options.isBuilder) {
            return this.emit('const [s,l]=', file.import(file.qwikModule, 'useLexicalScope').localName, '();', 'const state=__proxyMerge__(s,l);');
        }
        else {
            return this.emit('const state=', file.import(file.qwikModule, 'useLexicalScope').localName, '()[0]');
        }
    };
}
exports.renderUseLexicalScope = renderUseLexicalScope;
function addCommonStyles(fileSet) {
    var _a = getCommonStyles(fileSet), styles = _a.styles, symbolName = _a.symbolName;
    var onRenderFile = fileSet.low;
    if (symbolName) {
        onRenderFile.exportConst(symbolName, (0, styles_1.renderStyles)(styles));
    }
}
exports.addCommonStyles = addCommonStyles;
function addComponentOnMount(componentFile, onRenderEmit, componentName, component, useStyles) {
    var inputInitializer = [];
    if (component.inputs) {
        component.inputs.forEach(function (input) {
            input.defaultValue !== undefined &&
                inputInitializer.push('if(!state.hasOwnProperty("', input.name, '"))state.', input.name, '=', (0, stable_serialize_1.stableJSONserialize)(input.defaultValue), ';');
        });
    }
    componentFile.exportConst(componentName + 'OnMount', function () {
        var _this = this;
        this.emit((0, src_generator_1.arrowFnValue)(['p'], function () {
            var _a;
            return _this.emit.apply(_this, __spreadArray(__spreadArray(['{',
                'const s=',
                componentFile.import(componentFile.qwikModule, 'useStore').localName,
                '(()=>{',
                'const state=Object.assign({},structuredClone(typeof __STATE__==="object"&&__STATE__[p.serverStateId]),p);'], inputInitializer, false), [inlineCode((_a = component.hooks.onMount) === null || _a === void 0 ? void 0 : _a.code),
                'return state;',
                '},{deep:true});',
                'const l={};',
                'const state=__proxyMerge__(s,l);',
                useStyles,
                onRenderEmit,
                ';}'], false));
        }));
    });
}
function inlineCode(code) {
    return function () {
        if (code) {
            // HACK: remove the return value as it is not the state we are creating.
            code = code
                .trim()
                .replace(/return main\(\);?$/, '')
                .trim();
            this.emit(code, ';');
        }
    };
}
function generateQrl(fromFile, dstFile, componentName, capture) {
    if (capture === void 0) { capture = []; }
    return (0, src_generator_1.invoke)(fromFile.import(fromFile.qwikModule, 'qrl'), [
        dstFile.toQrlChunk(),
        (0, src_generator_1.quote)(componentName),
        "[".concat(capture.join(','), "]"),
    ]);
}
