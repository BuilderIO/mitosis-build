"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
function MyMasicRefComponent(props) {
    var inputRef = mitosis_1.useRef('default value');
    function handlerClick(event) {
        event.preventDefault();
        console.log('current value', inputRef);
        inputRef = 'lol';
    }
    return (<div>
      <button onClick={handlerClick}>Click</button>
    </div>);
}
exports.default = MyMasicRefComponent;
