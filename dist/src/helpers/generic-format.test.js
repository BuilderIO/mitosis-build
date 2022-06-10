"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var generic_format_1 = require("./generic-format");
(0, globals_1.test)('Can generic format sloppy Swift code', function () {
    var code = "\n  import SwiftUI\n  import JavaScriptCore\n  \n  struct MyComponent: View {\n    \n      @State private var updateIndex = 0\n      private var context = JSContext()\n  \n      func eval(expression: String) -> JSValue! {\n        return context?.evaluateScript(expression)\n      }\n  \n      init() {\n        let jsSource = \"\"\"\n            const state = { name: \"Steve\" };\n  \n        \"\"\"\n        context?.evaluateScript(jsSource)\n      }\n    \n  \n    var body: some View {\n      VStack {\n        Text(String(updateIndex)).hidden()\n        VStack(){\n        Foo(\n          bar: baz\n          )\n  TextField(){}\n  Text(\"Hello\")\n  Text(eval(expression: \"\"\"state.name\"\"\"))\n  Text(\"! I can run in React, Vue, Solid, or Liquid!\")}\n      }\n    }\n  }\n  ";
    (0, globals_1.expect)((0, generic_format_1.format)(code)).toMatchSnapshot();
});
