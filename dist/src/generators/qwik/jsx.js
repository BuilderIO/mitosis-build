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
 * @param key Key to be used for the node if needed
 * @param parentSymbolBindings A set of bindings from parent to be written into the child.
 * @param root True if this is the root JSX, and may need a Fragment wrapper.
 * @returns
 */
function renderJSXNodes(file, directives, handlers, children, styles, key, parentSymbolBindings, root) {
    if (root === void 0) { root = true; }
    return function () {
        var _this = this;
        var srcBuilder = this;
        if (children.length == 0)
            return;
        if (root)
            this.emit('(');
        var needsFragment = root &&
            (children.length > 1 ||
                (children.length && (isInlinedDirective(children[0]) || isTextNode(children[0]))));
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
                var text = child.properties._text;
                var textExpr = (_a = child.bindings._text) === null || _a === void 0 ? void 0 : _a.code;
                if (typeof text == 'string') {
                    _this.isJSX ? _this.emit(text) : _this.jsxTextBinding((0, src_generator_1.quote)(text));
                }
                else if (typeof textExpr == 'string') {
                    _this.isJSX ? _this.emit('{', textExpr, '}') : _this.jsxTextBinding(textExpr);
                }
            }
            else if (isSlotProjection(child)) {
                _this.file.import(_this.file.qwikModule, 'Slot');
                _this.jsxBegin('Slot', {}, {});
                _this.jsxEnd('Slot');
            }
            else {
                var childName = child.name;
                var directive = directives_1.DIRECTIVES[childName];
                if (typeof directive == 'function') {
                    var blockFn_1 = mitosisNodeToRenderBlock(child.children);
                    var meta_1 = child.meta;
                    Object.keys(meta_1).forEach(function (key) {
                        var value = meta_1[key];
                        if ((0, is_mitosis_node_1.isMitosisNode)(value)) {
                            blockFn_1[key] = mitosisNodeToRenderBlock([value]);
                        }
                    });
                    _this.emit(directive(child, blockFn_1));
                    !_this.isJSX && _this.emit(',');
                    includedHelperDirectives(directive.toString(), directives);
                }
                else {
                    if (typeof directive == 'string') {
                        directives.set(childName, directive);
                        includedHelperDirectives(directive, directives);
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
                    key = props['builder-id'] || key;
                    if (props.innerHTML) {
                        // Special case. innerHTML requires `key` in Qwik
                        props = __assign({ key: key || 'default' }, props);
                    }
                    var symbolBindings = {};
                    var bindings = rewriteHandlers(file, handlers, child.bindings, symbolBindings);
                    _this.jsxBegin(childName, props, __assign(__assign(__assign({}, bindings), parentSymbolBindings), specialBindings));
                    renderJSXNodes(file, directives, handlers, child.children, styles, key, symbolBindings, false).call(_this);
                    _this.jsxEnd(childName);
                }
            }
        });
        if (needsFragment) {
            this.jsxEndFragment();
        }
        if (root)
            this.emit(')');
        function mitosisNodeToRenderBlock(children) {
            return function () {
                children = children.filter(function (c) { return !isEmptyTextNode(c); });
                var childNeedsFragment = children.length > 1 || (children.length && isTextNode(children[0]));
                childNeedsFragment && srcBuilder.jsxBeginFragment(fragmentSymbol);
                renderJSXNodes(file, directives, handlers, children, styles, null, {}, false).call(srcBuilder);
                childNeedsFragment && srcBuilder.jsxEndFragment();
            };
        }
    };
}
exports.renderJSXNodes = renderJSXNodes;
function includedHelperDirectives(directive, directives) {
    Array.from(directive.matchAll(/(__[\w]+__)/g)).forEach(function (match) {
        var name = match[0];
        var code = directives_1.DIRECTIVES[name];
        typeof code == 'string' && directives.set(name, code);
    });
}
function isSymbol(name) {
    return (name.charAt(0) === name.charAt(0).toUpperCase() &&
        // we want to exclude any property access, as that can't be a symbol
        !name.includes('.'));
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
    if (child.properties._text !== undefined) {
        return true;
    }
    var code = (_a = child.bindings._text) === null || _a === void 0 ? void 0 : _a.code;
    if (code !== undefined && code !== 'props.children') {
        return true;
    }
    return false;
}
function isSlotProjection(child) {
    var _a;
    return ((_a = child.bindings._text) === null || _a === void 0 ? void 0 : _a.code) === 'props.children';
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
    var outBindings = {};
    for (var key in bindings) {
        if (Object.prototype.hasOwnProperty.call(bindings, key)) {
            var bindingValue = bindings[key];
            var bindingExpr = bindingValue.code;
            var handlerBlock = handlers.get(bindingExpr);
            if (key == 'css') {
                continue;
            }
            else if (handlerBlock) {
                key = "".concat(key, "$");
                bindingExpr = (0, src_generator_1.invoke)(file.import(file.qwikModule, 'qrl'), [
                    (0, src_generator_1.quote)(file.qrlPrefix + 'high.js'),
                    (0, src_generator_1.quote)(handlerBlock),
                    file.options.isBuilder ? '[s,l]' : '[state]',
                ]);
            }
            else if (symbolBindings && key.startsWith('symbol.data.')) {
                symbolBindings[(0, src_generator_1.lastProperty)(key)] = bindingExpr;
            }
            else if (key.startsWith('component.options.')) {
                key = (0, src_generator_1.lastProperty)(key);
            }
            outBindings[key] = __assign(__assign({}, bindingValue), { code: bindingExpr });
        }
    }
    return outBindings;
}
function isInlinedDirective(node) {
    return ((0, is_mitosis_node_1.isMitosisNode)(node) && node.name == 'Show') || node.name == 'For';
}
