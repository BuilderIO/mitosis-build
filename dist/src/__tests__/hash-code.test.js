"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
describe('hashCode', function () {
    test('should compute object', function () {
        expect((0, __1.hashCodeAsString)({ foo: 'bar' })).toEqual('1jo4fm');
    });
    test('order of properties should not matter', function () {
        expect((0, __1.hashCodeAsString)({ a: 'first', b: 'second' })).toEqual((0, __1.hashCodeAsString)({ b: 'second', a: 'first' }));
    });
});
