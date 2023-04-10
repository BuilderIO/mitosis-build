"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObjectExpression = void 0;
var astring_1 = require("astring");
var references_1 = require("../instance/references");
function parseObjectExpression(json, node) {
    var _a;
    var properties = node.properties.map(function (n) {
        var node_ = n;
        return {
            key: (0, astring_1.generate)(node_.key),
            value: (0, references_1.getParsedValue)(json, node_.value),
        };
    });
    var c = {};
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var item = properties_1[_i];
        Object.assign(c, (_a = {}, _a[item.key] = item.value, _a));
    }
    return c;
}
exports.parseObjectExpression = parseObjectExpression;
