"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripMetaProperties = void 0;
var traverse_1 = __importDefault(require("traverse"));
var is_mitosis_node_1 = require("./is-mitosis-node");
var stripMetaProperties = function (json) {
    (0, traverse_1.default)(json).forEach(function (item) {
        if ((0, is_mitosis_node_1.isMitosisNode)(item)) {
            for (var property in item.properties) {
                if (property.startsWith('$')) {
                    delete item.properties[property];
                }
            }
            for (var property in item.bindings) {
                if (property.startsWith('$')) {
                    delete item.bindings[property];
                }
            }
        }
    });
    return json;
};
exports.stripMetaProperties = stripMetaProperties;
