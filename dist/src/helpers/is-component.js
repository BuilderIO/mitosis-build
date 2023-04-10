"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComponent = void 0;
/**
 * This node is a component, vs a plain html tag (<Foo> vs <div>)
 */
var isComponent = function (json) { return json.name.toLowerCase() !== json.name; };
exports.isComponent = isComponent;
