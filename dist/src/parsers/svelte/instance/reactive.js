"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReactive = void 0;
var astring_1 = require("astring");
function parseReactive(json, node) {
    var body = node.body;
    var expression = body === null || body === void 0 ? void 0 : body.expression;
    if (!expression) {
        var wrap = node.body.type !== 'BlockStatement';
        var name_1 = "reactive".concat(Object.values(json.state).filter(function (index) { return (index === null || index === void 0 ? void 0 : index.type) === 'getter'; }).length);
        json.state[name_1] = {
            code: "get ".concat(name_1, "() ").concat(wrap ? '{' : '').concat((0, astring_1.generate)(node.body)).concat(wrap ? '}' : ''),
            type: 'getter',
        };
    }
    else if (expression.type === 'AssignmentExpression') {
        var name_2 = expression.left.name;
        json.state[name_2] = {
            code: "get ".concat(name_2, "() {\n return ").concat((0, astring_1.generate)(expression.right), "}"),
            type: 'getter',
        };
    }
    else if (expression.type === 'CallExpression') {
        if (node.body.type === 'ExpressionStatement') {
            json.hooks.onUpdate = json.hooks.onUpdate || [];
            json.hooks.onUpdate.push({
                code: (0, astring_1.generate)(node.body),
                deps: "[".concat(expression.arguments.map(function (arg) { return (0, astring_1.generate)(arg); }), "]"),
            });
        }
    }
}
exports.parseReactive = parseReactive;
