"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMitosisNode = void 0;
var isMitosisNode = function (thing) {
    return Boolean(thing && thing['@type'] === '@builder.io/mitosis/node');
};
exports.isMitosisNode = isMitosisNode;
