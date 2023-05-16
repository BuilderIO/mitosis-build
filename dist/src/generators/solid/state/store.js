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
exports.getStoreCode = void 0;
var core_1 = require("@babel/core");
var function_1 = require("fp-ts/lib/function");
var babel_transform_1 = require("../../../helpers/babel-transform");
var capitalize_1 = require("../../../helpers/capitalize");
var patterns_1 = require("../../../helpers/patterns");
var helpers_1 = require("./helpers");
var collectUsedStateAndPropsInFunction = function (fnValue) {
    var stateUsed = new Set();
    var propsUsed = new Set();
    (0, babel_transform_1.babelTransformExpression)(fnValue, {
        MemberExpression: function (path) {
            var node = path.node;
            if (core_1.types.isIdentifier(node.object)) {
                if (core_1.types.isIdentifier(node.property)) {
                    if (node.object.name === 'state') {
                        stateUsed.add("state.".concat(node.property.name));
                    }
                    else if (node.object.name === 'props') {
                        propsUsed.add("props.".concat(node.property.name));
                    }
                }
            }
        },
    });
    return { stateUsed: stateUsed, propsUsed: propsUsed };
};
var getStoreCode = function (_a) {
    var component = _a.json, options = _a.options, state = _a.state;
    var mapValue = (0, helpers_1.updateStateCode)({ options: options, component: component });
    var stateUpdater = function (_a) {
        var key = _a[0], stateVal = _a[1];
        if (!stateVal) {
            return '';
        }
        var getCreateStoreStr = function (initialValue) {
            return "const [".concat(key, ", ").concat((0, helpers_1.getStateSetterName)(key), "] = createStore(").concat(initialValue, ")");
        };
        var getDefaultCase = function () { return (0, function_1.pipe)(value, mapValue, getCreateStoreStr); };
        var value = stateVal.code;
        var type = stateVal.type;
        if (typeof value === 'string') {
            switch (type) {
                case 'getter':
                    var getterValueAsFunction = (0, patterns_1.replaceGetterWithFunction)(value);
                    var _b = collectUsedStateAndPropsInFunction(getterValueAsFunction), stateUsed = _b.stateUsed, propsUsed = _b.propsUsed;
                    var fnValueWithMappedRefs = mapValue(getterValueAsFunction);
                    var FUNCTION_NAME = "update".concat((0, capitalize_1.capitalize)(key));
                    var deps = __spreadArray(__spreadArray([], Array.from(stateUsed).map((0, helpers_1.updateStateCode)({
                        options: options,
                        component: component,
                        // there are no setters in deps
                        updateSetters: false,
                    })), true), Array.from(propsUsed), true).join(', ');
                    return "\n          const ".concat(FUNCTION_NAME, " = ").concat(fnValueWithMappedRefs, "\n          ").concat(getCreateStoreStr("".concat(FUNCTION_NAME, "()")), "\n          createEffect(on(() => [").concat(deps, "], () => ").concat((0, helpers_1.getStateSetterName)(key), "(reconcile(").concat(FUNCTION_NAME, "()))))\n          ");
                case 'function':
                    return mapValue(value);
                case 'method':
                    return (0, function_1.pipe)(value, patterns_1.prefixWithFunction, mapValue);
                default:
                    return getDefaultCase();
            }
        }
        else {
            return getDefaultCase();
        }
    };
    return Object.entries(state).map(stateUpdater).join(LINE_ITEM_DELIMITER);
};
exports.getStoreCode = getStoreCode;
var LINE_ITEM_DELIMITER = '\n\n\n';
