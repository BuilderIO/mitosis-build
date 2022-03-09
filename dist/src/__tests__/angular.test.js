"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("../generators/angular");
var jsx_1 = require("../parsers/jsx");
var onUpdate = require('./data/blocks/onUpdate.raw');
describe('Angular', function () {
    test('onUpdate', function () {
        var component = (0, jsx_1.parseJsx)(onUpdate);
        var output = (0, angular_1.componentToAngular)()({ component: component });
        expect(output).toMatchSnapshot();
    });
});
