"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var convert_method_to_function_1 = require("../../generators/qwik/helpers/convert-method-to-function");
describe('convertMethodToFunction', function () {
    var methodMap = {
        methodA: 'method',
        getterB: 'getter',
        getCssFromFont: 'method',
    };
    var lexicalArgs = ['props', 'state'];
    describe('rewrite', function () {
        test('method', function () {
            expect((0, convert_method_to_function_1.convertMethodToFunction)('this.methodA(123)', methodMap, lexicalArgs)).toEqual('methodA(props,state,123)');
        });
        test('getter', function () {
            expect((0, convert_method_to_function_1.convertMethodToFunction)('this.getterB', methodMap, lexicalArgs)).toEqual('getterB(props,state)');
        });
        test('method binding', function () {
            expect((0, convert_method_to_function_1.convertMethodToFunction)('this.methodA', methodMap, lexicalArgs)).toEqual('methodA.bind(null,props,state)');
        });
        test('handle comments', function () {
            expect((0, convert_method_to_function_1.convertMethodToFunction)('//\nreturn this.getterB;', methodMap, lexicalArgs)).toEqual('//\nreturn getterB(props,state);');
        });
        test('braces', function () {
            var code = 'getFontCss({}: {}) { this.getCssFromFont(font) }';
            expect((0, convert_method_to_function_1.convertMethodToFunction)(code, methodMap, lexicalArgs)).toEqual('getFontCss({}: {}) { getCssFromFont(props,state,font) }');
        });
    });
    describe('string', function () {
        test('should not rewrite string', function () {
            expect((0, convert_method_to_function_1.convertMethodToFunction)('"this.getterB"', methodMap, lexicalArgs)).toEqual('"this.getterB"');
        });
        test('should rewrite template string', function () {
            expect((0, convert_method_to_function_1.convertMethodToFunction)('`${this.getterB}this.getterB`', methodMap, lexicalArgs)).toEqual('`${getterB(props,state)}this.getterB`');
        });
    });
});
