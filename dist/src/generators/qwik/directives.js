"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = exports.DIRECTIVES = void 0;
var for_1 = require("../../helpers/nodes/for");
var minify_1 = require("../minify");
var src_generator_1 = require("./src-generator");
exports.DIRECTIVES = {
    Show: function (node, blockFn) {
        return function () {
            var _this = this;
            var _a;
            var expr = (_a = node.bindings.when) === null || _a === void 0 ? void 0 : _a.code;
            var elseBlockFn = blockFn.else;
            this.jsxExpression(function () {
                _this.emit(expr, '?');
                blockFn();
                _this.emit(':');
                if (elseBlockFn) {
                    elseBlockFn();
                }
                else {
                    _this.emit('null');
                }
            });
        };
    },
    For: function (_node, blockFn) {
        return function () {
            var _this = this;
            var _a;
            var node = _node;
            var expr = (_a = node.bindings.each) === null || _a === void 0 ? void 0 : _a.code;
            this.jsxExpression(function () {
                var forArgs = (0, for_1.getForArguments)(node);
                var forName = forArgs[0];
                _this.emit('(', expr, '||[]).map(');
                _this.isBuilder && _this.emit('((');
                _this.emit('(', forArgs, ') => {');
                if (_this.isBuilder) {
                    _this.emit('const l={...this,', (0, src_generator_1.iteratorProperty)(expr), ':', forName, '==null?{}:', forName, ',', function () {
                        return forArgs.forEach(function (arg) {
                            _this.emit(arg, ':', arg, ',');
                        });
                    }, '};');
                    _this.emit('const state = __proxyMerge__(s,l);');
                }
                _this.emit('return(');
                blockFn();
                _this.emit(');}');
                _this.isBuilder && _this.emit(').bind(l))');
                _this.emit(')');
            });
        };
    },
    Image: (0, minify_1.minify)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), Image),
    CoreButton: (0, minify_1.minify)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", ""], ["", ""])), CoreButton),
    __passThroughProps__: (0, minify_1.minify)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["", ""], ["", ""])), __passThroughProps__),
    __proxyMerge__: (0, minify_1.minify)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["", ""], ["", ""])), __proxyMerge__),
};
function Image(props) {
    var _a;
    var jsx = props.children || [];
    var image = props.image;
    if (image) {
        var isBuilderIoImage = !!(image || '').match(/\.builder\.io/) && !props.noWebp;
        var isPixel = (_a = props.builderBlock) === null || _a === void 0 ? void 0 : _a.id.startsWith('builder-pixel-');
        var imgProps = {
            src: props.image,
            style: "object-fit:".concat(props.backgroundSize || 'cover', ";object-position:").concat(props.backgroundPosition || 'center', ";") + (props.aspectRatio ? 'position:absolute;height:100%;width:100%;top:0;left:0' : ''),
            sizes: props.sizes,
            alt: props.altText,
            role: !props.altText ? 'presentation' : undefined,
            loading: isPixel ? 'eager' : 'lazy',
            srcset: undefined,
        };
        var qwikBugWorkaround = function (imgProps) {
            return Object.keys(imgProps).forEach(function (k) { return imgProps[k] === undefined && delete imgProps[k]; });
        };
        qwikBugWorkaround(imgProps);
        if (isBuilderIoImage) {
            var webpImage_1 = updateQueryParam(image, 'format', 'webp');
            var srcset = ['100', '200', '400', '800', '1200', '1600', '2000']
                .concat(props.srcsetSizes ? String(props.srcsetSizes).split(' ') : [])
                .map(function (size) {
                return updateQueryParam(webpImage_1, 'width', size) + ' ' + size + 'w';
            })
                .concat(tryAppendWidth(image))
                .join(', ');
            imgProps.srcset = srcset;
            jsx = jsx = [
                h('picture', {}, [
                    h('source', { type: 'image/webp', srcset: srcset }),
                    h('img', imgProps, jsx),
                ]),
            ];
        }
        else {
            jsx = [h('img', imgProps, jsx)];
        }
        if (props.aspectRatio && !(props.fitContent && props.children && props.children.length)) {
            var sizingDiv = h('div', {
                class: 'builder-image-sizer',
                style: "width:100%;padding-top:".concat((props.aspectRatio || 1) * 100, "%;pointer-events:none;font-size:0"),
            });
            jsx.push(sizingDiv);
        }
    }
    var children = props.children ? [jsx].concat(props.children) : [jsx];
    return h(props.href ? 'a' : 'div', __passThroughProps__({ href: props.href, class: props.class }, props), children);
    function updateQueryParam(uri, key, value) {
        if (uri === void 0) { uri = ''; }
        var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        var separator = uri.indexOf('?') !== -1 ? '&' : '?';
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + '=' + encodeURIComponent(value) + '$2');
        }
        return uri + separator + key + '=' + encodeURIComponent(value);
    }
    function tryAppendWidth(url) {
        var match = url.match(/[?&]width=(\d+)/);
        var width = match && match[1];
        if (width) {
            return [url + ' ' + width + 'w'];
        }
        return [];
    }
}
exports.Image = Image;
function __passThroughProps__(dstProps, srcProps) {
    for (var key in srcProps) {
        if (Object.prototype.hasOwnProperty.call(srcProps, key) &&
            ((key.startsWith('on') && key.endsWith('$')) || key == 'style')) {
            dstProps[key] = srcProps[key];
        }
    }
    return dstProps;
}
function CoreButton(props) {
    var hasLink = !!props.link;
    var hProps = {
        dangerouslySetInnerHTML: props.text || '',
        href: props.link,
        target: props.openInNewTab ? '_blank' : '_self',
        class: props.class,
    };
    return h(hasLink ? 'a' : props.tagName$ || 'span', __passThroughProps__(hProps, props));
}
function __proxyMerge__(state, local) {
    return new Proxy(state, {
        get: function (obj, prop) {
            if (local && prop in local) {
                return local[prop];
            }
            else {
                return state[prop];
            }
        },
        set: function (obj, prop, value) {
            obj[prop] = value;
            return true;
        },
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
