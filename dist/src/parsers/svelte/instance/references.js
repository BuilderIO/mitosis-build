"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReferences = exports.getParsedValue = void 0;
var astring_1 = require("astring");
var lodash_1 = require("lodash");
var expressions_1 = require("../helpers/expressions");
function getParsedValue(json, element) {
    switch (element.type) {
        case 'Identifier': {
            return element.name;
        }
        case 'ObjectExpression': {
            return (0, expressions_1.parseObjectExpression)(json, element);
        }
        default: {
            return element.value;
        }
    }
}
exports.getParsedValue = getParsedValue;
function isPropertyOrStateReference(index) {
    return (0, lodash_1.isString)(index) && (index.includes('props.') || index.includes('state.'));
}
function parseReferences(json, node) {
    var _a, _b, _c;
    var declaration = node.declarations[0];
    var code;
    var type = 'property';
    switch ((_a = declaration === null || declaration === void 0 ? void 0 : declaration.init) === null || _a === void 0 ? void 0 : _a.type) {
        case 'ArrayExpression': {
            code = declaration.init.elements.map(function (element) {
                return getParsedValue(json, element);
            });
            if ((0, lodash_1.some)(code, function (c) { return isPropertyOrStateReference(c); })) {
                var name_1 = declaration.id.name;
                json.state[name_1] = {
                    code: "get ".concat(name_1, "() { return [").concat(code.map(function (c) {
                        if (isPropertyOrStateReference(c)) {
                            return c;
                        }
                        return JSON.stringify(c);
                    }), "]}"),
                    type: 'getter',
                };
                return;
            }
            break;
        }
        case 'ObjectExpression': {
            code = (0, expressions_1.parseObjectExpression)(json, declaration.init);
            break;
        }
        case 'FunctionExpression': {
            declaration.init.id = declaration.id;
            code = (0, astring_1.generate)(declaration.init);
            type = 'function';
            break;
        }
        default: {
            code = (_c = (_b = declaration === null || declaration === void 0 ? void 0 : declaration.init) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : null;
        }
    }
    json.state[declaration.id.name] = {
        code: JSON.stringify(code),
        type: type,
    };
}
exports.parseReferences = parseReferences;
