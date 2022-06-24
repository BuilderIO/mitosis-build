"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var custom_mitosis_1 = require("@dummy/custom-mitosis");
function MyBasicComponent() {
    var state = (0, custom_mitosis_1.useStore)({
        name: 'PatrickJS',
    });
    return <div>Hello {state.name}! I can run in React, Qwik, Vue, Solid, or Liquid!</div>;
}
exports.default = MyBasicComponent;
