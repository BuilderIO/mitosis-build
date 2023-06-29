"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContextType = exports.hasGetContext = exports.hasSetContext = exports.hasContext = void 0;
var hasContext = function (component) {
    return (0, exports.hasSetContext)(component) || (0, exports.hasGetContext)(component);
};
exports.hasContext = hasContext;
var hasSetContext = function (component) {
    return Object.keys(component.context.set).length > 0;
};
exports.hasSetContext = hasSetContext;
var hasGetContext = function (component) {
    return Object.keys(component.context.get).length > 0;
};
exports.hasGetContext = hasGetContext;
var getContextType = function (_a) {
    var _b, _c;
    var component = _a.component, context = _a.context;
    // TO-DO: remove useMetadata check if no longer needed.
    return ((_c = (_b = component.meta.useMetadata) === null || _b === void 0 ? void 0 : _b.contextTypes) === null || _c === void 0 ? void 0 : _c[context.name]) || context.type || 'normal';
};
exports.getContextType = getContextType;
