"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSlotsInString = exports.stripSlotPrefix = exports.isSlotProperty = void 0;
var core_1 = require("@babel/core");
var babel_transform_1 = require("./babel-transform");
var SLOT_PREFIX = 'slot';
var isSlotProperty = function (key) { return key.startsWith(SLOT_PREFIX); };
exports.isSlotProperty = isSlotProperty;
var stripSlotPrefix = function (key) {
    return (0, exports.isSlotProperty)(key) ? key.substring(SLOT_PREFIX.length) : key;
};
exports.stripSlotPrefix = stripSlotPrefix;
function replaceSlotsInString(code, mapper) {
    return (0, babel_transform_1.babelTransformExpression)(code, {
        Identifier: function (path) {
            var name = path.node.name;
            var isSlot = (0, exports.isSlotProperty)(name);
            if (isSlot) {
                path.replaceWith(core_1.types.identifier(mapper((0, exports.stripSlotPrefix)(name).toLowerCase())));
            }
        },
    });
}
exports.replaceSlotsInString = replaceSlotsInString;
