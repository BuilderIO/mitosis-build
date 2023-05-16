"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStateCode = exports.getStateTypeForValue = exports.getStateSetterName = void 0;
var core_1 = require("@babel/core");
var function_1 = require("fp-ts/lib/function");
var capitalize_1 = require("../../../helpers/capitalize");
var replace_identifiers_1 = require("../../../helpers/replace-identifiers");
var strip_state_and_props_refs_1 = require("../../../helpers/strip-state-and-props-refs");
var transform_state_setters_1 = require("../../../helpers/transform-state-setters");
var getStateSetterName = function (stateName) { return "set".concat((0, capitalize_1.capitalize)(stateName)); };
exports.getStateSetterName = getStateSetterName;
var getStateTypeForValue = function (_a) {
    var _b, _c, _d, _e;
    var value = _a.value, component = _a.component, options = _a.options;
    // e.g. state.useContent?.blocks[0].id => useContent
    var extractStateSliceName = (0, strip_state_and_props_refs_1.stripStateAndPropsRefs)(value).split('.')[0].split('?')[0];
    var stateOverrideForValue = (_e = (_d = (_c = (_b = component.meta) === null || _b === void 0 ? void 0 : _b.useMetadata) === null || _c === void 0 ? void 0 : _c.solid) === null || _d === void 0 ? void 0 : _d.state) === null || _e === void 0 ? void 0 : _e[extractStateSliceName];
    var stateType = stateOverrideForValue || options.state;
    return stateType;
};
exports.getStateTypeForValue = getStateTypeForValue;
var getNewStateSetterExpression = function (stateType) {
    return function (_a) {
        var path = _a.path, propertyName = _a.propertyName;
        /**
         * passes the value to the setter function
         * ```ts
         * // BEFORE
         * state.count = newCount
         * // AFTER
         * setCount(newCount)
         * ```
         */
        var callValueSetter = function (args) {
            return core_1.types.callExpression(core_1.types.identifier((0, exports.getStateSetterName)(propertyName)), [args]);
        };
        switch (stateType) {
            case 'signals':
                return callValueSetter(path.node.right);
            case 'store':
                /**
                 * Wrap value in a reconcile() call for Stores updates
                 * ```ts
                 * // BEFORE
                 * state.count = newCount
                 * // AFTER
                 * setCount(reconcile(newCount))
                 * ```
                 */
                return callValueSetter(core_1.types.callExpression(core_1.types.identifier('reconcile'), [path.node.right]));
        }
    };
};
var updateStateSettersInCode = function (_a) {
    var options = _a.options, component = _a.component;
    return function (value) {
        var stateType = (0, exports.getStateTypeForValue)({ value: value, component: component, options: options });
        switch (stateType) {
            case 'mutable':
                return value;
            case 'store':
            case 'signals':
                try {
                    return (0, transform_state_setters_1.transformStateSetters)({
                        value: value,
                        transformer: getNewStateSetterExpression(stateType),
                    });
                }
                catch (error) {
                    console.error("[Solid.js]: could not update state setters in ".concat(stateType, " code"), value);
                    throw error;
                }
        }
    };
};
var updateStateGettersInCode = function (options, component) {
    return (0, replace_identifiers_1.replaceStateIdentifier)(function (name) {
        var stateType = (0, exports.getStateTypeForValue)({ value: name, component: component, options: options });
        var state = component.state[name];
        switch (stateType) {
            case 'signals':
                if (
                // signal accessors are lazy, so we need to add a function call to property calls
                (state === null || state === void 0 ? void 0 : state.type) === 'property' ||
                    // getters become plain functions, requiring a function call to access their value
                    (state === null || state === void 0 ? void 0 : state.type) === 'getter') {
                    return "".concat(name, "()");
                }
                else {
                    return name;
                }
            case 'store':
            case 'mutable':
                return name;
        }
    });
};
var updateStateCode = function (_a) {
    var options = _a.options, component = _a.component, _b = _a.updateSetters, updateSetters = _b === void 0 ? true : _b;
    return (0, function_1.flow)(updateSetters ? updateStateSettersInCode({ options: options, component: component }) : function_1.identity, updateStateGettersInCode(options, component), function (x) { return x.trim(); });
};
exports.updateStateCode = updateStateCode;
