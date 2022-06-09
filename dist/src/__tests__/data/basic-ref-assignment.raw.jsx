"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyBasicRefAssignmentComponent(props) {
    var holdValueRef = (0, mitosis_1.useRef)('Patrick');
    function handlerClick(event) {
        event.preventDefault();
        console.log('current value', holdValueRef);
        holdValueRef = holdValueRef + 'JS';
    }
    return (<div>
      <button onClick={function (evt) { return handlerClick(evt); }}>Click</button>
    </div>);
}
exports.default = MyBasicRefAssignmentComponent;
