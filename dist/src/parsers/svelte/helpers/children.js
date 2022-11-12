"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseChildren = exports.filterChildren = void 0;
var html_1 = require("../html");
function filterChildren(children) {
    var _a;
    return ((_a = children === null || children === void 0 ? void 0 : children.filter(function (n) { var _a; return n.type !== 'Comment' && (n.type !== 'Text' || ((_a = n.data) === null || _a === void 0 ? void 0 : _a.trim().length)); })) !== null && _a !== void 0 ? _a : []);
}
exports.filterChildren = filterChildren;
function parseChildren(json, node) {
    var children = [];
    if (node.children) {
        for (var _i = 0, _a = filterChildren(node.children); _i < _a.length; _i++) {
            var child = _a[_i];
            var mitosisNode = (0, html_1.parseHtmlNode)(json, child);
            if (mitosisNode) {
                children.push(mitosisNode);
            }
        }
    }
    return children;
}
exports.parseChildren = parseChildren;
