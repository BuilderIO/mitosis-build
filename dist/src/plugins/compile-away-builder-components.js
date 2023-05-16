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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileAwayBuilderComponents = exports.compileAwayBuilderComponentsFromTree = exports.components = void 0;
var react_1 = require("@builder.io/react");
var json5_1 = __importStar(require("json5")), JSON5 = json5_1;
var lodash_1 = require("lodash");
var traverse_1 = __importDefault(require("traverse"));
var bindings_1 = require("../helpers/bindings");
var create_mitosis_node_1 = require("../helpers/create-mitosis-node");
var filter_empty_text_nodes_1 = require("../helpers/filter-empty-text-nodes");
var is_mitosis_node_1 = require("../helpers/is-mitosis-node");
var builder_1 = require("../parsers/builder");
function getComponentInputNames(componentName) {
    var _a;
    var componentInfo = react_1.Builder.components.find(function (item) { return item.name === componentName; });
    return ((_a = componentInfo === null || componentInfo === void 0 ? void 0 : componentInfo.inputs) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item.name; })) || [];
}
var wrapOutput = function (node, child, components) {
    var inputNames = getComponentInputNames(node.name);
    (0, exports.compileAwayBuilderComponentsFromTree)(child, components);
    return (0, create_mitosis_node_1.createMitosisNode)(__assign(__assign({}, node), { properties: __assign({}, lodash_1.omit.apply(void 0, __spreadArray([node.properties], inputNames, false))), bindings: __assign({}, lodash_1.omit.apply(void 0, __spreadArray([node.bindings], inputNames, false))), 
        // TODO: forward tagName as a $tagName="..."
        name: node.properties._tagName || node.properties.$tagName || 'div', children: Array.isArray(child) ? child : [child] }));
};
exports.components = {
    CoreButton: function (node, context, components) {
        var properties = {};
        var bindings = {};
        if (!node.properties.href && node.bindings.css) {
            var css = json5_1.default.parse(node.bindings.css.code);
            // When using button tag ensure we have all: unset and
            // be sure that is the first style in the list
            node.bindings.css.code = json5_1.default.stringify(__assign({ all: 'unset' }, css));
        }
        if ('link' in node.properties) {
            properties.href = node.properties.link;
        }
        if ('link' in node.bindings) {
            bindings.href = node.properties.link;
        }
        if ('text' in node.properties) {
            node.children = [
                (0, create_mitosis_node_1.createMitosisNode)({
                    properties: {
                        _text: node.properties.text,
                    },
                }),
            ];
        }
        if ('text' in node.bindings) {
            node.children = [
                (0, create_mitosis_node_1.createMitosisNode)({
                    bindings: {
                        _text: node.bindings.text,
                    },
                }),
            ];
        }
        if ('openInNewTab' in node.bindings) {
            bindings.target = "".concat(node.bindings.openInNewTab, " ? '_blank' : '_self'");
        }
        var omitFields = ['link', 'openInNewTab', 'text'];
        var hasLink = node.properties.link || node.bindings.link;
        return (0, create_mitosis_node_1.createMitosisNode)(__assign(__assign({}, node), { 
            // TODO: use 'button' tag for no link, and add `all: unset` to CSS string only then
            name: hasLink ? 'a' : 'button', properties: __assign(__assign({}, (0, lodash_1.omit)(node.properties, omitFields)), properties), bindings: __assign(__assign({}, (0, lodash_1.omit)(node.bindings, omitFields)), bindings) }));
    },
    Embed: function (node, context, components) {
        return wrapOutput(node, (0, create_mitosis_node_1.createMitosisNode)({
            name: node.properties.builderTag || 'div',
            properties: {
                innerHTML: node.properties.content || '',
            },
        }), components);
    },
    BuilderAccordion: function (node, context, components) {
        var _a;
        var itemsJSON = ((_a = node.bindings.items) === null || _a === void 0 ? void 0 : _a.code) || '[]';
        var accordionItems = JSON5.parse(itemsJSON);
        var children = accordionItems.map(function (accordionItem) {
            var titleChildren = accordionItem.title.map(function (element) {
                return (0, builder_1.builderElementToMitosisNode)(element, {
                    includeBuilderExtras: true,
                    preserveTextBlocks: true,
                });
            });
            var detailChildren = accordionItem.detail.map(function (element) {
                return (0, builder_1.builderElementToMitosisNode)(element, {
                    includeBuilderExtras: true,
                    preserveTextBlocks: true,
                });
            });
            return (0, create_mitosis_node_1.createMitosisNode)({
                name: 'div',
                properties: { builder: 'accordion' },
                children: [
                    (0, create_mitosis_node_1.createMitosisNode)({
                        name: 'div',
                        properties: { builder: 'accordion-title' },
                        children: titleChildren,
                    }),
                    (0, create_mitosis_node_1.createMitosisNode)({
                        name: 'div',
                        properties: { builder: 'accordion-detail' },
                        children: detailChildren,
                    }),
                ],
            });
        });
        return wrapOutput(node, (0, create_mitosis_node_1.createMitosisNode)({
            name: node.properties.builderTag || 'div',
            properties: {
                $name: 'accordion',
            },
            children: children,
        }), components);
    },
    BuilderMasonry: function () {
        // TODO
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'div',
            properties: { 'data-missing-component': 'BuilderMasonry' },
        });
    },
    BuilderTabs: function () {
        // TODO
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'div',
            properties: { 'data-missing-component': 'BuilderTabs' },
        });
    },
    BuilderCarousel: function () {
        // TODO
        return (0, create_mitosis_node_1.createMitosisNode)({
            name: 'div',
            properties: { 'data-missing-component': 'BuilderCarousel' },
        });
    },
    CustomCode: function (node, context, components) {
        var _a;
        var bindings = {};
        if ((_a = node === null || node === void 0 ? void 0 : node.bindings) === null || _a === void 0 ? void 0 : _a.code) {
            bindings.innerHTML = node.bindings.code;
        }
        return wrapOutput(node, (0, create_mitosis_node_1.createMitosisNode)({
            name: node.properties.builderTag || 'div',
            properties: {
                innerHTML: node.properties.code || '',
            },
            bindings: bindings,
        }), components);
    },
    CoreSection: function (node, context, components) {
        var _a, _b;
        return wrapOutput(node, (0, create_mitosis_node_1.createMitosisNode)({
            name: 'section',
            properties: __assign(__assign(__assign({}, node.properties), { $name: 'section' }), (((_a = node.bindings.lazyLoad) === null || _a === void 0 ? void 0 : _a.code) === 'true' && {
                lazyLoad: 'true',
            })),
            bindings: {
                css: (0, bindings_1.createSingleBinding)({
                    code: JSON.stringify({
                        width: '100%',
                        alignSelf: 'stretch',
                        flexGrow: '1',
                        boxSizing: 'border-box',
                        maxWidth: "".concat((((_b = node.bindings.maxWidth) === null || _b === void 0 ? void 0 : _b.code) && Number(node.bindings.maxWidth.code)) || 1200, "px"),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }),
                }),
            },
            children: node.children,
        }), components);
    },
    Columns: function (node, context, components) {
        var _a;
        var columns = node.children.filter(filter_empty_text_nodes_1.filterEmptyTextNodes).map(function (item) {
            var _a;
            return ({
                width: parseFloat(item.properties.width || ((_a = item.bindings.width) === null || _a === void 0 ? void 0 : _a.code) || '0') || 0,
                children: item.children,
            });
        });
        var gutterSize = (node.properties.getterSize && parseFloat(node.properties.getterSize)) || 20;
        function getWidth(index) {
            return (columns[index] && columns[index].width) || 100 / columns.length;
        }
        function getColumnWidth(index) {
            var subtractWidth = (gutterSize * (columns.length - 1)) / columns.length;
            return "calc(".concat(getWidth(index), "% - ").concat(subtractWidth, "px)");
        }
        var properties = node.properties;
        return wrapOutput(node, (0, create_mitosis_node_1.createMitosisNode)({
            name: 'div',
            properties: {
                class: 'builder-columns',
            },
            bindings: {
                css: (0, bindings_1.createSingleBinding)({
                    code: JSON.stringify(__assign({ display: 'flex' }, (properties.stackColumnsAt === 'never'
                        ? {}
                        : (_a = {},
                            _a["@media (max-width: ".concat(properties.stackColumnsAt !== 'tablet' ? 639 : 999, "px)")] = {
                                flexDirection: properties.reverseColumnsWhenStacked === 'true'
                                    ? 'column-reverse'
                                    : 'column',
                                alignItems: 'stretch',
                            },
                            _a)))),
                }),
            },
            children: columns.map(function (col, index) {
                var _a;
                return (0, create_mitosis_node_1.createMitosisNode)({
                    name: 'div',
                    properties: {
                        $name: 'column',
                        class: 'builder-column',
                    },
                    bindings: {
                        css: (0, bindings_1.createSingleBinding)({
                            code: JSON.stringify(__assign({ display: 'flex', flexDirection: 'column', alignItems: 'stretch', lineHeight: 'normal', width: "".concat(getColumnWidth(index)), marginLeft: "".concat(index === 0 ? 0 : gutterSize, "px") }, (properties.stackColumnsAt === 'never'
                                ? {}
                                : (_a = {},
                                    _a["@media (max-width: ".concat(properties.stackColumnsAt !== 'tablet' ? 639 : 999, "px)")] = {
                                        width: '100%',
                                        marginLeft: 0,
                                    },
                                    _a)))),
                        }),
                    },
                    children: col.children,
                });
            }),
        }), components);
    },
    Image: function (node, context, components) {
        var _a, _b, _c, _d, _e, _f, _g;
        var _h = node.properties, backgroundSize = _h.backgroundSize, backgroundPosition = _h.backgroundPosition;
        var srcset = node.properties.srcset;
        var aspectRatio = ((_a = node.bindings.aspectRatio) === null || _a === void 0 ? void 0 : _a.code)
            ? parseFloat(node.bindings.aspectRatio.code)
            : null;
        if (typeof aspectRatio === 'number' && isNaN(aspectRatio)) {
            aspectRatio = null;
        }
        var image = node.properties.image;
        var srcSet = srcset || generateBuilderIoSrcSet(image);
        var source = ((_b = node.bindings.noWebp) === null || _b === void 0 ? void 0 : _b.code) !== 'true' &&
            (0, create_mitosis_node_1.createMitosisNode)({
                name: 'source',
                properties: {
                    srcset: srcSet.replace(/\?/g, '?format=webp&'),
                    type: 'image/webp',
                },
            });
        var img = (0, create_mitosis_node_1.createMitosisNode)({
            name: 'img',
            properties: noUndefined({
                $name: 'image',
                loading: 'lazy',
                src: node.properties.image,
                sizes: node.properties.sizes,
                srcset: srcSet || null,
            }),
            bindings: noUndefined({
                src: ((_c = node.bindings.image) === null || _c === void 0 ? void 0 : _c.code) && { code: (_d = node.bindings.image) === null || _d === void 0 ? void 0 : _d.code },
                sizes: ((_e = node.bindings.sizes) === null || _e === void 0 ? void 0 : _e.code) && { code: (_f = node.bindings.sizes) === null || _f === void 0 ? void 0 : _f.code },
                css: (0, bindings_1.createSingleBinding)({
                    code: JSON.stringify(__assign({ objectFit: backgroundSize || 'cover', objectPosition: backgroundPosition || 'cover' }, (aspectRatio
                        ? {
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            top: '0',
                            left: '0',
                        }
                        : {}))),
                }),
            }),
        });
        var picture = (0, create_mitosis_node_1.createMitosisNode)({
            name: 'picture',
            children: source ? [source, img] : [img],
        });
        var imgSizer = aspectRatio &&
            (0, create_mitosis_node_1.createMitosisNode)({
                name: 'div',
                properties: {
                    $name: 'image-sizer',
                    class: 'builder-image-sizer',
                },
                bindings: {
                    css: (0, bindings_1.createSingleBinding)({
                        code: JSON.stringify({
                            width: '100%',
                            paddingTop: aspectRatio * 100 + '%',
                            pointerEvents: 'none',
                            fontSize: '0',
                        }),
                    }),
                },
            });
        var children = node.children &&
            node.children.length &&
            (0, create_mitosis_node_1.createMitosisNode)({
                name: 'div',
                properties: {
                    $name: 'image-contents',
                },
                bindings: {
                    css: (0, bindings_1.createSingleBinding)({
                        code: JSON.stringify({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                        }),
                    }),
                },
                children: node.children,
            });
        var imageNodes = [picture];
        imgSizer && imageNodes.push(imgSizer);
        children && imageNodes.push(children);
        var href = node.properties.href;
        var hrefBinding = (_g = node.bindings.href) === null || _g === void 0 ? void 0 : _g.code;
        if (href || hrefBinding) {
            var aHref = (0, create_mitosis_node_1.createMitosisNode)({
                name: 'a',
                properties: {
                    href: href,
                },
                bindings: hrefBinding
                    ? {
                        href: (0, bindings_1.createSingleBinding)({ code: hrefBinding }),
                    }
                    : undefined,
                children: imageNodes,
            });
            return wrapOutput(node, aHref, components);
        }
        else {
            return wrapOutput(node, imageNodes, components);
        }
    },
    Video: function (node, context, components) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        var aspectRatio = ((_a = node.bindings.aspectRatio) === null || _a === void 0 ? void 0 : _a.code)
            ? parseFloat(node.bindings.aspectRatio.code)
            : null;
        if (typeof aspectRatio === 'number' && isNaN(aspectRatio)) {
            aspectRatio = null;
        }
        var videoContainerNodes = [];
        videoContainerNodes.push((0, create_mitosis_node_1.createMitosisNode)({
            name: 'video',
            properties: noUndefined({
                $name: 'builder-video',
                poster: node.properties.posterImage,
                autoplay: node.properties.autoPlay,
                muted: node.properties.muted,
                controls: node.properties.controls,
                loop: node.properties.loop,
                playsinline: node.properties.playsInline,
                preload: node.properties.lazy ? 'none' : undefined,
            }),
            bindings: noUndefined({
                poster: ((_b = node.bindings.posterImage) === null || _b === void 0 ? void 0 : _b.code) && {
                    code: (_c = node.bindings.posterImage) === null || _c === void 0 ? void 0 : _c.code,
                },
                autoplay: ((_d = node.bindings.autoPlay) === null || _d === void 0 ? void 0 : _d.code) && {
                    code: (_e = node.bindings.autoPlay) === null || _e === void 0 ? void 0 : _e.code,
                },
                muted: ((_f = node.bindings.muted) === null || _f === void 0 ? void 0 : _f.code) && {
                    code: (_g = node.bindings.muted) === null || _g === void 0 ? void 0 : _g.code,
                },
                controls: ((_h = node.bindings.controls) === null || _h === void 0 ? void 0 : _h.code) && {
                    code: (_j = node.bindings.controls) === null || _j === void 0 ? void 0 : _j.code,
                },
                playsinline: ((_k = node.bindings.playsInline) === null || _k === void 0 ? void 0 : _k.code) && {
                    code: (_l = node.bindings.playsInline) === null || _l === void 0 ? void 0 : _l.code,
                },
                loop: ((_m = node.bindings.loop) === null || _m === void 0 ? void 0 : _m.code) && { code: (_o = node.bindings.loop) === null || _o === void 0 ? void 0 : _o.code },
                css: (0, bindings_1.createSingleBinding)({
                    code: JSON.stringify({
                        width: '100%',
                        height: '100%',
                        objectFit: node.properties.fit,
                        objectPosition: node.properties.position,
                        borderRadius: '1',
                        position: aspectRatio ? 'absolute' : '',
                    }),
                }),
            }),
            children: [
                (0, create_mitosis_node_1.createMitosisNode)({
                    name: 'source',
                    properties: {
                        type: 'video/mp4',
                        src: node.properties.video,
                    },
                    bindings: noUndefined({
                        src: ((_p = node.bindings.video) === null || _p === void 0 ? void 0 : _p.code) && {
                            code: (_q = node.bindings.video) === null || _q === void 0 ? void 0 : _q.code,
                        },
                    }),
                }),
            ],
        }));
        aspectRatio &&
            videoContainerNodes.push((0, create_mitosis_node_1.createMitosisNode)({
                name: 'div',
                properties: {
                    $name: 'builder-video-sizer',
                },
                bindings: {
                    css: (0, bindings_1.createSingleBinding)({
                        code: JSON.stringify({
                            width: '100%',
                            paddingTop: aspectRatio * 100 + '%',
                            pointerEvents: 'none',
                            fontSize: '0',
                        }),
                    }),
                },
            }));
        node.children &&
            node.children.length &&
            videoContainerNodes.push((0, create_mitosis_node_1.createMitosisNode)({
                name: 'div',
                properties: {
                    $name: 'image-contents',
                },
                bindings: {
                    css: (0, bindings_1.createSingleBinding)({
                        code: JSON.stringify({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                        }),
                    }),
                },
                children: node.children,
            }));
        var videoContainer = (0, create_mitosis_node_1.createMitosisNode)({
            name: 'div',
            properties: {
                $name: 'video-container',
            },
            bindings: {
                css: (0, bindings_1.createSingleBinding)({ code: JSON.stringify({ position: 'relative' }) }),
            },
            children: videoContainerNodes,
        });
        return wrapOutput(node, videoContainer, components);
    },
};
var compileAwayBuilderComponentsFromTree = function (tree, components) {
    (0, traverse_1.default)(tree).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            var mapper = components[item.name];
            if (mapper) {
                var result = mapper(item, this, components);
                if (result) {
                    this.update(result);
                }
            }
        }
    });
};
exports.compileAwayBuilderComponentsFromTree = compileAwayBuilderComponentsFromTree;
var compileAwayBuilderComponents = function (pluginOptions) {
    if (pluginOptions === void 0) { pluginOptions = {}; }
    var obj = exports.components;
    if (pluginOptions.omit) {
        obj = (0, lodash_1.omit)(obj, pluginOptions.omit);
    }
    if (pluginOptions.only) {
        obj = (0, lodash_1.pick)(obj, pluginOptions.only);
    }
    return function (options) { return ({
        json: {
            pre: function (json) {
                (0, exports.compileAwayBuilderComponentsFromTree)(json, obj);
            },
        },
    }); };
};
exports.compileAwayBuilderComponents = compileAwayBuilderComponents;
function updateQueryParam(uri, key, value) {
    if (uri === void 0) { uri = ''; }
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + '=' + encodeURIComponent(value) + '$2');
    }
    return uri + separator + key + '=' + encodeURIComponent(value);
}
function generateBuilderIoSrcSet(image) {
    var isBuilderIo = !!(image || '').match(/builder\.io/);
    return isBuilderIo
        ? [100, 200, 400, 800, 1200, 1600, 2000]
            .map(function (size) { return "".concat(updateQueryParam(image, 'width', String(size)), " ").concat(size, "w"); })
            .concat([image])
            .join(', ')
        : '';
}
function noUndefined(obj) {
    var cleanObj = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var value = obj[key];
            if (value != null) {
                if (typeof value == 'object') {
                    var ret = noUndefined(value);
                    if (Object.keys(ret).length) {
                        cleanObj[key] = ret;
                    }
                }
                else {
                    cleanObj[key] = value;
                }
            }
        }
    }
    return cleanObj;
}
