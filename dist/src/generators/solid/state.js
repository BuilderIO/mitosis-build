"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getState = exports.updateStateCode = void 0;
var core_1 = require("@babel/core");
var json5_1 = __importDefault(require("json5"));
var strip_state_and_props_refs_1 = require("../../helpers/strip-state-and-props-refs");
var babel_transform_1 = require("../../helpers/babel-transform");
var capitalize_1 = require("../../helpers/capitalize");
var get_state_object_string_1 = require("../../helpers/get-state-object-string");
var function_literal_prefix_1 = require("../../constants/function-literal-prefix");
var method_literal_prefix_1 = require("../../constants/method-literal-prefix");
var function_1 = require("fp-ts/lib/function");
var state_1 = require("../../helpers/state");
var getStateSetterName = function (stateName) { return "set".concat((0, capitalize_1.capitalize)(stateName)); };
var updateStateSettersInCode = function (options) { return function (value) {
    switch (options.state) {
        case 'mutable':
            return value;
        case 'signals':
            try {
                return (0, babel_transform_1.babelTransformExpression)(value, {
                    AssignmentExpression: function (path) {
                        var node = path.node;
                        if (core_1.types.isMemberExpression(node.left)) {
                            if (core_1.types.isIdentifier(node.left.object)) {
                                // TODO: utillity to properly trace this reference to the beginning
                                if (node.left.object.name === 'state') {
                                    // TODO: ultimately support other property access like strings
                                    var propertyName = node.left.property.name;
                                    path.replaceWith(core_1.types.callExpression(core_1.types.identifier(getStateSetterName(propertyName)), [
                                        node.right,
                                    ]));
                                }
                            }
                        }
                    },
                });
            }
            catch (error) {
                console.log('[Solid.js]: could not update state setters in signals code', value);
                throw error;
            }
    }
}; };
var updateStateGettersInCode = function (options, component) { return function (value) {
    switch (options.state) {
        case 'mutable':
            return value;
        case 'signals':
            return (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value, {
                includeState: true,
                includeProps: false,
                replaceWith: function (name) {
                    var state = component.state[name];
                    if (options.state === 'signals' &&
                        // signal accessors are lazy, so we need to add a function call to property calls
                        ((state === null || state === void 0 ? void 0 : state.type) === 'property' ||
                            // getters become plain functions, requiring a function call to access their value
                            (state === null || state === void 0 ? void 0 : state.type) === 'getter')) {
                        return "".concat(name, "()");
                    }
                    return name;
                },
            });
    }
}; };
var updateStateCode = function (_a) {
    var options = _a.options, component = _a.component, _b = _a.updateSetters, updateSetters = _b === void 0 ? true : _b;
    return (0, function_1.flow)(updateSetters ? updateStateSettersInCode(options) : function_1.identity, updateStateGettersInCode(options, component), function (x) { return x.trim(); });
};
exports.updateStateCode = updateStateCode;
var processStateValue = function (_a) {
    var options = _a.options, component = _a.component;
    var mapValue = (0, exports.updateStateCode)({ options: options, component: component });
    return function (_a) {
        var key = _a[0], state = _a[1];
        var code = state === null || state === void 0 ? void 0 : state.code;
        if (typeof code === 'string') {
            if (code.startsWith(function_literal_prefix_1.functionLiteralPrefix)) {
                // functions
                var useValue = code.replace(function_literal_prefix_1.functionLiteralPrefix, '');
                var mappedVal = mapValue(useValue);
                return mappedVal;
            }
            else if (code.startsWith(method_literal_prefix_1.methodLiteralPrefix)) {
                // methods
                var methodValue = code.replace(method_literal_prefix_1.methodLiteralPrefix, '');
                var strippedMethodvalue = (0, function_1.pipe)(methodValue.replace('get ', ''), mapValue);
                return "function ".concat(strippedMethodvalue);
            }
        }
        // Other (data)
        var transformedValue = (0, function_1.pipe)(code, json5_1.default.stringify, mapValue);
        var defaultCase = "const [".concat(key, ", ").concat(getStateSetterName(key), "] = createSignal(").concat(transformedValue, ")");
        return defaultCase;
    };
};
var LINE_ITEM_DELIMITER = '\n\n\n';
var getSignalsCode = function (_a) {
    var json = _a.json, options = _a.options;
    return Object.entries(json.state)
        .map(processStateValue({ options: options, component: json }))
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
var getState = function (_a) {
    var json = _a.json, options = _a.options;
    var hasState = (0, state_1.checkHasState)(json);
    if (!hasState) {
        return undefined;
    }
    switch (options.state) {
        case 'mutable':
            var stateString = (0, function_1.pipe)((0, get_state_object_string_1.getStateObjectStringFromComponent)(json), function (str) { return "const state = createMutable(".concat(str, ");"); });
            return {
                str: stateString,
                import: { store: ['createMutable'] },
            };
        case 'signals':
            return {
                str: getSignalsCode({ json: json, options: options }),
                import: { solidjs: ['createSignal'] },
            };
    }
};
exports.getState = getState;
