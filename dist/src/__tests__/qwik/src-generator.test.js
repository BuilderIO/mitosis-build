"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_generator_1 = require("../../generators/qwik/src-generator");
describe('src-generator', function () {
    describe('isStatement', function () {
        test('is an expression', function () {
            expect((0, src_generator_1.isStatement)('a.b')).toBe(false);
            expect((0, src_generator_1.isStatement)('1?2:"bar"')).toBe(false);
            expect((0, src_generator_1.isStatement)('"var x; return foo + \'\\"\';"')).toBe(false);
            expect((0, src_generator_1.isStatement)('"foo" + `bar\nbaz`')).toBe(false);
            expect((0, src_generator_1.isStatement)('(...)()')).toBe(false);
        });
        test('regression', function () {
            expect((0, src_generator_1.isStatement)('props.attributes?.class || props.attributes?.className')).toBe(false);
        });
        test('is a statement', function () {
            expect((0, src_generator_1.isStatement)('var x; return x;')).toBe(true);
            expect((0, src_generator_1.isStatement)('var x')).toBe(true);
        });
        test('regressions', function () {
            expect((0, src_generator_1.isStatement)("if(state.deviceSize == \"small\"){    \r\n    return\r\n}\r\n\r\nif (state.imageLeft){    \r\n    return 'row-reverse'\r\n}\r\n\r\nreturn 'row'")).toBe(true);
            expect((0, src_generator_1.isStatement)("if (state.imageLeft){     return 'flex-direction: row-reverse;' }")).toBe(true);
            expect((0, src_generator_1.isStatement)('() => null')).toBe(true);
        });
    });
    describe('import', function () {
        var options;
        var src;
        describe('module', function () {
            beforeEach(function () {
                options = {
                    isJSX: true,
                    isPretty: false,
                    isTypeScript: false,
                    isModule: true,
                    isBuilder: false,
                };
                src = new src_generator_1.SrcBuilder(new src_generator_1.File('test', options, '', ''), options);
            });
            test('import to string', function () {
                src.import('module', [new src_generator_1.Symbol('importName', 'asLocalName')]);
                expect(src.toString()).toEqual('import{importName as asLocalName}from"module";');
            });
            test('import from default', function () {
                src.import('module', [new src_generator_1.Symbol('default', 'asLocalName')]);
                expect(src.toString()).toEqual('import asLocalName from"module";');
            });
        });
        describe('require', function () {
            beforeEach(function () {
                options = {
                    isJSX: true,
                    isPretty: false,
                    isTypeScript: false,
                    isModule: false,
                    isBuilder: false,
                };
                src = new src_generator_1.SrcBuilder(new src_generator_1.File('test', options, '', ''), options);
            });
            test('import to string', function () {
                src.import('module', [new src_generator_1.Symbol('importName', 'asLocalName')]);
                expect(src.toString()).toEqual('const asLocalName=require("module").importName;');
            });
            test('import from default', function () {
                src.import('module', [new src_generator_1.Symbol('default', 'asLocalName')]);
                expect(src.toString()).toEqual('const asLocalName=require("module");');
            });
        });
    });
});
