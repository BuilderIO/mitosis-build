"use strict";
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
exports.renderHandlers = void 0;
var component_1 = require("../component");
var src_generator_1 = require("../src-generator");
var IIF_START = '(() => {';
var IIF_END = '})()';
function extractJSBlock(binding) {
    if (typeof binding == 'string') {
        if (binding.startsWith('{') &&
            binding.endsWith('}') &&
            !binding.startsWith('{"') &&
            !binding.endsWith('"}')) {
            return binding.substring(1, binding.length - 2);
        }
        else if (binding.startsWith(IIF_START) && binding.endsWith(IIF_END)) {
            return binding.substring(IIF_START.length, binding.length - IIF_END.length - 1);
        }
    }
    return null;
}
function renderHandlers(file, componentName, children) {
    var id = 0;
    var map = new Map();
    var nodes = __spreadArray([], children, true);
    while (nodes.length) {
        var node = nodes.shift();
        var bindings = node.bindings;
        for (var key in bindings) {
            if (Object.prototype.hasOwnProperty.call(bindings, key)) {
                var binding = bindings[key].code;
                if (binding != null) {
                    if (isEventName(key)) {
                        var block = extractJSBlock(binding) || binding;
                        var symbol = "".concat(componentName, "_").concat(key, "_").concat(id++);
                        map.set(binding, symbol);
                        renderHandler(file, symbol, block);
                    }
                }
            }
        }
        nodes.push.apply(nodes, node.children);
    }
    return map;
}
exports.renderHandlers = renderHandlers;
function renderHandler(file, symbol, code) {
    var body = [code];
    var shouldRenderStateRestore = code.indexOf('state') !== -1;
    if (shouldRenderStateRestore) {
        body.unshift((0, component_1.renderUseLexicalScope)(file));
    }
    file.exportConst(symbol, function () {
        this.emit([(0, src_generator_1.arrowFnBlock)(['event'], body)]);
    });
}
function isEventName(name) {
    return name.startsWith('on') && name.charAt(2).toUpperCase() == name.charAt(2);
}
