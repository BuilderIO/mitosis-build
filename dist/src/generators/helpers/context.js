"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasGetContext = exports.hasSetContext = exports.hasContext = void 0;
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
