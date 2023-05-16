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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIfElse = void 0;
var astring_1 = require("astring");
var _1 = require(".");
var children_1 = require("../helpers/children");
var mitosis_node_1 = require("../helpers/mitosis-node");
var bindings_1 = require("../../../helpers/bindings");
function parseIfElse(json, node) {
    var _a, _b, _c;
    var mitosisNode = (0, mitosis_node_1.createMitosisNode)();
    mitosisNode.name = 'Show';
    mitosisNode.bindings = {
        when: (0, bindings_1.createSingleBinding)({
            code: (0, astring_1.generate)(node.expression),
        }),
    };
    mitosisNode.children = (0, children_1.parseChildren)(json, node);
    if (node.else) {
        mitosisNode.meta.else =
            ((_a = node.else.children) === null || _a === void 0 ? void 0 : _a.length) === 1
                ? (0, _1.parseHtmlNode)(json, node.else.children[0])
                : __assign(__assign({}, (0, mitosis_node_1.createMitosisNode)()), { name: 'div', children: (_c = (_b = node.else.children) === null || _b === void 0 ? void 0 : _b.map(function (n) { return (0, _1.parseHtmlNode)(json, n); })) !== null && _c !== void 0 ? _c : [] });
    }
    return mitosisNode;
}
exports.parseIfElse = parseIfElse;
