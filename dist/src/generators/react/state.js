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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStateSettersInCode = exports.updateStateSetters = exports.getUseStateCode = exports.processHookCode = void 0;
var core_1 = require("@babel/core");
var function_1 = require("fp-ts/lib/function");
var traverse_1 = __importDefault(require("traverse"));
var capitalize_1 = require("../../helpers/capitalize");
var is_mitosis_node_1 = require("../../helpers/is-mitosis-node");
var patterns_1 = require("../../helpers/patterns");
var transform_state_setters_1 = require("../../helpers/transform-state-setters");
var helpers_1 = require("./helpers");
/**
 * Removes all `this.` references.
 */
var stripThisRefs = function (str, options) {
    if (options.stateType !== 'useState') {
        return str;
    }
    return str.replace(/this\.([a-zA-Z_\$0-9]+)/g, '$1');
};
var processHookCode = function (_a) {
    var str = _a.str, options = _a.options;
    return (0, helpers_1.processBinding)((0, exports.updateStateSettersInCode)(str, options), options);
};
exports.processHookCode = processHookCode;
var valueMapper = function (options) { return function (val) {
    var x = (0, exports.processHookCode)({ str: val, options: options });
    return stripThisRefs(x, options);
}; };
var getSetStateFnName = function (stateName) { return "set".concat((0, capitalize_1.capitalize)(stateName)); };
var processStateValue = function (options) {
    var mapValue = valueMapper(options);
    return function (_a) {
        var key = _a[0], stateVal = _a[1];
        if (!stateVal) {
            return '';
        }
        var getDefaultCase = function () {
            return "const [".concat(key, ", ").concat(getSetStateFnName(key), "] = useState(() => (").concat(mapValue(value), "))");
        };
        var value = stateVal.code || '';
        var type = stateVal.type;
        if (typeof value === 'string') {
            switch (type) {
                case 'getter':
                    return (0, function_1.pipe)(value, patterns_1.replaceGetterWithFunction, mapValue);
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
};
var getUseStateCode = function (json, options) {
    var lineItemDelimiter = '\n\n\n';
    var stringifiedState = Object.entries(json.state).map(processStateValue(options));
    return stringifiedState.join(lineItemDelimiter);
};
exports.getUseStateCode = getUseStateCode;
var updateStateSetters = function (json, options) {
    if (options.stateType !== 'useState') {
        return;
    }
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var key in item.bindings) {
                var values = item.bindings[key];
                var newValue = (0, exports.updateStateSettersInCode)(values === null || values === void 0 ? void 0 : values.code, options);
                if (newValue !== (values === null || values === void 0 ? void 0 : values.code)) {
                    item.bindings[key] = __assign(__assign({}, values), { code: newValue });
                }
            }
        }
    });
};
exports.updateStateSetters = updateStateSetters;
var updateStateSettersInCode = function (value, options) {
    if (options.stateType !== 'useState') {
        return value;
    }
    return (0, transform_state_setters_1.transformStateSetters)({
        value: value,
        transformer: function (_a) {
            var path = _a.path, propertyName = _a.propertyName;
            return core_1.types.callExpression(core_1.types.identifier(getSetStateFnName(propertyName)), [path.node.right]);
        },
    });
};
exports.updateStateSettersInCode = updateStateSettersInCode;
