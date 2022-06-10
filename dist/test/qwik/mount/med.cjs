const componentQrl = require("@builder.io/qwik").componentQrl;
const qrl = require("@builder.io/qwik").qrl;
exports.MyComponent = componentQrl(qrl("./low.js", "MyComponent_onMount", []));
