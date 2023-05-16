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
exports.hashCode = exports.hashCodeAsString = exports.getJsxSymbolComponentName = exports.convertBuilderElementToMitosisComponent = exports.convertBuilderContentToSymbolHierarchy = exports.ensureAllSymbolsHaveIds = void 0;
var traverse_1 = require("traverse");
var minify_1 = require("../generators/minify");
var builder_1 = require("../parsers/builder");
/**
 * Ensure every symbol in a BuilderContent tree has a unique ID.
 * Mutates the data tree directly.
 */
function ensureAllSymbolsHaveIds(content) {
    var counter = 0;
    var ids = new Set();
    (0, traverse_1.forEach)(content, function (el) {
        var _a, _b, _c;
        if (this.key === 'jsCode' && isString(el) && el.endsWith('return _virtual_index')) {
            // Sometimes rollup adds a final `return _virtual_index` but that causes VM evaluation to fail.
            // Instead of a return on the last line, it needs a plain expression on the last line. Luckily
            // because the rollup compile behavior is consistent this works pretty reliably
            el = el.replace(/return _virtual_index$/, '_virtual_index');
            this.parent && (this.parent.node.jsCode = el);
        }
        if ((0, builder_1.isBuilderElement)(el)) {
            if (((_a = el === null || el === void 0 ? void 0 : el.component) === null || _a === void 0 ? void 0 : _a.name) === 'Symbol') {
                var id = getIdFromSymbol(el);
                if (id) {
                    if (ids.has(id)) {
                        if ((_c = (_b = el.component) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.symbol) {
                            var id_1 = pad(counter++);
                            el.component.options.symbol.entry = id_1;
                            if (el.component.options.symbol.content) {
                                el.component.options.symbol.content.id = id_1;
                            }
                            ids.add(id_1);
                        }
                    }
                    else {
                        ids.add(id);
                    }
                }
            }
        }
    });
}
exports.ensureAllSymbolsHaveIds = ensureAllSymbolsHaveIds;
//TODO(misko): needs test
function convertBuilderContentToSymbolHierarchy(content, _a) {
    var _b;
    var _c, _d;
    var _e = _a === void 0 ? {} : _a, collectComponentStyles = _e.collectComponentStyles, collectComponentState = _e.collectComponentState;
    if (collectComponentState && ((_c = content.data) === null || _c === void 0 ? void 0 : _c.state)) {
        var state = (_d = content.data) === null || _d === void 0 ? void 0 : _d.state;
        collectComponentState['ROOT_COMPONENT_STATE'] = state;
    }
    var path = [-1, content.id];
    var hierarchy = (_b = {
            depthFirstSymbols: []
        },
        _b[content.id] = [],
        _b);
    (0, traverse_1.forEach)(content, function (el) {
        var _a, _b, _c;
        var cssCode = el === null || el === void 0 ? void 0 : el.cssCode;
        if (cssCode) {
            collectComponentStyles && collectComponentStyles.push((0, minify_1.minify)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", ""], ["", ""])), cssCode));
        }
        while (path[0 /* Path.DEPTH */] >= this.path.length) {
            path.shift();
            path.shift();
        }
        if ((0, builder_1.isBuilderElement)(el)) {
            if (((_a = el === null || el === void 0 ? void 0 : el.component) === null || _a === void 0 ? void 0 : _a.name) === 'Symbol') {
                if (collectComponentState) {
                    var symbol = el.component.options.symbol;
                    var props = symbol.data || (symbol.data = {});
                    var state = (_c = (_b = symbol.content) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.state;
                    if (state) {
                        var id = hashCodeAsString(state);
                        props['serverStateId'] = id;
                        collectComponentState[id] = state;
                    }
                }
                if (path[0 /* Path.DEPTH */] < this.path.length) {
                    var id = getIdFromSymbol(el);
                    hierarchy[id] = [];
                    addIfMissing(hierarchy[path[1 /* Path.ID */]], id);
                    path.unshift(this.path.length, id);
                }
                // TODO(misko): This should be `el.content` not `el`
                // Because we don't wante to take the `<Symbol>` with us.
                // TODO(misko): Do we really want to add ALL symbols? Even duplicates?
                hierarchy.depthFirstSymbols.unshift(el);
            }
        }
    });
    return hierarchy;
}
exports.convertBuilderContentToSymbolHierarchy = convertBuilderContentToSymbolHierarchy;
function convertBuilderElementToMitosisComponent(element) {
    var _a, _b;
    var symbolValue = (_b = (_a = element.component) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.symbol;
    var elContent = symbolValue === null || symbolValue === void 0 ? void 0 : symbolValue.content;
    if (!elContent) {
        console.warn('Symbol missing content', element.id);
        delete element.component; // TODO(misko): Should this be assign `undefined` for perf?
        element.children = [];
        return null;
    }
    var id = getIdFromSymbol(element);
    var componentName = getJsxSymbolComponentName(id);
    delete element.component; // TODO(misko): Should this be assign `undefined` for perf?
    element.children = [
        (0, builder_1.createBuilderElement)({
            component: {
                name: componentName,
                options: symbolValue.data,
            },
            properties: {
                'builder-content-id': id,
            },
        }),
    ];
    var mitosisComponent = __assign(__assign({}, (0, builder_1.builderContentToMitosisComponent)(elContent, {
        includeBuilderExtras: true,
        preserveTextBlocks: true,
    })), { name: componentName });
    mitosisComponent.meta.builderElId = element.id;
    return mitosisComponent;
}
exports.convertBuilderElementToMitosisComponent = convertBuilderElementToMitosisComponent;
function getJsxSymbolComponentName(id) {
    return 'Component' + id.toUpperCase().replace(/-/g, '');
}
exports.getJsxSymbolComponentName = getJsxSymbolComponentName;
function getIdFromSymbol(el) {
    var _a, _b, _c;
    // TODO(misko): Don't use entry us el.id???
    return (_c = (_b = (_a = el.component) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.symbol) === null || _c === void 0 ? void 0 : _c.entry;
}
function addIfMissing(array, value) {
    if (array.indexOf(value) == -1) {
        array.push(value);
    }
}
function isString(value) {
    return typeof value == 'string';
}
function hashCodeAsString(obj) {
    return Number(Math.abs(hashCode(obj))).toString(36);
}
exports.hashCodeAsString = hashCodeAsString;
function hashCode(obj, hash) {
    if (hash === void 0) { hash = 0; }
    var value = 0;
    switch (typeof obj) {
        case 'number':
            value = obj;
            break;
        case 'undefined':
            value = Number.MIN_SAFE_INTEGER;
            break;
        case 'string':
            for (var i = 0; i < obj.length; i++) {
                hash = hashCodeApply(hash, obj.charCodeAt(i));
            }
            value = obj.length;
        case 'boolean':
            value = obj ? 1 : 0;
            break;
        case 'object':
            if (obj === null) {
                value = Number.MAX_SAFE_INTEGER;
            }
            else if (Array.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    hash = hashCode(obj[i], hash);
                }
            }
            else {
                for (var _i = 0, _a = Object.keys(obj).sort(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    if (obj.hasOwnProperty(key)) {
                        hash = hashCode(obj[key], hash);
                    }
                }
            }
            break;
    }
    return hashCodeApply(hash, value);
}
exports.hashCode = hashCode;
function hashCodeApply(hash, value) {
    hash = (hash << 5) - hash + value;
    hash |= 0; // Convert to 32bit integer
    return hash;
}
function pad(value) {
    var padding = '000000';
    var result = padding + String(value);
    return result.substring(result.length - padding.length);
}
var templateObject_1;
