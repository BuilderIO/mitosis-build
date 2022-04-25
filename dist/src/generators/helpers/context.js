"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasContext = void 0;
var hasContext = function (component) {
    return Boolean(Object.keys(component.context.get).length ||
        Object.keys(component.context.set).length);
};
exports.hasContext = hasContext;
