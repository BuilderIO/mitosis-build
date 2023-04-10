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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStateObjectToMitosisState = exports.mapStateIdentifiers = void 0;
var babel = __importStar(require("@babel/core"));
var traverse_1 = __importDefault(require("traverse"));
var babel_transform_1 = require("../../helpers/babel-transform");
var capitalize_1 = require("../../helpers/capitalize");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var replace_identifiers_1 = require("../../helpers/replace-identifiers");
var helpers_1 = require("./helpers");
var function_1 = require("fp-ts/lib/function");
var types = babel.types;
function mapStateIdentifiersInExpression(expression, stateProperties) {
    var setExpressions = stateProperties.map(function (propertyName) { return "set".concat((0, capitalize_1.capitalize)(propertyName)); });
    return (0, function_1.pipe)((0, replace_identifiers_1.replaceIdentifiers)({
        code: expression,
        from: stateProperties,
        to: function (name) { return "state.".concat(name); },
    }), function (code) {
        return (0, babel_transform_1.babelTransformExpression)(
        // foo -> state.foo
        code, {
            CallExpression: function (path) {
                if (types.isIdentifier(path.node.callee)) {
                    if (setExpressions.includes(path.node.callee.name)) {
                        // setFoo -> foo
                        var statePropertyName = (0, helpers_1.uncapitalize)(path.node.callee.name.slice(3));
                        // setFoo(...) -> state.foo = ...
                        path.replaceWith(types.assignmentExpression('=', types.identifier("state.".concat(statePropertyName)), path.node.arguments[0]));
                    }
                }
            },
        });
    }, function (code) { return code.trim(); });
}
var consolidateClassBindings = function (item) {
    if (item.bindings.className) {
        if (item.bindings.class) {
            // TO-DO: it's too much work to merge 2 bindings, so just remove the old one for now.
            item.bindings.class = item.bindings.className;
        }
        else {
            item.bindings.class = item.bindings.className;
        }
        delete item.bindings.className;
    }
    if (item.properties.className) {
        if (item.properties.class) {
            item.properties.class = "".concat(item.properties.class, " ").concat(item.properties.className);
        }
        else {
            item.properties.class = item.properties.className;
        }
        delete item.properties.className;
    }
    if (item.properties.class && item.bindings.class) {
        console.warn("[".concat(item.name, "]: Ended up with both a property and binding for 'class'."));
    }
};
/**
 * Convert state identifiers from React hooks format to the state.* format Mitosis needs
 * e.g.
 *   text -> state.text
 *   setText(...) -> state.text = ...
 */
function mapStateIdentifiers(json) {
    var stateProperties = Object.keys(json.state);
    for (var key in json.state) {
        var stateVal = json.state[key];
        if (typeof (stateVal === null || stateVal === void 0 ? void 0 : stateVal.code) === 'string' && stateVal.type === 'function') {
            json.state[key] = {
                code: mapStateIdentifiersInExpression(stateVal.code, stateProperties),
                type: 'function',
            };
        }
    }
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var value = item.bindings[key];
                item.bindings[key].code = mapStateIdentifiersInExpression(value.code, stateProperties);
            }
            consolidateClassBindings(item);
        }
    });
}
exports.mapStateIdentifiers = mapStateIdentifiers;
var processStateObjectSlice = function (item) {
    if (types.isObjectProperty(item)) {
        if (types.isFunctionExpression(item.value)) {
            return {
                code: (0, helpers_1.parseCode)(item.value).trim(),
                type: 'function',
            };
        }
        else if (types.isArrowFunctionExpression(item.value)) {
            var n = babel.types.objectMethod('method', item.key, item.value.params, item.value.body);
            var code = (0, helpers_1.parseCode)(n).trim();
            return {
                code: code,
                type: 'method',
            };
        }
        else {
            // Remove typescript types, e.g. from
            // { foo: ('string' as SomeType) }
            if (types.isTSAsExpression(item.value)) {
                return {
                    code: (0, helpers_1.parseCode)(item.value.expression).trim(),
                    type: 'property',
                };
            }
            return {
                code: (0, helpers_1.parseCode)(item.value).trim(),
                type: 'property',
            };
        }
    }
    else if (types.isObjectMethod(item)) {
        var n = (0, helpers_1.parseCode)(__assign(__assign({}, item), { returnType: null })).trim();
        var isGetter = item.kind === 'get';
        return {
            code: n,
            type: isGetter ? 'getter' : 'method',
        };
    }
    else {
        throw new Error('Unexpected state value type', item);
    }
};
var processDefaultPropsSlice = function (item) {
    if (types.isObjectProperty(item)) {
        if (types.isFunctionExpression(item.value) || types.isArrowFunctionExpression(item.value)) {
            return {
                code: (0, helpers_1.parseCode)(item.value),
                type: 'method',
            };
        }
        else {
            // Remove typescript types, e.g. from
            // { foo: ('string' as SomeType) }
            if (types.isTSAsExpression(item.value)) {
                return {
                    code: (0, helpers_1.parseCode)(item.value.expression),
                    type: 'property',
                };
            }
            return {
                code: (0, helpers_1.parseCode)(item.value),
                type: 'property',
            };
        }
    }
    else if (types.isObjectMethod(item)) {
        var n = (0, helpers_1.parseCode)(__assign(__assign({}, item), { returnType: null }));
        var isGetter = item.kind === 'get';
        return {
            code: n,
            type: isGetter ? 'getter' : 'method',
        };
    }
    else {
        throw new Error('Unexpected state value type', item);
    }
};
var parseStateObjectToMitosisState = function (object, isState) {
    if (isState === void 0) { isState = true; }
    var state = {};
    object.properties.forEach(function (x) {
        if (types.isSpreadElement(x)) {
            throw new Error('Parse Error: Mitosis cannot consume spread element in state object: ' + x);
        }
        if (types.isPrivateName(x.key)) {
            throw new Error('Parse Error: Mitosis cannot consume private name in state object: ' + x.key);
        }
        if (!types.isIdentifier(x.key)) {
            throw new Error('Parse Error: Mitosis cannot consume non-identifier key in state object: ' + x.key);
        }
        state[x.key.name] = isState ? processStateObjectSlice(x) : processDefaultPropsSlice(x);
    });
    return state;
};
exports.parseStateObjectToMitosisState = parseStateObjectToMitosisState;
