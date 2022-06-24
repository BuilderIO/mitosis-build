"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastClone = void 0;
var fastClone = function (obj) { return JSON.parse(JSON.stringify(obj)); };
exports.fastClone = fastClone;
