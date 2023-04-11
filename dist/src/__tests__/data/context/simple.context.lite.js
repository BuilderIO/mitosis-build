"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
exports.default = (0, mitosis_1.createContext)({
    foo: 'bar',
    get fooUpperCase() {
        return this.foo.toUpperCase();
    },
    someMethod: function () {
        return this.fooUpperCase.toLowercase();
    },
    content: null,
    context: {},
    state: {},
});
