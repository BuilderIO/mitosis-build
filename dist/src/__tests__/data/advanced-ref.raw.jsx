"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicRefComponent(props) {
    var inputRef = (0, mitosis_1.useRef)(null);
    var inputNoArgRef = (0, mitosis_1.useRef)(null);
    var state = (0, mitosis_1.useStore)({
        name: 'PatrickJS',
    });
    function onBlur() {
        // Maintain focus
        inputRef.focus();
    }
    function lowerCaseName() {
        return state.name.toLowerCase();
    }
    (0, mitosis_1.onUpdate)(function () {
        console.log('Received an update');
    }, [inputRef, inputNoArgRef]);
    return (<div>
      {props.showInput && (<>
          <input ref={inputRef} css={{
                color: 'red',
            }} value={state.name} onBlur={function (event) { return onBlur(); }} onChange={function (event) { return (state.name = event.target.value); }}/>

          <label ref={inputNoArgRef} for="cars">
            Choose a car:
          </label>

          <select name="cars" id="cars">
            <option value="supra">GR Supra</option>
            <option value="86">GR 86</option>
          </select>
        </>)}
      Hello
      {lowerCaseName()}! I can run in React, Qwik, Vue, Solid, or Web Component!
    </div>);
}
exports.default = MyBasicRefComponent;
