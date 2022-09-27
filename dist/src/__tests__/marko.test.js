"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marko_1 = require("../generators/marko");
var shared_1 = require("./shared");
describe('Marko format', function () {
    var exampleCode = "\n    <div>\n      <if(input.foo === 'bar')>\n        Hello\n      </if>\n      <for|items| of=(some.long ? expression : yo)>\n        World\n      </for>\n      <input \n        placeholder=\"Hello world...\"\n        value=(this.state.name) \n        on-click=(event => {\n          console.log('hello', \"world\")\n        })\n        on-input=(event => this.state.name = event.target.value) /> \n        \n        Hello! I can run in React, Vue, Solid, or Liquid!\n    </div>";
    var preprocessed = (0, marko_1.preprocessHtml)(exampleCode);
    expect(preprocessed).toMatchSnapshot();
    expect((0, marko_1.postprocessHtml)(preprocessed)).toMatchSnapshot();
    expect((0, marko_1.markoFormatHtml)(exampleCode)).toMatchSnapshot();
});
describe('Marko', function () {
    (0, shared_1.runTestsForTarget)('marko', (0, marko_1.componentToMarko)());
});
