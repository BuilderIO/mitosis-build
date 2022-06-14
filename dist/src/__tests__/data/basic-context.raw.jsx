"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
var injection_js_1 = require("@dummy/injection-js");
function MyBasicComponent() {
    (0, mitosis_1.setContext)(injection_js_1.Injector, (0, injection_js_1.createInjector)());
    var myService = (0, mitosis_1.useContext)(injection_js_1.MyService);
    var state = (0, mitosis_1.useStore)({
        name: 'PatrickJS',
    });
    (0, mitosis_1.onInit)(function () {
        var hi = myService.method('hi');
        console.log(hi);
    });
    (0, mitosis_1.onMount)(function () {
        var bye = myService.method('hi');
        console.log(bye);
    });
    function onChange() {
        var change = myService.method('change');
        console.log(change);
    }
    return (<div>
      {myService.method('hello') + state.name}
      Hello! I can run in React, Vue, Solid, or Liquid!
      <input onChange={onChange}></input>
    </div>);
}
exports.default = MyBasicComponent;
