"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyMasicRefComponent(props) {
    var inputRef = (0, mitosis_1.useRef)();
    var state = (0, mitosis_1.useState)({
        name: 'PatrickJS',
    });
    function onBlur() {
        // Maintain focus
        inputRef.focus();
    }
    function lowerCaseName() {
        return state.name.toLowerCase();
    }
    return (<div>
      {props.showInput && (<>
          <input ref={inputRef} css={{
                color: 'red',
            }} value={state.name} onBlur={function (event) { return onBlur(); }} onChange={function (event) { return (state.name = event.target.value); }}/>

          <label for="cars">Choose a car:</label>

          <select name="cars" id="cars">
            <option value="supra">GR Supra</option>
            <option value="86">GR 86</option>
          </select>
        </>)}
      Hello
      {lowerCaseName()}! I can run in React, Qwik, Vue, Solid, or Web Component!
    </div>);
}
exports.default = MyMasicRefComponent;