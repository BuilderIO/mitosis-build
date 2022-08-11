"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapJsonObjectToStateValue = exports.checkHasState = void 0;
var lodash_1 = require("lodash");
var checkHasState = function (component) {
    return Boolean(Object.keys(component.state).length);
};
exports.checkHasState = checkHasState;
var mapJsonToStateValue = function (value) { return ({
    code: value,
    type: 'property',
}); };
var mapJsonObjectToStateValue = function (value) {
    return (0, lodash_1.mapValues)(value, mapJsonToStateValue);
};
exports.mapJsonObjectToStateValue = mapJsonObjectToStateValue;
