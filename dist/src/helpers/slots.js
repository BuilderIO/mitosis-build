"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSlotsInString = exports.stripSlotPrefix = exports.isSlotProperty = void 0;
var core_1 = require("@babel/core");
var babel_transform_1 = require("./babel-transform");
var SLOT_PREFIX = 'slot';
var isSlotProperty = function (key, slotPrefix) {
    if (slotPrefix === void 0) { slotPrefix = SLOT_PREFIX; }
    return key.startsWith(slotPrefix);
};
exports.isSlotProperty = isSlotProperty;
var stripSlotPrefix = function (key, slotPrefix) {
    if (slotPrefix === void 0) { slotPrefix = SLOT_PREFIX; }
    return (0, exports.isSlotProperty)(key, slotPrefix) ? key.substring(slotPrefix.length) : key;
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
