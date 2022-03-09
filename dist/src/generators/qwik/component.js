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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommonStyles = exports.renderUseLexicalScope = exports.renderStateConst = exports.addComponent = exports.createFileSet = void 0;
var compile_away_builder_components_1 = require("../../plugins/compile-away-builder-components");
var minify_1 = require("../minify");
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
    fileSet.med.exportConst('__merge', (0, minify_1.minify)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), __merge));
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
            var symbolName_1 = componentName + '_styles';
            getCommonStyles(fileSet).symbolName = symbolName_1;
            useStyles = generateStyles(componentFile, onRenderFile, symbolName_1, false);
        }
    }
    else {
        if (styles.size) {
            var symbolName_2 = componentName + '_styles';
            onRenderFile.exportConst(symbolName_2, (0, styles_1.renderStyles)(styles));
            useStyles = generateStyles(componentFile, onRenderFile, symbolName_2, true);
        }
    }
    addComponentOnMount(componentFile, onRenderFile, componentName, component, useStyles);
    componentFile.exportConst(componentName, (0, src_generator_1.invoke)(componentFile.import(componentFile.qwikModule, 'component'), [generateQrl(componentFile, componentName + '_onMount')], ['any', 'any']));
    onRenderFile.src.emit(src_generator_1.NL);
    var directives = new Map();
    onRenderFile.exportConst(componentName + '_onRender', (0, src_generator_1.arrowFnBlock)([], [
        renderUseLexicalScope(onRenderFile),
        function () {
            return this.emit('return ', (0, jsx_1.renderJSXNodes)(onRenderFile, directives, handlers, component.children, styles, {}), ';');
        },
    ]));
    directives.forEach(function (code, name) {
        fileSet.med.import(fileSet.med.qwikModule, 'h');
        fileSet.med.exportConst(name, code);
    });
}
exports.addComponent = addComponent;
function generateStyles(componentFile, styleFile, symbol, scoped) {
    return function () {
        this.emit((0, src_generator_1.invoke)(componentFile.import(componentFile.qwikModule, scoped ? 'withScopedStyles' : 'useStyles'), [generateQrl(styleFile, symbol)]));
    };
}
function renderStateConst(file, isMount) {
    if (isMount === void 0) { isMount = false; }
    return function () {
        return this.emit('const state', src_generator_1.WS, '=', src_generator_1.WS, file.module == 'med'
            ? file.exports.get('__merge')
            : file.import('./med.js', '__merge').name, '(__state__,', src_generator_1.WS, '__props__', isMount ? ',true);' : ');', src_generator_1.NL);
    };
}
exports.renderStateConst = renderStateConst;
function renderUseLexicalScope(file) {
    return function () {
        return this.emit('const __scope__', src_generator_1.WS, '=', src_generator_1.WS, file.import(file.qwikModule, 'useLexicalScope').name, '();', src_generator_1.NL, 'const __props__', src_generator_1.WS, '=', src_generator_1.WS, '__scope__[0];', src_generator_1.NL, 'const __state__', src_generator_1.WS, '=', src_generator_1.WS, '__scope__[1];', src_generator_1.NL, renderStateConst(file, false));
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
function addComponentOnMount(componentFile, onRenderFile, componentName, component, useStyles) {
    componentFile.exportConst(componentName + '_onMount', function () {
        var _this = this;
        this.emit((0, src_generator_1.arrowFnValue)(['__props__'], function () {
            var _a;
            return _this.emit('{', src_generator_1.NL, src_generator_1.INDENT, 'const __state__', src_generator_1.WS, '=', src_generator_1.WS, componentFile.import(componentFile.qwikModule, 'createStore').name, '({});', src_generator_1.NL, renderStateConst(componentFile, true), (0, src_generator_1.iif)((_a = component.hooks.onMount) === null || _a === void 0 ? void 0 : _a.code), ';', useStyles, src_generator_1.NL, 'return ', generateQrl(onRenderFile, componentName + '_onRender', [
                '__props__',
                '__state__',
            ]), ';', src_generator_1.UNINDENT, src_generator_1.NL, '}');
        }));
    });
}
function __merge(state, props, create) {
    if (create === void 0) { create = false; }
    for (var key in props) {
        if (key.indexOf(':') == -1 &&
            !key.startsWith('__') &&
            Object.prototype.hasOwnProperty.call(props, key)) {
            state[key] = props[key];
        }
    }
    if (create && typeof __STATE__ == 'object' && props.serverStateId) {
        Object.assign(state, __STATE__[props.serverStateId]);
    }
    return state;
}
function generateQrl(componentFile, componentName, capture) {
    if (capture === void 0) { capture = []; }
    return (0, src_generator_1.invoke)(componentFile.import(componentFile.qwikModule, 'qrl'), [
        componentFile.toQrlChunk(),
        (0, src_generator_1.quote)(componentName),
        "[".concat(capture.join(','), "]"),
    ]);
}
var templateObject_1;
