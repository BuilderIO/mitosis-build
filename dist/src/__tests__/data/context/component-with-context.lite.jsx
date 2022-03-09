"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1_1 = __importDefault(require("@dummy/1"));
var _2_1 = __importDefault(require("@dummy/2"));
var mitosis_1 = require("@builder.io/mitosis");
function ComponentWithContext() {
    var foo = (0, mitosis_1.useContext)(_1_1.default);
    (0, mitosis_1.setContext)(_1_1.default, { foo: 'bar' });
    return (<_2_1.default.Provider value={{ bar: 'baz' }}>
      <>{foo.value}</>
    </_2_1.default.Provider>);
}
exports.default = ComponentWithContext;
