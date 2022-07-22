"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSlotProperty = void 0;
var SLOT_PREFIX = 'slot';
var isSlotProperty = function (key) { return key.startsWith(SLOT_PREFIX); };
exports.isSlotProperty = isSlotProperty;
