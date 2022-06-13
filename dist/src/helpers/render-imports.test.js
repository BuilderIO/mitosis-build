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
        var output = (0, render_imports_1.renderImport)({ theImport: data[0], target: 'vue' });
        expect(output).toBe("import  RenderBlocks,  {  }  from '../render-blocks.vue';");
    });
});
