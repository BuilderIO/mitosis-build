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
exports.parseEach = void 0;
var children_1 = require("../helpers/children");
var mitosis_node_1 = require("../helpers/mitosis-node");
var bindings_1 = require("../../../helpers/bindings");
function parseEach(json, node) {
    return __assign(__assign({}, (0, mitosis_node_1.createMitosisNode)()), { name: 'For', scope: { forName: node.context.name }, bindings: {
            each: (0, bindings_1.createSingleBinding)({
                code: node.expression.name,
            }),
        }, children: (0, children_1.parseChildren)(json, node) });
}
exports.parseEach = parseEach;
