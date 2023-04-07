"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remove_surrounding_block_1 = require("./remove-surrounding-block");
describe('removeSurroundingBlock', function () {
    test('It removes the surrounding wrapper block', function () {
        var output = (0, remove_surrounding_block_1.removeSurroundingBlock)('{ const foo = "bar" }');
        expect(output).toBe(' const foo = "bar" ');
    });
});
