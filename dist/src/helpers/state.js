"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHasState = void 0;
var checkHasState = function (component) {
    return Boolean(Object.keys(component.state).length);
};
exports.checkHasState = checkHasState;
