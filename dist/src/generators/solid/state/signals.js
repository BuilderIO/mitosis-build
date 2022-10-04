"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignalsCode = void 0;
var json5_1 = __importDefault(require("json5"));
var function_1 = require("fp-ts/lib/function");
var patterns_1 = require("../../../helpers/patterns");
var helpers_1 = require("./helpers");
var processSignalStateValue = function (_a) {
    var options = _a.options, component = _a.component;
    var mapValue = (0, helpers_1.updateStateCode)({ options: options, component: component });
    return function (_a) {
        var key = _a[0], stateVal = _a[1];
        var getDefaultCase = function () {
            return (0, function_1.pipe)(value, json5_1.default.stringify, mapValue, function (x) { return "const [".concat(key, ", ").concat((0, helpers_1.getStateSetterName)(key), "] = createSignal(").concat(x, ")"); });
        };
        var value = stateVal === null || stateVal === void 0 ? void 0 : stateVal.code;
        var type = stateVal === null || stateVal === void 0 ? void 0 : stateVal.type;
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
var LINE_ITEM_DELIMITER = '\n\n\n';
var getSignalsCode = function (_a) {
    var json = _a.json, options = _a.options, state = _a.state;
    return Object.entries(state)
        .map(processSignalStateValue({ options: options, component: json }))
        /**
         * We need to sort state so that signals are at the top.
         */
        .sort(function (a, b) {
        var aHasSignal = a.includes('createSignal(');
        var bHasSignal = b.includes('createSignal(');
        if (aHasSignal && !bHasSignal) {
            return -1;
        }
        else if (!aHasSignal && bHasSignal) {
            return 1;
        }
        else {
            return 0;
        }
    })
        .join(LINE_ITEM_DELIMITER);
};
exports.getSignalsCode = getSignalsCode;
