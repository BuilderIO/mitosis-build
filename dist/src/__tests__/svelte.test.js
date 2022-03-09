"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svelte_1 = require("../generators/svelte");
var jsx_1 = require("../parsers/jsx");
var onUpdate = require('./data/blocks/onUpdate.raw');
describe('Svelte', function () {
    test('onUpdate', function () {
        var component = (0, jsx_1.parseJsx)(onUpdate);
        var output = (0, svelte_1.componentToSvelte)()({ component: component });
        expect(output).toMatchSnapshot();
    });
});
