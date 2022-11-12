"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMemberExpression = void 0;
var astring_1 = require("astring");
var hooks_1 = require("../helpers/hooks");
function parseMemberExpression(json, node, parent) {
    if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'Program') {
        (0, hooks_1.addToOnInitHook)(json, (0, astring_1.generate)(node));
    }
}
exports.parseMemberExpression = parseMemberExpression;
