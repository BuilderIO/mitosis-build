"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFunctions = void 0;
var types_1 = require("@babel/types");
var astring_1 = require("astring");
var lodash_1 = require("lodash");
var compiler_1 = require("svelte/compiler");
var string_1 = require("../helpers/string");
function parseFunctions(json, node) {
    var id = node.id;
    var dispatchEventName;
    var code = (0, astring_1.generate)(node);
    (0, compiler_1.walk)(node, {
        enter: function (node) {
            switch (node.type) {
                case 'CallExpression': {
                    var node_ = node;
                    var callee = node_.callee;
                    if ((callee === null || callee === void 0 ? void 0 : callee.name) === 'dispatch') {
                        var event_1 = (0, astring_1.generate)(node_.arguments[0]);
                        dispatchEventName = event_1;
                    }
                    break;
                }
                case 'UpdateExpression': {
                    if ((0, types_1.isUpdateExpression)(node) && (0, types_1.isIdentifier)(node.argument)) {
                        var argument = node.argument.name;
                        if (node.operator === '++') {
                            code = code.replace('++', " = ".concat(argument, " + 1"));
                        }
                        else if (node.operator === '--') {
                            code = code.replace('--', " = ".concat(argument, " - 1"));
                        }
                    }
                    break;
                }
                case 'AssignmentExpression': {
                    if ((0, types_1.isAssignmentExpression)(node) && (0, types_1.isIdentifier)(node.left)) {
                        var argument = node.left.name;
                        if (node.operator === '+=') {
                            code = code.replace('+=', "= ".concat(argument, " +"));
                        }
                        else if (node.operator === '-=') {
                            code = code.replace('-=', "= ".concat(argument, " -"));
                        }
                    }
                    break;
                }
            }
        },
    });
    if (dispatchEventName) {
        var regex = new RegExp("dispatch\\(".concat(dispatchEventName, ",?"));
        code = code.replace(regex, "props.on".concat((0, lodash_1.capitalize)((0, string_1.stripQuotes)(dispatchEventName)), "("));
    }
    json.state[id.name] = {
        code: code,
        type: 'function',
    };
}
exports.parseFunctions = parseFunctions;
