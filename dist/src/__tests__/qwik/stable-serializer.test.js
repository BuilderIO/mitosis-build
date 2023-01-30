"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stable_serialize_1 = require("../../generators/qwik/stable-serialize");
describe('stable-serializer', function () {
    test('is an expression', function () {
        expect((0, stable_serialize_1.stableJSONserialize)({})).toBe('{}');
        expect((0, stable_serialize_1.stableJSONserialize)({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
        expect((0, stable_serialize_1.stableJSONserialize)([1, undefined])).toBe('[1,null]');
    });
});
