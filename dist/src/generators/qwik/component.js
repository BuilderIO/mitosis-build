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
var handlers_1 = require("./handlers");
var jsx_1 = require("./jsx");
var src_generator_1 = require("./src-generator");
var styles_1 = require("./styles");
function createFileSet(options) {
    if (options === void 0) { options = {}; }
    var opts = __assign({ qwikLib: '@builder.io/qwik', qrlPrefix: './', output: 'ts', minify: false, jsx: true }, options);
    var extension = (opts.output == 'mjs' ? 'js' : opts.output) + (opts.jsx ? 'x' : '');
    var srcOptions = {
        isPretty: !opts.minify,
        isModule: opts.output != 'cjs',
        isTypeScript: opts.output == 'ts',
        isJSX: opts.jsx,
    };
    var fileSet = {
        high: new src_generator_1.File('high.' + extension, srcOptions, opts.qwikLib, opts.qrlPrefix),
        med: new src_generator_1.File('med.' + extension, srcOptions, opts.qwikLib, opts.qrlPrefix),
        low: new src_generator_1.File('low.' + extension, srcOptions, opts.qwikLib, opts.qrlPrefix),
    };
    Object.defineProperty(fileSet, '_commonStyles', {
        enumerable: false,
        value: { styles: new Map(), symbolName: null },
    });
    return fileSet;
}
exports.createFileSet = createFileSet;
function getCommonStyles(fileSet) {
    return fileSet['_commonStyles'];
}
function addComponent(fileSet, component, opts) {
    if (opts === void 0) { opts = {}; }
    var _opts = __assign({ isRoot: false, shareStyles: false }, opts);
    (0, compile_away_builder_components_1.compileAwayBuilderComponentsFromTree)(component, __assign(__assign({}, compile_away_builder_components_1.components), { Image: undefined, CoreButton: undefined }));
    var componentName = component.name;
    var handlers = (0, handlers_1.renderHandlers)(fileSet.high, componentName, component.children);
    // If the component has no handlers, than it is probably static
    // and so it is unlikely to be re-rendered on the client, therefore
    // put it in a low priority bucket.
    var isStatic = Array.from(handlers.keys()).reduce(function (p, v) { return p && v.indexOf('state') == -1; }, true);
    var onRenderFile = isStatic ? fileSet.low : fileSet.med;
    var componentFile = fileSet.med;
    var styles = _opts.shareStyles
        ? getCommonStyles(fileSet).styles
        : new Map();
    (0, styles_1.collectStyles)(component.children, styles);
    var useStyles = function () { return null; };
    if (_opts.shareStyles) {
        if (_opts.isRoot) {
            var symbolName = componentName + '_styles';
            getCommonStyles(fileSet).symbolName = symbolName;
            useStyles = generateStyles(onRenderFile, fileSet.low, symbolName, false);
        }
    }
    else {
        if (styles.size) {
            var symbolName = componentName + '_styles';
            onRenderFile.exportConst(symbolName, (0, styles_1.renderStyles)(styles));
            useStyles = generateStyles(onRenderFile, onRenderFile, symbolName, true);
        }
    }
    var directives = new Map();
    addComponentOnMount(onRenderFile, function () {
        return this.emit('return ', (0, jsx_1.renderJSXNodes)(onRenderFile, directives, handlers, component.children, styles, {}), ';');
    }, componentName, component, useStyles);
    componentFile.exportConst(componentName, (0, src_generator_1.invoke)(componentFile.import(componentFile.qwikModule, 'componentQrl'), [generateQrl(componentFile, onRenderFile, componentName + '_onMount')], ['any', 'any']));
    directives.forEach(function (code, name) {
        fileSet.med.import(fileSet.med.qwikModule, 'h');
        fileSet.med.exportConst(name, code, true);
    });
}
exports.addComponent = addComponent;
function generateStyles(fromFile, dstFile, symbol, scoped) {
    return function () {
        this.emit((0, src_generator_1.invoke)(fromFile.import(fromFile.qwikModule, scoped ? 'withScopedStylesQrl' : 'useStylesQrl'), [generateQrl(fromFile, dstFile, symbol)]), ';');
    };
}
function renderUseLexicalScope(file) {
    return function () {
        return this.emit('const state=', file.import(file.qwikModule, 'useLexicalScope').name, '()[0]');
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
                inputInitializer.push('if(state.', input.name, '===undefined)state.', input.name, '=', JSON.stringify(input.defaultValue), ';');
        });
    }
    componentFile.exportConst(componentName + '_onMount', function () {
        var _this = this;
        this.emit((0, src_generator_1.arrowFnValue)(['state'], function () {
            var _a;
            return _this.emit.apply(_this, __spreadArray(__spreadArray(['{'], inputInitializer, false), ['typeof __STATE__==="object"&&Object.assign(state,__STATE__[state.serverStateId]);',
                (0, src_generator_1.iif)((_a = component.hooks.onMount) === null || _a === void 0 ? void 0 : _a.code),
                ';',
                useStyles,
                onRenderEmit,
                ';}'], false));
        }));
    });
}
function generateQrl(fromFile, dstFile, componentName, capture) {
    if (capture === void 0) { capture = []; }
    return (0, src_generator_1.invoke)(fromFile.import(fromFile.qwikModule, 'qrl'), [
        dstFile.toQrlChunk(),
        (0, src_generator_1.quote)(componentName),
        "[".concat(capture.join(','), "]"),
    ]);
}
