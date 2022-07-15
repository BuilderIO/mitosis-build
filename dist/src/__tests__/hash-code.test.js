"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
describe('hashCode', function () {
    test('should compute object', function () {
        expect((0, __1.hashCodeAsString)({ foo: 'bar' })).toEqual('1jo4fm');
    });
});
