"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrevious = void 0;
var mitosis_1 = require("@builder.io/mitosis");
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    var ref = (0, mitosis_1.useRef)(null);
    // Store current value in ref
    (0, mitosis_1.onUpdate)(function () {
        ref = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref;
}
exports.usePrevious = usePrevious;
function MyPreviousComponent(props) {
    var state = (0, mitosis_1.useState)({
        count: 0,
    });
    var prevCount = (0, mitosis_1.useRef)(state.count);
    (0, mitosis_1.onUpdate)(function () {
        prevCount = state.count;
    }, [state.count]); //
    // Get the previous value (was passed into hook on last render)
    // const prevCount = usePrevious(state.count);
    // Display both current and previous count value
    return (<div>
      <h1>
        Now: {state.count}, before: {prevCount}
      </h1>
      <button onClick={function () { return (state.count += 1); }}>Increment</button>
    </div>);
}
exports.default = MyPreviousComponent;
