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
exports.renderJSXNodes = void 0;
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var directives_1 = require("./directives");
var src_generator_1 = require("./src-generator");
/**
 * Convert a Mitosis nodes to a JSX nodes.
 *
 * @param file File into which the output will be written to.
 * @param directives Store for directives which we came across so that they can be imported.
 * @param handlers A set of handlers which we came across so that they can be rendered
 * @param children A list of children to convert to JSX
 * @param styles Store for styles which we came across so that they can be rendered.
 * @param parentSymbolBindings A set of bindings from parent to be written into the child.
 * @param root True if this is the root JSX, and may need a Fragment wrapper.
 * @returns
 */
function renderJSXNodes(file, directives, handlers, children, styles, parentSymbolBindings, root) {
    if (root === void 0) { root = true; }
    return function () {
        var _this = this;
        if (children.length == 0)
            return;
        if (root)
            this.emit('(');
        var needsFragment = root && (children.length > 1 || isInlinedDirective(children[0]));
        file.import(file.qwikModule, 'h');
        var fragmentSymbol = file.import(file.qwikModule, 'Fragment');
        if (needsFragment) {
            this.jsxBeginFragment(fragmentSymbol);
        }
        children.forEach(function (child) {
            var _a, _b;
            if (isEmptyTextNode(child))
                return;
            if (isTextNode(child)) {
                if (((_a = child.bindings._text) === null || _a === void 0 ? void 0 : _a.code) !== undefined) {
                    if (child.bindings._text.code == 'props.children') {
                        _this.file.import(_this.file.qwikModule, 'Slot');
                        _this.jsxBegin('Slot', {}, {});
                        _this.jsxEnd('Slot');
                    }
                    else {
                        _this.jsxTextBinding(child.bindings._text.code);
                    }
                }
                else {
                    _this.isJSX
                        ? _this.emit(child.properties._text)
                        : _this.jsxTextBinding((0, src_generator_1.quote)(child.properties._text));
                }
            }
            else {
                var childName = child.name;
                var directive = directives_1.DIRECTIVES[childName];
                if (typeof directive == 'function') {
                    _this.emit(directive(child, function () {
                        var children = child.children.filter(function (c) { return !isEmptyTextNode(c); });
                        var needsFragment = children.length > 1 || (children.length === 1 && isTextNode(children[0]));
                        needsFragment && _this.jsxBeginFragment(fragmentSymbol);
                        renderJSXNodes(file, directives, handlers, children, styles, {}, false).call(_this);
                        needsFragment && _this.jsxEndFragment();
                    }));
                    !_this.isJSX && _this.emit(',');
                }
                else {
                    if (typeof directive == 'string') {
                        directives.set(childName, directive);
                        Array.from(directive.matchAll(/(__[^_]+__)/g)).forEach(function (match) {
                            var name = match[0];
                            var code = directives_1.DIRECTIVES[name];
                            typeof code == 'string' && directives.set(name, code);
                        });
                        if (file.module !== 'med' && file.imports.hasImport(childName)) {
                            file.import('./med.js', childName);
                        }
                    }
                    if (isSymbol(childName)) {
                        // TODO(misko): We are hard coding './med.js' which is not right.
                        !file.imports.hasImport(childName) && file.import('./med.js', childName);
                        var exportedChildName = file.exports.get(childName);
                        if (exportedChildName) {
                            childName = exportedChildName;
                        }
                    }
                    var props = child.properties;
                    var css = (_b = child.bindings.css) === null || _b === void 0 ? void 0 : _b.code;
                    var specialBindings = {};
                    if (css) {
                        props = __assign({}, props);
                        var styleProps = styles.get(css);
                        var imageMaxWidth = childName == 'Image' && styleProps.maxWidth;
                        if (imageMaxWidth && imageMaxWidth.endsWith('px')) {
                            // special case for Images. We want to make sure that we include the maxWidth in a srcset
                            specialBindings.srcsetSizes = Number.parseInt(imageMaxWidth);
                        }
                        if (styleProps === null || styleProps === void 0 ? void 0 : styleProps.CLASS_NAME) {
                            props.class = addClass(styleProps.CLASS_NAME, props.class);
                        }
                    }
                    var symbolBindings = {};
                    var bindings = rewriteHandlers(file, handlers, child.bindings, symbolBindings);
                    _this.jsxBegin(childName, props, __assign(__assign(__assign({}, bindings), parentSymbolBindings), specialBindings));
                    renderJSXNodes(file, directives, handlers, child.children, styles, symbolBindings, false).call(_this);
                    _this.jsxEnd(childName);
                }
            }
        });
        if (needsFragment) {
            this.jsxEndFragment();
        }
        if (root)
            this.emit(')');
    };
}
exports.renderJSXNodes = renderJSXNodes;
function isSymbol(name) {
    return name.charAt(0) == name.charAt(0).toUpperCase();
}
function addClass(className, existingClass) {
    return __spreadArray([className], (existingClass ? existingClass.split(' ') : []), true).join(' ');
}
function isEmptyTextNode(child) {
    var _a;
    return ((_a = child.properties._text) === null || _a === void 0 ? void 0 : _a.trim()) == '';
}
function isTextNode(child) {
    var _a;
    return child.properties._text !== undefined || ((_a = child.bindings._text) === null || _a === void 0 ? void 0 : _a.code) !== undefined;
}
/**
 * Rewrites bindings:
 * - Remove `css`
 * - Rewrites event handles
 * - Extracts symbol bindings.
 *
 * @param file
 * @param handlers
 * @param bindings
 * @param symbolBindings Options record which will receive the symbol bindings
 * @returns
 */
function rewriteHandlers(file, handlers, bindings, symbolBindings) {
    var _a;
    var outBindings = {};
    for (var key in bindings) {
        if (Object.prototype.hasOwnProperty.call(bindings, key)) {
            var bindingExpr = (_a = bindings === null || bindings === void 0 ? void 0 : bindings[key]) === null || _a === void 0 ? void 0 : _a.code;
            var handlerBlock = void 0;
            if (bindingExpr != null) {
                if (key == 'css') {
                    continue;
                }
                else if ((handlerBlock = handlers.get(bindingExpr))) {
                    key = "".concat(key, "$");
                    bindingExpr = (0, src_generator_1.invoke)(file.import(file.qwikModule, 'qrl'), [
                        (0, src_generator_1.quote)(file.qrlPrefix + 'high.js'),
                        (0, src_generator_1.quote)(handlerBlock),
                        '[state]',
                    ]);
                }
                else if (symbolBindings && key.startsWith('symbol.data.')) {
                    symbolBindings[(0, src_generator_1.lastProperty)(key)] = bindingExpr;
                }
                else if (key.startsWith('component.options.')) {
                    key = (0, src_generator_1.lastProperty)(key);
                }
                outBindings[key] = { code: bindingExpr };
            }
        }
    }
    return outBindings;
}
function isInlinedDirective(node) {
    return ((0, is_mitosis_node_1.isMitosisNode)(node) && node.name == 'Show') || node.name == 'For';
}
