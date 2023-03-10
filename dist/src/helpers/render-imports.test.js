"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var render_imports_1 = require("./render-imports");
describe('renderImport', function () {
    test('Adds correct extension to component import', function () {
        var data = [
            {
                imports: { RenderBlocks: 'default' },
                path: '../render-blocks.lite',
            },
        ];
        var output = (0, render_imports_1.renderImport)({
            theImport: data[0],
            target: 'vue',
            asyncComponentImports: false,
        });
        expect(output).toMatchSnapshot();
    });
    test('Adds correctly a side-effect import', function () {
        var data = [
            {
                imports: {},
                path: '../render-blocks.scss',
            },
        ];
        var output = (0, render_imports_1.renderImport)({
            theImport: data[0],
            target: 'react',
            asyncComponentImports: false,
        });
        expect(output).toEqual("import '../render-blocks.scss';");
    });
});
